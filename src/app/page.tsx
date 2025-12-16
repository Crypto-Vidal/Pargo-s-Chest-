'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import CircuitBackground from '@/components/CircuitBackground'
import TopNav from '@/components/layout/TopNav'
import LeftRail from '@/components/layout/LeftRail'
import NotesDrawer from '@/components/layout/NotesDrawer'
import VideoCard from '@/components/video/VideoCard'
import VideoListItem from '@/components/video/VideoListItem'
import OnboardingModal from '@/components/modals/OnboardingModal'
import { Video } from '@/types'

export default function Home() {
  const [isLeftRailOpen, setIsLeftRailOpen] = useState(false)

  const {
    videos,
    viewMode,
    searchQuery,
    filterCategory,
    filterWatchStatus,
  } = useStore()

  // Filter and search videos
  const filteredVideos = useMemo(() => {
    let result: Video[] = videos

    // Filter by category
    if (filterCategory) {
      result = result.filter((v) => v.category === filterCategory)
    }

    // Filter by watch status
    if (filterWatchStatus) {
      result = result.filter((v) => v.watchStatus === filterWatchStatus)
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.notes.toLowerCase().includes(query) ||
          v.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          v.category?.toLowerCase().includes(query)
      )
    }

    // Sort by most recent
    return result.sort((a, b) => b.createdAt - a.createdAt)
  }, [videos, searchQuery, filterCategory, filterWatchStatus])

  return (
    <div className="min-h-screen relative">
      {/* Circuit Background */}
      <CircuitBackground />

      {/* Onboarding */}
      <OnboardingModal />

      {/* Layout */}
      <div className="relative z-10">
        {/* Top Nav */}
        <TopNav onMenuClick={() => setIsLeftRailOpen(true)} />

        {/* Main Layout */}
        <div className="flex">
          {/* Left Rail */}
          <LeftRail
            isOpen={isLeftRailOpen}
            onClose={() => setIsLeftRailOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 pt-16 lg:pt-20 min-h-screen">
            <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {filterCategory
                    ? filterCategory
                    : filterWatchStatus
                    ? filterWatchStatus.charAt(0).toUpperCase() +
                      filterWatchStatus.slice(1)
                    : 'All Videos'}
                </h2>
                <p className="text-sm text-white/60">
                  {filteredVideos.length}{' '}
                  {filteredVideos.length === 1 ? 'video' : 'videos'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* Videos */}
              {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-12 h-12 text-white/20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6h16M4 12h16M4 18h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                  <p className="text-white/60 max-w-md">
                    {searchQuery
                      ? "No videos match your search. Try different keywords."
                      : "Start building your video library by clicking 'Add Video' above."}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-3 max-w-5xl">
                  <AnimatePresence mode="popLayout">
                    {filteredVideos.map((video) => (
                      <VideoListItem key={video.id} video={video} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Notes Drawer */}
        <NotesDrawer />
      </div>
    </div>
  )
}
