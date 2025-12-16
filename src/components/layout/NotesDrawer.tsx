'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Tag as TagIcon, Folder } from 'lucide-react'
import { useStore } from '@/store/useStore'
import IconButton from '@/components/ui/IconButton'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { WatchStatus } from '@/types'

export default function NotesDrawer() {
  const {
    selectedVideo,
    isNotesDrawerOpen,
    toggleNotesDrawer,
    updateVideo,
    categories,
  } = useStore()

  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [watchStatus, setWatchStatus] = useState<WatchStatus>('unwatched')
  const [isSaving, setIsSaving] = useState(false)

  // Load video data when selected video changes
  useEffect(() => {
    if (selectedVideo) {
      setNotes(selectedVideo.notes || '')
      setCategory(selectedVideo.category || '')
      setTags(selectedVideo.tags || [])
      setWatchStatus(selectedVideo.watchStatus)
    }
  }, [selectedVideo])

  const handleSave = () => {
    if (!selectedVideo) return

    setIsSaving(true)
    updateVideo(selectedVideo.id, {
      notes,
      category,
      tags,
      watchStatus,
    })

    setTimeout(() => setIsSaving(false), 500)
  }

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!selectedVideo) return

    const timeout = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, category, tags, watchStatus])

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  if (!selectedVideo) return null

  return (
    <AnimatePresence>
      {isNotesDrawerOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleNotesDrawer}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-96 lg:w-[400px] z-50 glass-strong border-l border-white/10 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                <h2 className="text-lg font-semibold">Video Details</h2>
                <IconButton onClick={toggleNotesDrawer} aria-label="Close drawer">
                  <X size={20} />
                </IconButton>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {/* Video Preview */}
                <div>
                  {selectedVideo.thumbnail && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-dark-800 mb-3">
                      <img
                        src={selectedVideo.thumbnail}
                        alt={selectedVideo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-white line-clamp-2">
                    {selectedVideo.title}
                  </h3>
                  {selectedVideo.url && (
                    <a
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-400 hover:text-primary-300 font-mono mt-1 block truncate"
                    >
                      {selectedVideo.url}
                    </a>
                  )}
                </div>

                {/* Watch Status */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    Watch Status
                  </label>
                  <div className="flex gap-2">
                    {(['unwatched', 'watching', 'completed'] as WatchStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => setWatchStatus(status)}
                          className={`flex-1 h-9 px-3 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
                            watchStatus === status
                              ? 'bg-primary-500 text-white shadow-glow-sm'
                              : 'bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    <Folder size={14} className="inline mr-1" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary-500 focus:bg-white/8"
                  >
                    <option value="">No category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    <TagIcon size={14} className="inline mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Tag key={tag} onRemove={() => removeTag(tag)}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      placeholder="Add tag..."
                      className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500"
                    />
                    <Button
                      size="sm"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes here..."
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/8 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="h-16 flex items-center justify-between px-6 border-t border-white/10">
                <span className="text-xs text-white/40">
                  {isSaving ? 'Saving...' : 'Auto-saved'}
                </span>
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save size={16} />
                  Save Now
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
