'use client'

import { useEffect, useRef } from 'react'

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (time: number) => void
}

export default function YouTubePlayer({ videoId, onTimeUpdate }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
          },
        })

        // Optional: Track time updates
        if (onTimeUpdate) {
          const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
              const time = playerRef.current.getCurrentTime()
              onTimeUpdate(time)
            }
          }, 1000)

          return () => clearInterval(interval)
        }
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, onTimeUpdate])

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  )
}

// Type declarations for YouTube API
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
