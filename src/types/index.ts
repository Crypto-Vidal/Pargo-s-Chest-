export type WatchStatus = 'unwatched' | 'watching' | 'completed'

export type ViewMode = 'grid' | 'list'

export interface Video {
  id: string
  url: string
  title: string
  description?: string
  thumbnail?: string
  duration?: string
  category?: string
  tags: string[]
  notes: string
  watchStatus: WatchStatus
  watchProgress?: number // 0-100
  createdAt: number
  updatedAt: number
  platform?: 'youtube' | 'vimeo' | 'other'
}

export interface Category {
  id: string
  name: string
  color?: string
  count: number
}

export interface AppState {
  videos: Video[]
  categories: Category[]
  selectedVideo: Video | null
  viewMode: ViewMode
  searchQuery: string
  filterCategory: string | null
  filterWatchStatus: WatchStatus | null
  filterTags: string[]
  isNotesDrawerOpen: boolean
  isOnboardingComplete: boolean

  // Actions
  addVideo: (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateVideo: (id: string, updates: Partial<Video>) => void
  deleteVideo: (id: string) => void
  setSelectedVideo: (video: Video | null) => void
  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setFilterCategory: (category: string | null) => void
  setFilterWatchStatus: (status: WatchStatus | null) => void
  toggleNotesDrawer: () => void
  completeOnboarding: () => void
  addCategory: (name: string) => void
  deleteCategory: (id: string) => void
}

export interface OnboardingStep {
  title: string
  description: string
  icon: string
  visual?: React.ReactNode
}
