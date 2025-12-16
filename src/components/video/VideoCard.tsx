'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Circle, PlayCircle, CheckCircle, ExternalLink, Trash2 } from 'lucide-react'
import { Video, WatchStatus } from '@/types'
import { useStore } from '@/store/useStore'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import IconButton from '@/components/ui/IconButton'
import { formatDistanceToNow } from 'date-fns'

interface VideoCardProps {
  video: Video
}

export default function VideoCard({ video }: VideoCardProps) {
  const { setSelectedVideo, toggleNotesDrawer, deleteVideo } = useStore()
  const [showActions, setShowActions] = useState(false)

  const handleCardClick = () => {
    setSelectedVideo(video)
    toggleNotesDrawer()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this video?')) {
      deleteVideo(video.id)
    }
  }

  const handleOpenUrl = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(video.url, '_blank', 'noopener,noreferrer')
  }

  const getStatusIcon = (status: WatchStatus) => {
    switch (status) {
      case 'unwatched':
        return <Circle size={18} className="text-white/40" />
      case 'watching':
        return <PlayCircle size={18} className="text-amber-500" />
      case 'completed':
        return <CheckCircle size={18} className="text-green-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Card
        hover
        onClick={handleCardClick}
        className="cursor-pointer overflow-hidden group"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-dark-800 overflow-hidden">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={48} className="text-white/20" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Actions (top right) */}
          <div
            className={`absolute top-2 right-2 flex gap-1 transition-opacity duration-200 ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <IconButton
              size="sm"
              onClick={handleOpenUrl}
              className="bg-black/60 backdrop-blur-sm hover:bg-black/80"
              aria-label="Open video URL"
            >
              <ExternalLink size={14} />
            </IconButton>
            <IconButton
              size="sm"
              onClick={handleDelete}
              className="bg-black/60 backdrop-blur-sm hover:bg-red-500"
              aria-label="Delete video"
            >
              <Trash2 size={14} />
            </IconButton>
          </div>

          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs font-medium">
              {video.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Category & Status */}
          <div className="flex items-center justify-between">
            {video.category && (
              <span className="text-xs px-2 py-1 rounded-md bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {video.category}
              </span>
            )}
            <div className="ml-auto">{getStatusIcon(video.watchStatus)}</div>
          </div>

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {video.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} variant="default" className="text-xs">
                  {tag}
                </Tag>
              ))}
              {video.tags.length > 3 && (
                <span className="text-xs text-white/40">
                  +{video.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>
              {formatDistanceToNow(video.createdAt, { addSuffix: true })}
            </span>
            {video.platform && (
              <>
                <span>•</span>
                <span className="capitalize">{video.platform}</span>
              </>
            )}
          </div>

          {/* Notes preview */}
          {video.notes && (
            <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
              {video.notes}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
