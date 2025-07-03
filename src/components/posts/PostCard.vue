<template>
  <div
    class="bg-card rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
  >
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-card-foreground mb-2 leading-tight">
        {{ post.title }}
      </h2>
      <p class="text-sm text-muted-foreground flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        {{ post.author.name }}
      </p>
    </div>

    <div class="mb-4 flex-grow">
      <p class="text-card-foreground leading-relaxed">
        {{ isExpanded ? post.body : truncatedBody }}
        <button
          v-if="shouldShowToggle"
          @click="toggleExpanded"
          class="ml-2 text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors duration-200"
        >
          {{ isExpanded ? 'zobacz mniej' : 'zobacz więcej' }}
        </button>
      </p>
    </div>

    <div class="flex justify-end pt-4 border-t mt-auto">
      <button
        @click="handleDelete"
        class="flex items-center px-4 py-2 text-destructive hover:text-destructive/90 hover:bg-destructive/20 rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Usuń post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import type { PostWithAuthor } from '@/types'

interface Props {
  post: PostWithAuthor
}

const props = defineProps<Props>()
const store = useStore()

const isExpanded = ref(false)
const maxLength = 120

const truncatedBody = computed(() => {
  if (props.post.body.length <= maxLength) {
    return props.post.body
  }
  return props.post.body.substring(0, maxLength) + '...'
})

const shouldShowToggle = computed(() => {
  return props.post.body.length > maxLength
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const handleDelete = () => {
  if (confirm('Czy na pewno chcesz usunąć ten post?')) {
    store.dispatch('deletePost', props.post.id)
  }
}
</script>
