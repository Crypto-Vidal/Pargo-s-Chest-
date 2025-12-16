# Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup

Create a `.env.production` file with production values:

```bash
cp .env.production.example .env.production
```

Update the following values:
- `DATABASE_URL` - Your production PostgreSQL connection string
- `CORS_ORIGIN` - Comma-separated list of allowed frontend origins
- `YOUTUBE_API_KEY` - Your YouTube API key for metadata fetching
- `NODE_ENV=production`

### 2. Database Setup

Run database migrations in production:

```bash
npm run prisma:generate
npm run prisma:migrate:prod
```

### 3. Build the Application

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 4. Deployment Options

#### Option A: Docker Deployment (Recommended)

1. Build the Docker image:
```bash
npm run build:docker
```

2. Start with Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Option B: PM2 Deployment

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
npm run start:pm2
```

3. Monitor:
```bash
pm2 monit
pm2 logs
```

#### Option C: Traditional Node Deployment

```bash
npm run start:prod
```

### 5. Security Considerations

#### Required Before Production:

1. **Authentication**: Replace header-based auth with JWT/OAuth
   - Implement proper token generation and validation
   - Add refresh token mechanism
   - See `src/middleware/auth.ts` for implementation notes

2. **HTTPS**: Ensure all traffic uses HTTPS
   - Configure SSL certificates
   - Use Let's Encrypt for free certificates
   - Set up automatic renewal

3. **Database Security**:
   - Use strong passwords
   - Enable SSL for database connections
   - Restrict database access by IP
   - Regular backups

4. **Environment Variables**:
   - Never commit `.env` files
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Rotate API keys regularly

5. **Rate Limiting**: Already implemented, verify settings
   - Adjust limits in `src/middleware/rateLimit.ts`
   - Monitor for abuse

6. **Monitoring & Logging**:
   - Set up error tracking (Sentry, Rollbar, etc.)
   - Implement log aggregation (ELK, CloudWatch, etc.)
   - Set up uptime monitoring

### 6. Health Checks

The API provides multiple health check endpoints:

- `GET /api/v1/health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed system health with database status
- `GET /api/v1/health/ready` - Readiness probe (for Kubernetes)
- `GET /api/v1/health/live` - Liveness probe (for Kubernetes)

### 7. Performance Optimization

1. **Database Indexing**: Already implemented in Prisma schema
2. **Connection Pooling**: Configure in `DATABASE_URL`
3. **Caching**: Consider adding Redis for frequently accessed data
4. **CDN**: Use CDN for static assets if applicable

### 8. Scaling

#### Horizontal Scaling:

1. Run multiple instances with PM2:
```javascript
// In ecosystem.config.js
instances: 4, // or 'max' for CPU count
```

2. Use a load balancer (nginx, AWS ALB, etc.)

3. Consider database replication for read scalability

#### Vertical Scaling:

- Monitor memory and CPU usage
- Increase instance size as needed

### 9. Backup Strategy

1. **Database Backups**:
   - Daily automated backups
   - Test restore procedures
   - Off-site backup storage

2. **Application Backups**:
   - Version control (Git)
   - Docker image registry
   - Configuration backups

### 10. CI/CD

GitHub Actions workflow is provided in `.github/workflows/ci.yml`:

- Automated testing
- Build verification
- Docker image creation
- Security audits

Configure deployment triggers for your environment.

### 11. Monitoring Metrics

Track these key metrics:

- Request rate and latency
- Error rates (4xx, 5xx)
- Database connection pool usage
- Memory and CPU usage
- Disk space

### 12. Troubleshooting

#### Database Connection Issues:
```bash
# Check database is accessible
docker-compose logs postgres

# Verify connection string
npm run prisma:studio
```

#### Application Won't Start:
```bash
# Check logs
pm2 logs
# or
docker logs pargos-chest-api

# Verify environment variables
npm run type-check
```

#### High Memory Usage:
- Check for memory leaks
- Review connection pooling settings
- Consider increasing instance size

## Post-Deployment

1. Smoke test all endpoints
2. Monitor error rates
3. Check health endpoints
4. Verify database connections
5. Test backup/restore procedures

## Rollback Plan

1. Keep previous Docker images tagged
2. Have database migration rollback scripts ready
3. Document rollback procedures
4. Test rollback in staging

## Support

For production issues:
1. Check application logs
2. Review health check endpoints
3. Verify database connectivity
4. Check environment configuration
