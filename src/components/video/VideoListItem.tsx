'use client'

import { motion } from 'framer-motion'
import { Play, Circle, PlayCircle, CheckCircle, ExternalLink, Trash2 } from 'lucide-react'
import { Video, WatchStatus } from '@/types'
import { useStore } from '@/store/useStore'
import Tag from '@/components/ui/Tag'
import IconButton from '@/components/ui/IconButton'
import { formatDistanceToNow } from 'date-fns'

interface VideoListItemProps {
  video: Video
}

export default function VideoListItem({ video }: VideoListItemProps) {
  const { setSelectedVideo, toggleNotesDrawer, deleteVideo } = useStore()

  const handleClick = () => {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="group h-20 bg-dark-800/30 border border-white/5 rounded-lg hover:bg-white/5 hover:border-primary-500/50 transition-all duration-200 cursor-pointer"
    >
      <div className="h-full flex items-center gap-4 px-4">
        {/* Thumbnail */}
        <div className="relative w-32 h-16 bg-dark-800 rounded-md overflow-hidden flex-shrink-0">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={24} className="text-white/20" />
            </div>
          )}
          {video.duration && (
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs font-medium">
              {video.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1">{video.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {video.category && (
              <span className="text-xs px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {video.category}
              </span>
            )}
            {video.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} variant="default" className="text-xs h-5 px-2">
                {tag}
              </Tag>
            ))}
            <span className="text-xs text-white/40">
              {formatDistanceToNow(video.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">{getStatusIcon(video.watchStatus)}</div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            size="sm"
            onClick={handleOpenUrl}
            aria-label="Open video URL"
          >
            <ExternalLink size={16} />
          </IconButton>
          <IconButton
            size="sm"
            onClick={handleDelete}
            className="hover:text-red-400"
            aria-label="Delete video"
          >
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>
    </motion.div>
  )
}
