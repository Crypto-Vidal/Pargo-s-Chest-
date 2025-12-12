import axios from 'axios';
import { config } from '../config/env';
import { VideoMetadata } from '../types';

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export async function fetchYoutubeMetadata(url: string): Promise<VideoMetadata | null> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return null;
  }

  if (!config.youtubeApiKey) {
    return {
      title: 'Video Title (API Key Required)',
      description: 'Configure YOUTUBE_API_KEY to fetch metadata',
    };
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'snippet,contentDetails',
          id: videoId,
          key: config.youtubeApiKey,
        },
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      const snippet = video.snippet;
      const contentDetails = video.contentDetails;

      // Parse ISO 8601 duration (e.g., PT1H2M10S)
      const duration = parseDuration(contentDetails.duration);

      return {
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        duration,
        channel: snippet.channelTitle,
        channelUrl: `https://www.youtube.com/channel/${snippet.channelId}`,
        publishedAt: new Date(snippet.publishedAt),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}
