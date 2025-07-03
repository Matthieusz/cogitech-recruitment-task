<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="bg-card shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-card-foreground">Cogitech Recruitment Task</h1>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span class="ml-3 text-muted-foreground">Ładowanie postów...</span>
      </div>

      <div
        v-else-if="error"
        class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center">
          <svg
            class="h-5 w-5 text-destructive mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-destructive">{{ error }}</p>
        </div>
      </div>

      <div v-else>
        <div v-if="totalPosts > 0" class="text-center text-sm text-muted-foreground mb-1">
          Wyświetlanie {{ (currentPage - 1) * postsPerPage + 1 }} -
          {{ Math.min(currentPage * postsPerPage, totalPosts) }} z {{ totalPosts }} postów
        </div>
        <div v-if="totalPages > 1" class="flex justify-center mb-4">
          <Pagination
            :total="totalPosts"
            :siblingCount="1"
            :defaultPage="1"
            :page="currentPage"
            :itemsPerPage="postsPerPage"
            :showEdges="true"
            @update:page="goToPage"
          >
            <PaginationContent v-slot="{ items }" class="gap-2">
              <PaginationItem :value="Math.max(1, currentPage - 1)" as-child>
                <PaginationPrevious :disabled="!hasPreviousPage">
                  <ArrowBigLeft />
                </PaginationPrevious>
              </PaginationItem>

              <template v-for="(page, index) in items" :key="index">
                <PaginationItem
                  v-if="page.type === 'page'"
                  :value="page.value"
                  :is-active="page.value === currentPage"
                  as-child
                >
                  <button
                    @click="goToPage(page.value)"
                    class="min-w-[2.5rem] h-10 flex items-center justify-center rounded-md transition-colors"
                    :class="
                      page.value === currentPage
                        ? 'text-primary'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    "
                  >
                    {{ page.value }}
                  </button>
                </PaginationItem>
                <PaginationEllipsis v-else :key="page.type" :index="index" />
              </template>

              <PaginationItem :value="Math.min(totalPages, currentPage + 1)" as-child>
                <PaginationNext :disabled="!hasNextPage">
                  <ArrowBigRight />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div
          v-if="paginatedPosts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" />
        </div>

        <div v-else class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h5a1 1 0 110 2h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h5z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-card-foreground">Brak postów</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            Nie znaleziono żadnych postów do wyświetlenia.
          </p>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <Pagination
            :total="totalPosts"
            :siblingCount="1"
            :defaultPage="1"
            :page="currentPage"
            :itemsPerPage="postsPerPage"
            :showEdges="true"
            @update:page="goToPage"
          >
            <PaginationContent v-slot="{ items }" class="gap-2">
              <PaginationItem :value="Math.max(1, currentPage - 1)" as-child>
                <PaginationPrevious :disabled="!hasPreviousPage">
                  <ArrowBigLeft />
                </PaginationPrevious>
              </PaginationItem>

              <template v-for="(page, index) in items" :key="index">
                <PaginationItem
                  v-if="page.type === 'page'"
                  :value="page.value"
                  :is-active="page.value === currentPage"
                  as-child
                >
                  <button
                    @click="goToPage(page.value)"
                    class="min-w-[2.5rem] h-10 flex items-center justify-center rounded-md transition-colors"
                    :class="
                      page.value === currentPage
                        ? 'text-primary'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    "
                  >
                    {{ page.value }}
                  </button>
                </PaginationItem>
                <PaginationEllipsis v-else :key="page.type" :index="index" />
              </template>

              <PaginationItem :value="Math.min(totalPages, currentPage + 1)" as-child>
                <PaginationNext :disabled="!hasNextPage">
                  <ArrowBigRight />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import PostCard from './PostCard.vue'
import type { State } from '@/store'
import ModeToggle from '@/components/ui/ModeToggle.vue'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next'

const store = useStore<State>()

const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)
const paginatedPosts = computed(() => store.getters.paginatedPosts)
const currentPage = computed(() => store.state.currentPage)
const totalPages = computed(() => store.getters.totalPages)
const hasNextPage = computed(() => store.getters.hasNextPage)
const hasPreviousPage = computed(() => store.getters.hasPreviousPage)
const totalPosts = computed(() => store.state.totalPosts)
const postsPerPage = computed(() => store.state.postsPerPage)

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    store.dispatch('setCurrentPage', page)
  }
}

onMounted(() => {
  store.dispatch('fetchPosts')
})
</script>
