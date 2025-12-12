# Pargo's Chest - Backend API 🏗️

A comprehensive backend API for managing video collections with notes, categories, and search functionality. Built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- **Video Management**: Save, organize, and track videos from various sources
- **Notes System**: Add timestamped notes to videos
- **Categories**: Organize videos with custom categories
- **Search**: Full-text search across videos and notes
- **Watch Status**: Track video progress and completion
- **Export/Import**: Backup and restore your data
- **Pagination & Sorting**: Efficient data retrieval
- **Metadata Fetching**: Automatic video metadata extraction (YouTube support)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Pargo-s-Chest-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your settings:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pargos_chest?schema=public"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 4. Set up the database

Generate Prisma client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Database Schema

### User
- `id`: UUID
- `email`: String (unique)
- `name`: String (optional)
- `password`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Category
- `id`: UUID
- `name`: String
- `description`: String (optional)
- `color`: String (default: #3B82F6)
- `userId`: UUID (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Video
- `id`: UUID
- `url`: String
- `title`: String
- `description`: String (optional)
- `thumbnail`: String (optional)
- `duration`: Int (seconds)
- `channel`: String (optional)
- `channelUrl`: String (optional)
- `publishedAt`: DateTime (optional)
- `watchStatus`: Enum (NOT_STARTED, IN_PROGRESS, COMPLETED)
- `watchProgress`: Int (seconds)
- `isFavorite`: Boolean
- `tags`: String[]
- `userId`: UUID (foreign key)
- `categoryId`: UUID (foreign key, optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `lastWatchedAt`: DateTime (optional)

### Note
- `id`: UUID
- `content`: String
- `timestamp`: Int (video timestamp in seconds, optional)
- `videoId`: UUID (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## API Endpoints

### Health Check
- `GET /api/v1/health` - API health check

### Users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Videos
- `POST /api/v1/videos` - Create a new video
- `GET /api/v1/videos` - Get all videos (with pagination, filtering, sorting)
- `GET /api/v1/videos/:id` - Get video by ID
- `PATCH /api/v1/videos/:id` - Update video
- `PATCH /api/v1/videos/:id/watch-status` - Update watch status and progress
- `DELETE /api/v1/videos/:id` - Delete video
- `POST /api/v1/videos/metadata` - Fetch video metadata from URL

### Notes
- `POST /api/v1/notes` - Create a new note
- `GET /api/v1/notes/video/:videoId` - Get all notes for a video
- `GET /api/v1/notes/:id` - Get note by ID
- `PATCH /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note

### Categories
- `POST /api/v1/categories` - Create a new category
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `PATCH /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Search
- `GET /api/v1/search?q=query` - Search across videos and notes
- `GET /api/v1/search/videos?q=query` - Search videos only
- `GET /api/v1/search/notes?q=query` - Search notes only

### Export/Import
- `GET /api/v1/export` - Export all user data as JSON
- `POST /api/v1/export` - Import user data from JSON

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Sorting
- `sortBy`: Field to sort by (e.g., createdAt, title, lastWatchedAt)
- `sortOrder`: Sort order (asc or desc)

### Filtering (Videos)
- `categoryId`: Filter by category
- `watchStatus`: Filter by watch status (NOT_STARTED, IN_PROGRESS, COMPLETED)
- `isFavorite`: Filter favorites (true/false)
- `tags`: Filter by tags (comma-separated)

## Example Requests

### Create a Video

```bash
curl -X POST http://localhost:3000/api/v1/videos \
  -H "Content-Type: application/json" \
  -H "x-user-id: your-user-id" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "categoryId": "category-uuid",
    "tags": ["tutorial", "javascript"]
  }'
```

### Get Videos with Pagination

```bash
curl "http://localhost:3000/api/v1/videos?page=1&limit=20&sortBy=createdAt&sortOrder=desc" \
  -H "x-user-id: your-user-id"
```

### Search Videos

```bash
curl "http://localhost:3000/api/v1/search/videos?q=javascript&page=1&limit=10" \
  -H "x-user-id: your-user-id"
```

### Update Watch Status

```bash
curl -X PATCH http://localhost:3000/api/v1/videos/video-id/watch-status \
  -H "Content-Type: application/json" \
  -H "x-user-id: your-user-id" \
  -d '{
    "watchStatus": "IN_PROGRESS",
    "watchProgress": 120
  }'
```

### Create a Note

```bash
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "x-user-id: your-user-id" \
  -d '{
    "content": "Important point about async/await",
    "timestamp": 180,
    "videoId": "video-uuid"
  }'
```

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Push schema changes without migrations
npm run prisma:push
```

## Authentication

**Note**: The current implementation uses a simple header-based authentication (`x-user-id` header) for development purposes. In production, implement proper authentication (JWT, OAuth, etc.) before deploying.

## Error Handling

The API uses consistent error responses:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content (successful deletion)
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## Project Structure

```
src/
├── config/          # Configuration files (database, env)
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── index.ts         # Server entry point

prisma/
└── schema.prisma    # Database schema
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests (when available)
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on the GitHub repository.
