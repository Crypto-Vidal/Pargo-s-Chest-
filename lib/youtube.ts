// YouTube utility functions

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export async function fetchVideoInfo(youtubeId: string) {
  // For MVP, we'll use the oEmbed API (no API key required)
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch video info')
    }

    const data = await response.json()
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      author: data.author_name,
    }
  } catch (error) {
    console.error('Error fetching video info:', error)
    return null
  }
}
