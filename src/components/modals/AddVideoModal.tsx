'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { WatchStatus } from '@/types'

interface AddVideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
  const { addVideo } = useStore()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const extractVideoInfo = async (videoUrl: string) => {
    try {
      setIsLoading(true)
      setError('')

      // Detect platform
      let platform: 'youtube' | 'vimeo' | 'other' = 'other'
      let videoId = ''

      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        platform = 'youtube'
        // Extract YouTube video ID
        const match =
          videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/) ||
          videoUrl.match(/youtube\.com\/embed\/([^&?]+)/)
        videoId = match ? match[1] : ''
      } else if (videoUrl.includes('vimeo.com')) {
        platform = 'vimeo'
        const match = videoUrl.match(/vimeo\.com\/(\d+)/)
        videoId = match ? match[1] : ''
      }

      // Auto-generate title if not provided
      let autoTitle = title
      if (!autoTitle) {
        if (platform === 'youtube' && videoId) {
          autoTitle = 'YouTube Video'
        } else if (platform === 'vimeo' && videoId) {
          autoTitle = 'Vimeo Video'
        } else {
          // Extract from URL
          const urlObj = new URL(videoUrl)
          autoTitle = urlObj.hostname.replace('www.', '')
        }
      }

      // Generate thumbnail
      let thumbnail = ''
      if (platform === 'youtube' && videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      } else if (platform === 'vimeo' && videoId) {
        thumbnail = `https://vumbnail.com/${videoId}.jpg`
      }

      return {
        url: videoUrl,
        title: autoTitle,
        thumbnail,
        platform,
        tags: [],
        notes: '',
        watchStatus: 'unwatched' as WatchStatus,
      }
    } catch (err) {
      setError('Invalid URL. Please enter a valid video URL.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Please enter a video URL')
      return
    }

    const videoInfo = await extractVideoInfo(url)
    if (videoInfo) {
      addVideo(videoInfo)
      setUrl('')
      setTitle('')
      setError('')
      onClose()
    }
  }

  const handleClose = () => {
    setUrl('')
    setTitle('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Video">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Video URL *"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            error={error}
            autoFocus
          />
          <p className="mt-2 text-xs text-white/40">
            Paste a link from YouTube, Vimeo, or any video platform
          </p>
        </div>

        <div>
          <Input
            label="Title (optional)"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="We'll auto-detect if left empty"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!url.trim()}>
            Add Video
          </Button>
        </div>
      </form>
    </Modal>
  )
}
