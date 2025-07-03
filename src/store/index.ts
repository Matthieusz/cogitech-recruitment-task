import { createStore } from 'vuex'
import type { Post, User, PostWithAuthor } from '@/types'

export interface State {
  posts: Post[]
  users: User[]
  postsWithAuthors: PostWithAuthor[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPosts: number
  postsPerPage: number
}

const store = createStore<State>({
  state: {
    posts: [],
    users: [],
    postsWithAuthors: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPosts: 0,
    postsPerPage: 10,
  },

  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },

    SET_ERROR(state, error: string | null) {
      state.error = error
    },

    SET_POSTS(state, posts: Post[]) {
      state.posts = posts
      state.totalPosts = posts.length
    },

    SET_USERS(state, users: User[]) {
      state.users = users
    },

    SET_POSTS_WITH_AUTHORS(state, postsWithAuthors: PostWithAuthor[]) {
      state.postsWithAuthors = postsWithAuthors
    },

    SET_CURRENT_PAGE(state, page: number) {
      state.currentPage = page
    },

    DELETE_POST(state, postId: number) {
      state.posts = state.posts.filter((post) => post.id !== postId)
      state.postsWithAuthors = state.postsWithAuthors.filter((post) => post.id !== postId)
      state.totalPosts = state.posts.length
    },
  },

  actions: {
    async fetchPosts({ commit, dispatch }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // network delay to better show the loading state
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) {
          throw new Error('Nie udało się pobrać postów')
        }

        const posts: Post[] = await response.json()
        commit('SET_POSTS', posts)

        await dispatch('fetchUsers')
        dispatch('combinePostsWithAuthors')
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'Wystąpił nieznany błąd')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchUsers({ commit }) {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!response.ok) {
          throw new Error('Nie udało się pobrać użytkowników')
        }

        const users: User[] = await response.json()
        commit('SET_USERS', users)
      } catch (error) {
        commit(
          'SET_ERROR',
          error instanceof Error ? error.message : 'Wystąpił błąd przy pobieraniu użytkowników',
        )
      }
    },

    combinePostsWithAuthors({ commit, state }) {
      const postsWithAuthors: PostWithAuthor[] = state.posts.map((post) => {
        const author = state.users.find((user) => user.id === post.userId)
        return {
          ...post,
          author: author || {
            id: 0,
            name: 'Nieznany autor',
            username: '',
            email: '',
            address: {
              street: '',
              suite: '',
              city: '',
              zipcode: '',
              geo: { lat: '', lng: '' },
            },
            phone: '',
            website: '',
            company: {
              name: '',
              catchPhrase: '',
              bs: '',
            },
          },
        }
      })

      commit('SET_POSTS_WITH_AUTHORS', postsWithAuthors)
    },

    setCurrentPage({ commit }, page: number) {
      commit('SET_CURRENT_PAGE', page)
    },

    deletePost({ commit }, postId: number) {
      commit('DELETE_POST', postId)
    },
  },

  getters: {
    paginatedPosts: (state) => {
      const start = (state.currentPage - 1) * state.postsPerPage
      const end = start + state.postsPerPage
      return state.postsWithAuthors.slice(start, end)
    },

    totalPages: (state) => {
      return Math.ceil(state.totalPosts / state.postsPerPage)
    },

    hasNextPage: (state, getters) => {
      return state.currentPage < getters.totalPages
    },

    hasPreviousPage: (state) => {
      return state.currentPage > 1
    },
  },
})

export default store
