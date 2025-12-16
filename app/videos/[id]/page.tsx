'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import YouTubePlayer from '@/components/YouTubePlayer'
import Link from 'next/link'

interface Note {
  id: string
  content: string
  timestamp: string | null
  createdAt: string
  tags: { id: string; name: string }[]
}

interface Video {
  id: string
  youtubeId: string
  title: string
  description: string | null
  notes: Note[]
}

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [noteContent, setNoteContent] = useState('')
  const [noteTimestamp, setNoteTimestamp] = useState('')
  const [noteTags, setNoteTags] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchVideo()
  }, [params.id])

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${params.id}`)
      const data = await response.json()
      setVideo(data)
    } catch (error) {
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()

    const tags = noteTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteContent,
          videoId: params.id,
          timestamp: noteTimestamp || null,
          tags,
        }),
      })

      if (response.ok) {
        setNoteContent('')
        setNoteTimestamp('')
        setNoteTags('')
        fetchVideo()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    const note = video?.notes.find((n) => n.id === noteId)
    if (!note) return

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteContent,
          timestamp: noteTimestamp || null,
          tags: noteTags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        }),
      })

      if (response.ok) {
        setEditingNote(null)
        setNoteContent('')
        setNoteTimestamp('')
        setNoteTags('')
        fetchVideo()
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })
      fetchVideo()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const startEditNote = (note: Note) => {
    setEditingNote(note.id)
    setNoteContent(note.content)
    setNoteTimestamp(note.timestamp || '')
    setNoteTags(note.tags.map((t) => t.name).join(', '))
  }

  const cancelEdit = () => {
    setEditingNote(null)
    setNoteContent('')
    setNoteTimestamp('')
    setNoteTags('')
  }

  const insertCurrentTimestamp = () => {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)
    const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`
    setNoteTimestamp(timestamp)
  }

  const filteredNotes = video?.notes.filter((note) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.name.toLowerCase().includes(query))
    )
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!video) {
    return <div>Video not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2">
          <YouTubePlayer
            videoId={video.youtubeId}
            onTimeUpdate={setCurrentTime}
          />
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            {video.description && (
              <p className="text-gray-600 mt-2">{video.description}</p>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">
              {editingNote ? 'Edit Note' : 'Add Note'}
            </h2>

            <form onSubmit={editingNote ? (e) => { e.preventDefault(); handleUpdateNote(editingNote); } : handleAddNote}>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                rows={4}
                required
              />

              <div className="mb-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={noteTimestamp}
                    onChange={(e) => setNoteTimestamp(e.target.value)}
                    placeholder="Timestamp (e.g., 5:23)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={insertCurrentTimestamp}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm whitespace-nowrap"
                  >
                    Use Current
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!noteContent}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingNote ? 'Update' : 'Add Note'}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Notes ({filteredNotes?.length || 0})
          </h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {filteredNotes && filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {note.timestamp && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        {note.timestamp}
                      </span>
                    )}
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditNote(note)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {searchQuery
              ? 'No notes match your search.'
              : 'No notes yet. Add one above!'}
          </p>
        )}
      </div>
    </div>
  )
}
