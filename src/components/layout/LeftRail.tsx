'use client'

import { Video, Circle, PlayCircle, CheckCircle, Plus, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import Badge from '@/components/ui/Badge'
import IconButton from '@/components/ui/IconButton'
import { WatchStatus } from '@/types'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeftRailProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeftRail({ isOpen, onClose }: LeftRailProps) {
  const {
    videos,
    categories,
    filterCategory,
    filterWatchStatus,
    setFilterCategory,
    setFilterWatchStatus,
    addCategory,
    deleteCategory,
  } = useStore()

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const statusCounts = {
    unwatched: videos.filter((v) => v.watchStatus === 'unwatched').length,
    watching: videos.filter((v) => v.watchStatus === 'watching').length,
    completed: videos.filter((v) => v.watchStatus === 'completed').length,
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim())
      setNewCategoryName('')
      setIsAddingCategory(false)
    }
  }

  const FilterItem = ({
    icon,
    label,
    count,
    active,
    onClick,
    onDelete,
  }: {
    icon: React.ReactNode
    label: string
    count?: number
    active: boolean
    onClick: () => void
    onDelete?: () => void
  }) => (
    <button
      onClick={onClick}
      className={`group relative w-full h-10 px-3 rounded-lg flex items-center gap-3 transition-all duration-150 ${
        active
          ? 'bg-primary-500/20 border-l-2 border-primary-500 pl-2.5'
          : 'hover:bg-white/5'
      }`}
    >
      <span className="text-white/70 group-hover:text-white">{icon}</span>
      <span className="flex-1 text-left text-sm font-medium text-white/90">
        {label}
      </span>
      {count !== undefined && <Badge variant="default">{count}</Badge>}
      {onDelete && (
        <IconButton
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100"
        >
          <X size={14} />
        </IconButton>
      )}
    </button>
  )

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-40 glass-strong border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col pt-16 lg:pt-20 pb-6 px-4">
          {/* Close button (mobile) */}
          <div className="lg:hidden absolute top-4 right-4">
            <IconButton onClick={onClose} aria-label="Close menu">
              <X size={20} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {/* All Videos */}
            <div>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-3">
                Library
              </h2>
              <FilterItem
                icon={<Video size={18} />}
                label="All Videos"
                count={videos.length}
                active={!filterCategory && !filterWatchStatus}
                onClick={() => {
                  setFilterCategory(null)
                  setFilterWatchStatus(null)
                  onClose()
                }}
              />
            </div>

            {/* Watch Status */}
            <div>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-3">
                Watch Status
              </h2>
              <div className="space-y-1">
                <FilterItem
                  icon={<Circle size={18} />}
                  label="Unwatched"
                  count={statusCounts.unwatched}
                  active={filterWatchStatus === 'unwatched'}
                  onClick={() => {
                    setFilterWatchStatus(
                      filterWatchStatus === 'unwatched' ? null : 'unwatched'
                    )
                    onClose()
                  }}
                />
                <FilterItem
                  icon={<PlayCircle size={18} />}
                  label="Watching"
                  count={statusCounts.watching}
                  active={filterWatchStatus === 'watching'}
                  onClick={() => {
                    setFilterWatchStatus(
                      filterWatchStatus === 'watching' ? null : 'watching'
                    )
                    onClose()
                  }}
                />
                <FilterItem
                  icon={<CheckCircle size={18} />}
                  label="Completed"
                  count={statusCounts.completed}
                  active={filterWatchStatus === 'completed'}
                  onClick={() => {
                    setFilterWatchStatus(
                      filterWatchStatus === 'completed' ? null : 'completed'
                    )
                    onClose()
                  }}
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2 px-3">
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Categories
                </h2>
                <IconButton
                  size="sm"
                  onClick={() => setIsAddingCategory(true)}
                  aria-label="Add category"
                >
                  <Plus size={14} />
                </IconButton>
              </div>

              <div className="space-y-1">
                {categories.map((category) => (
                  <FilterItem
                    key={category.id}
                    icon={
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                    }
                    label={category.name}
                    count={category.count}
                    active={filterCategory === category.name}
                    onClick={() => {
                      setFilterCategory(
                        filterCategory === category.name ? null : category.name
                      )
                      onClose()
                    }}
                    onDelete={
                      category.count === 0
                        ? () => deleteCategory(category.id)
                        : undefined
                    }
                  />
                ))}

                <AnimatePresence>
                  {isAddingCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCategory()
                            if (e.key === 'Escape') {
                              setIsAddingCategory(false)
                              setNewCategoryName('')
                            }
                          }}
                          placeholder="Category name..."
                          className="flex-1 h-8 px-2 text-xs rounded bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                          autoFocus
                        />
                        <IconButton
                          size="sm"
                          onClick={handleAddCategory}
                          disabled={!newCategoryName.trim()}
                        >
                          <CheckCircle size={14} />
                        </IconButton>
                        <IconButton
                          size="sm"
                          onClick={() => {
                            setIsAddingCategory(false)
                            setNewCategoryName('')
                          }}
                        >
                          <X size={14} />
                        </IconButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
