# API Documentation

Base URL: `http://localhost:3000/api/v1`

All endpoints require the `x-user-id` header (except user creation and health check).

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [ /* items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Authentication

**Current**: Header-based (`x-user-id`)
**Production**: Implement JWT/OAuth before deployment

---

## Users

### Create User
```http
POST /users
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "John Doe"  // optional
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User
```http
GET /users/:id
```

**Response:** `200 OK`

### Update User
```http
PATCH /users/:id
```

**Body:**
```json
{
  "name": "Jane Doe",  // optional
  "email": "new@example.com"  // optional
}
```

**Response:** `200 OK`

### Delete User
```http
DELETE /users/:id
```

**Response:** `204 No Content`

---

## Categories

### Create Category
```http
POST /categories
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "name": "Tutorials",
  "description": "Educational content",  // optional
  "color": "#3B82F6"  // optional, default: #3B82F6
}
```

**Response:** `201 Created`

### Get All Categories
```http
GET /categories
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Tutorials",
      "description": "Educational content",
      "color": "#3B82F6",
      "_count": {
        "videos": 15
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Category
```http
GET /categories/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`

### Update Category
```http
PATCH /categories/:id
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "name": "New Name",  // optional
  "description": "New description",  // optional
  "color": "#EF4444"  // optional
}
```

**Response:** `200 OK`

### Delete Category
```http
DELETE /categories/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `204 No Content`

---

## Videos

### Create Video
```http
POST /videos
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "title": "Video Title",  // optional, auto-fetched if not provided
  "description": "Description",  // optional
  "categoryId": "uuid",  // optional
  "tags": ["javascript", "tutorial"]  // optional
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "url": "https://...",
    "title": "Video Title",
    "description": "Description",
    "thumbnail": "https://...",
    "duration": 300,
    "channel": "Channel Name",
    "channelUrl": "https://...",
    "publishedAt": "2024-01-01T00:00:00Z",
    "watchStatus": "NOT_STARTED",
    "watchProgress": 0,
    "isFavorite": false,
    "tags": ["javascript", "tutorial"],
    "category": { /* category object */ },
    "notes": [],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "lastWatchedAt": null
  }
}
```

### Get Videos
```http
GET /videos?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

**Headers:** `x-user-id: uuid`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Field to sort by (createdAt, updatedAt, title, lastWatchedAt)
- `sortOrder`: asc or desc (default: desc)
- `categoryId`: Filter by category UUID
- `watchStatus`: NOT_STARTED, IN_PROGRESS, or COMPLETED
- `isFavorite`: true or false
- `tags`: Comma-separated tags (e.g., "javascript,tutorial")

**Response:** `200 OK` (paginated)

### Get Video
```http
GET /videos/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`

### Update Video
```http
PATCH /videos/:id
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "title": "New Title",  // optional
  "description": "New description",  // optional
  "categoryId": "uuid",  // optional (null to unassign)
  "tags": ["new", "tags"],  // optional
  "isFavorite": true  // optional
}
```

**Response:** `200 OK`

### Update Watch Status
```http
PATCH /videos/:id/watch-status
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "watchStatus": "IN_PROGRESS",  // optional
  "watchProgress": 120  // optional, in seconds
}
```

**Response:** `200 OK`

### Delete Video
```http
DELETE /videos/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `204 No Content`

### Fetch Metadata
```http
POST /videos/metadata
```

**Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "title": "Video Title",
    "description": "Description",
    "thumbnail": "https://...",
    "duration": 300,
    "channel": "Channel Name",
    "channelUrl": "https://...",
    "publishedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Notes

### Create Note
```http
POST /notes
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "content": "Important note about the video",
  "videoId": "uuid",
  "timestamp": 120  // optional, in seconds
}
```

**Response:** `201 Created`

### Get Notes for Video
```http
GET /notes/video/:videoId
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "content": "Important note",
      "timestamp": 120,
      "videoId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Note
```http
GET /notes/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`

### Update Note
```http
PATCH /notes/:id
```

**Headers:** `x-user-id: uuid`

**Body:**
```json
{
  "content": "Updated note",  // optional
  "timestamp": 150  // optional
}
```

**Response:** `200 OK`

### Delete Note
```http
DELETE /notes/:id
```

**Headers:** `x-user-id: uuid`

**Response:** `204 No Content`

---

## Search

### Search All
```http
GET /search?q=javascript&page=1&limit=10
```

**Headers:** `x-user-id: uuid`

**Query Parameters:**
- `q`: Search query (required)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "videos": {
      "data": [ /* video objects */ ],
      "pagination": { /* pagination info */ }
    },
    "notes": {
      "data": [ /* note objects with video */ ],
      "pagination": { /* pagination info */ }
    }
  }
}
```

### Search Videos
```http
GET /search/videos?q=javascript&page=1&limit=10
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK` (paginated)

### Search Notes
```http
GET /search/notes?q=javascript&page=1&limit=10
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK` (paginated)

---

## Export/Import

### Export Data
```http
GET /export
```

**Headers:** `x-user-id: uuid`

**Response:** `200 OK`
Downloads JSON file with all user data (categories, videos, notes).

### Import Data
```http
POST /export
```

**Headers:** `x-user-id: uuid`

**Body:** JSON export file content

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "imported": 25
  }
}
```

---

## Health Check

### Health
```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Pargo's Chest API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Status Codes

- `200 OK`: Successful GET/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error or bad input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Not currently implemented. Add rate limiting before production deployment.

## CORS

Configured via `CORS_ORIGIN` environment variable.
Default: `http://localhost:5173`
