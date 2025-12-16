'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { AppState, Video, Category } from '@/types'

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      videos: [],
      categories: [
        { id: '1', name: 'Tutorials', count: 0 },
        { id: '2', name: 'Entertainment', count: 0 },
        { id: '3', name: 'Music', count: 0 },
      ],
      selectedVideo: null,
      viewMode: 'grid',
      searchQuery: '',
      filterCategory: null,
      filterWatchStatus: null,
      filterTags: [],
      isNotesDrawerOpen: false,
      isOnboardingComplete: false,

      addVideo: (videoData) => {
        const video: Video = {
          ...videoData,
          id: nanoid(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => {
          // Update category count
          const categories = state.categories.map((cat) =>
            cat.name === video.category
              ? { ...cat, count: cat.count + 1 }
              : cat
          )

          return {
            videos: [video, ...state.videos],
            categories,
          }
        })
      },

      updateVideo: (id, updates) => {
        set((state) => {
          const video = state.videos.find((v) => v.id === id)
          if (!video) return state

          const oldCategory = video.category
          const newCategory = updates.category

          let categories = state.categories

          // Update category counts if category changed
          if (newCategory && oldCategory !== newCategory) {
            categories = state.categories.map((cat) => {
              if (cat.name === oldCategory) {
                return { ...cat, count: Math.max(0, cat.count - 1) }
              }
              if (cat.name === newCategory) {
                return { ...cat, count: cat.count + 1 }
              }
              return cat
            })
          }

          return {
            videos: state.videos.map((v) =>
              v.id === id
                ? { ...v, ...updates, updatedAt: Date.now() }
                : v
            ),
            categories,
            selectedVideo:
              state.selectedVideo?.id === id
                ? { ...state.selectedVideo, ...updates, updatedAt: Date.now() }
                : state.selectedVideo,
          }
        })
      },

      deleteVideo: (id) => {
        set((state) => {
          const video = state.videos.find((v) => v.id === id)
          if (!video) return state

          const categories = state.categories.map((cat) =>
            cat.name === video.category
              ? { ...cat, count: Math.max(0, cat.count - 1) }
              : cat
          )

          return {
            videos: state.videos.filter((v) => v.id !== id),
            categories,
            selectedVideo:
              state.selectedVideo?.id === id ? null : state.selectedVideo,
          }
        })
      },

      setSelectedVideo: (video) => set({ selectedVideo: video }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setFilterCategory: (category) => set({ filterCategory: category }),

      setFilterWatchStatus: (status) => set({ filterWatchStatus: status }),

      toggleNotesDrawer: () =>
        set((state) => ({ isNotesDrawerOpen: !state.isNotesDrawerOpen })),

      completeOnboarding: () => set({ isOnboardingComplete: true }),

      addCategory: (name) => {
        const newCategory: Category = {
          id: nanoid(),
          name,
          count: 0,
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
    }),
    {
      name: 'video-vault-storage',
    }
  )
)
