# Setup Guide

## Quick Start with Docker

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432.

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Create the initial migration:
```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

### 4. (Optional) Seed the Database

Add sample data:
```bash
npm run prisma:seed
```

This creates:
- A demo user (email: demo@pargochest.com)
- 3 categories (Tutorials, Entertainment, Music)
- A sample video with notes

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at: http://localhost:3000/api/v1

Test the health endpoint:
```bash
curl http://localhost:3000/api/v1/health
```

## Manual Database Setup (Without Docker)

If you prefer to use your own PostgreSQL installation:

1. Create a database named `pargos_chest`
2. Update the `DATABASE_URL` in `.env` with your credentials
3. Follow steps 2-5 above

## Testing the API

### Create a User

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Save the returned user ID for subsequent requests.

### Create a Category

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "x-user-id: YOUR_USER_ID" \
  -d '{
    "name": "Tech",
    "description": "Technology videos",
    "color": "#3B82F6"
  }'
```

### Add a Video

```bash
curl -X POST http://localhost:3000/api/v1/videos \
  -H "Content-Type: application/json" \
  -H "x-user-id: YOUR_USER_ID" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "My Video",
    "tags": ["javascript", "tutorial"]
  }'
```

## Using Prisma Studio

Prisma Studio provides a GUI for your database:

```bash
npm run prisma:studio
```

Visit http://localhost:5555 to explore and edit your data.

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

3. Verify connection string in `.env`

### Migration Issues

Reset the database (⚠️ deletes all data):
```bash
npx prisma migrate reset
```

### Port Already in Use

If port 3000 or 5432 is already in use, update the ports in `.env` and `docker-compose.yml`.

## Next Steps

1. Implement proper authentication (JWT, OAuth)
2. Add rate limiting
3. Set up monitoring and logging
4. Configure production database
5. Add automated tests
6. Set up CI/CD pipeline
