'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  youtubeId: string
  title: string
  thumbnail: string | null
  createdAt: string
  notes: any[]
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async (search?: string) => {
    try {
      const url = search
        ? `/api/videos?search=${encodeURIComponent(search)}`
        : '/api/videos'
      const response = await fetch(url)
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setAdding(true)

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to add video')
        return
      }

      setYoutubeUrl('')
      fetchVideos()
    } catch (error) {
      setError('Failed to add video')
    } finally {
      setAdding(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideos(searchQuery)
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video and all its notes?')) {
      return
    }

    try {
      await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      })
      fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Add New Video</h2>
        <form onSubmit={handleAddVideo} className="flex gap-2">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={adding || !youtubeUrl}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add Video'}
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Search Videos</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos by title or description..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                fetchVideos()
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">My Videos</h2>
        {loading ? (
          <p>Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-600">No videos yet. Add one above to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Link href={`/videos/${video.id}`}>
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600">
                      {video.notes.length} {video.notes.length === 1 ? 'note' : 'notes'}
                    </p>
                  </div>
                </Link>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
