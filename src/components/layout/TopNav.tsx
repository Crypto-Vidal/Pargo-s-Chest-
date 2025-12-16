'use client'

import { useState } from 'react'
import { Search, Grid3x3, List, Plus, Menu } from 'lucide-react'
import { useStore } from '@/store/useStore'
import IconButton from '@/components/ui/IconButton'
import Button from '@/components/ui/Button'
import AddVideoModal from '@/components/modals/AddVideoModal'

interface TopNavProps {
  onMenuClick: () => void
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 z-40 glass-strong border-b border-white/5 shadow-lg">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-4">
            <IconButton
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </IconButton>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="6" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-xl font-bold hidden sm:block">
                Video Vault
              </h1>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, notes, categories..."
                className="w-full h-10 pl-11 pr-4 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/8 focus:border-primary-500 focus:shadow-glow-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Right: View toggle + Add button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <IconButton
                size="sm"
                onClick={() => setViewMode('grid')}
                className={
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-white/70'
                }
                aria-label="Grid view"
              >
                <Grid3x3 size={16} />
              </IconButton>
              <IconButton
                size="sm"
                onClick={() => setViewMode('list')}
                className={
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-white/70'
                }
                aria-label="List view"
              >
                <List size={16} />
              </IconButton>
            </div>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Video</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full h-10 pl-11 pr-4 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/8 focus:border-primary-500 transition-all duration-200"
            />
          </div>
        </div>
      </nav>

      <AddVideoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  )
}
