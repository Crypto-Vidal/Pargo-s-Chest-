# Video Notes App

A simple web application for taking notes on YouTube videos.

## Features

### Phase 1 (MVP) - Implemented ✅

- **YouTube Video Integration**: Add videos by pasting YouTube URLs
- **Video Player**: Watch videos directly in the app using YouTube's embedded player
- **Note Taking**: Create, edit, and delete notes while watching videos
- **Timestamps**: Add timestamps to notes to mark specific moments in videos
- **Manual Tagging**: Organize notes with custom tags
- **Search**: Search videos by title/description and notes by content or tags
- **Video Management**: View all your videos with note counts, delete videos

### Phase 2 (Future/Optional) - NOT Implemented ❌

The following AI-powered features are NOT included in this version:
- Vectorized embeddings
- Semantic search
- AI chat interface
- Auto-generated summaries
- AI-recommended tags
- Cross-video insights

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Video**: YouTube IFrame API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Pargo-s-Chest-
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Copy the example env file
cp .env.example .env

# Push the database schema
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a Video

1. Go to the home page
2. Paste a YouTube URL in the input field
3. Click "Add Video"
4. The video will be added to your collection

### Taking Notes

1. Click on a video from the home page
2. Watch the video in the embedded player
3. Write your note in the "Add Note" section
4. Optionally add a timestamp (or click "Use Current" to use the current playback time)
5. Add tags separated by commas (e.g., "important, todo, review")
6. Click "Add Note"

### Searching

- **Videos**: Use the search bar on the home page to search videos by title or description
- **Notes**: Use the search bar on the video page to filter notes by content or tags

### Managing Notes

- **Edit**: Click "Edit" on any note to modify it
- **Delete**: Click "Delete" to remove a note
- **View by Tag**: Notes are displayed with their tags for easy organization

## Database Schema

### Video
- id, youtubeId, title, description, thumbnail, duration, timestamps

### Note
- id, content, timestamp, videoId (FK), timestamps
- Relation: belongs to Video

### Tag
- id, name
- Relation: many-to-many with Notes

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   │   ├── videos/    # Video CRUD endpoints
│   │   ├── notes/     # Note CRUD endpoints
│   │   └── tags/      # Tag endpoints
│   ├── videos/[id]/   # Video detail page
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── components/
│   └── YouTubePlayer.tsx  # YouTube player component
├── lib/
│   ├── prisma.ts      # Prisma client
│   └── youtube.ts     # YouTube utilities
├── prisma/
│   └── schema.prisma  # Database schema
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Future Enhancements (Optional Phase 2)

If you want to add AI features later, you could:
- Add vector embeddings for semantic search
- Integrate with OpenAI/Anthropic for chat and summaries
- Use pgvector or Pinecone for vector storage
- Add AI-powered tag recommendations
- Build cross-video insight features

## License

MIT
