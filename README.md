# Pargo's Chest - High-Performance Treasure Platform

A blazingly fast, optimized web application for managing treasure collections.

## 🚀 Performance Features

### 1. Code Splitting & Lazy Loading
- **Dynamic Imports**: Heavy components are loaded on-demand using Next.js `dynamic()`
- **Route-based Code Splitting**: Automatic code splitting for each page
- **Component-level Lazy Loading**: Components load only when they enter the viewport
- **Intersection Observer**: Efficient detection of when components should load

### 2. Asset Optimization
- **Next.js Image Component**: Automatic image optimization with AVIF/WebP formats
- **Lazy Image Loading**: Images load progressively as user scrolls
- **Blur Placeholders**: Smooth loading experience with blur-up placeholders
- **Responsive Images**: Automatically serves optimal image sizes for different devices
- **Font Optimization**: Google Fonts with `display: swap` and preloading

### 3. Caching Strategy
- **In-Memory Cache**: Fast server-side caching with configurable TTL
- **Metadata Caching**: API responses cached for 5-10 minutes
- **React Query**: Intelligent client-side caching with stale-while-revalidate
- **HTTP Caching**: Proper `Cache-Control` headers for browser and CDN caching
- **Static Asset Caching**: Long-term caching for immutable assets

### 4. Database Optimization
- **Strategic Indexes**: Optimized indexes on frequently queried fields
  - `userId` for user-specific queries
  - `category` and `rarity` for filtering
  - `discoveredAt` for sorting
  - Composite indexes for common query patterns
- **Connection Pooling**: Prisma connection management
- **Query Optimization**: Parallel queries and selective field loading

### 5. Search Performance
- **Debounced Input**: 300ms debounce reduces API calls by ~90%
- **Cached Results**: Search results cached for 2 minutes
- **Indexed Search**: Database indexes on searchable fields
- **Result Limiting**: Max 10 results for fast responses

### 6. Web Vitals Monitoring
- **Real-time Metrics**: Tracks LCP, FID, CLS, FCP, TTFB, INP
- **Performance Thresholds**: Automatic rating (good/needs-improvement/poor)
- **Analytics Integration**: Ready to send metrics to analytics service

## 📊 Performance Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTFB | < 800ms | Time to First Byte |
| INP | < 200ms | Interaction to Next Paint |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query
- **Animations**: Framer Motion (lazy loaded)
- **Performance**: Bundle Analyzer, Web Vitals

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Database management
npm run db:studio
```

## 📈 Performance Optimizations Implemented

### 1. Code Splitting
- ✅ Dynamic imports for heavy components
- ✅ Route-based automatic splitting
- ✅ Component-level lazy loading
- ✅ Suspense boundaries for loading states

### 2. Asset Optimization
- ✅ Image optimization with Next.js Image
- ✅ Modern image formats (AVIF, WebP)
- ✅ Lazy loading for images
- ✅ Font optimization and preloading
- ✅ DNS prefetching

### 3. Caching
- ✅ In-memory server cache
- ✅ React Query client cache
- ✅ HTTP caching headers
- ✅ Static asset caching
- ✅ API response caching

### 4. Database
- ✅ Strategic indexes on common queries
- ✅ Composite indexes for filter combinations
- ✅ Connection pooling
- ✅ Parallel query execution
- ✅ Selective field loading

### 5. Search
- ✅ Debounced input (300ms)
- ✅ Cached search results
- ✅ Result limiting
- ✅ Indexed search fields

### 6. Monitoring
- ✅ Web Vitals tracking
- ✅ Performance thresholds
- ✅ Analytics endpoint
- ✅ Bundle size analysis

## 🏗️ Project Structure

```
pargos-chest/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes with caching
│   │   ├── layout.tsx         # Root layout with optimizations
│   │   └── page.tsx           # Home page with code splitting
│   ├── components/            # React components
│   │   ├── Hero.tsx           # Above-the-fold content
│   │   ├── SearchBar.tsx      # Debounced search
│   │   ├── TreasureGrid.tsx   # Lazy-loaded grid
│   │   └── Statistics.tsx     # Cached statistics
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDebounce.ts     # Debouncing hook
│   │   └── useIntersectionObserver.ts
│   ├── lib/                   # Core utilities
│   │   ├── db.ts              # Prisma client
│   │   └── cache.ts           # In-memory cache
│   └── utils/
│       └── performance.ts     # Web Vitals utilities
├── prisma/
│   └── schema.prisma          # Optimized database schema
├── next.config.js             # Performance configurations
└── package.json
```

## 🎯 Performance Best Practices

1. **Always use `next/image`** for images
2. **Implement lazy loading** for components below the fold
3. **Add proper indexes** for database queries
4. **Use debouncing** for search and frequent updates
5. **Cache API responses** with appropriate TTL
6. **Monitor Web Vitals** in production
7. **Analyze bundle size** regularly
8. **Optimize fonts** with preloading
9. **Use Suspense** for async components
10. **Implement proper loading states**

## 📱 Responsive Performance

The application is optimized for all device sizes:
- Mobile-first approach
- Responsive images with multiple sizes
- Touch-optimized interactions
- Reduced motion support for accessibility

## 🔍 Bundle Analysis

Run bundle analyzer to identify optimization opportunities:

```bash
npm run analyze
```

This generates a visual representation of your bundle size and helps identify:
- Large dependencies
- Duplicate code
- Optimization opportunities

## 🧪 Performance Testing

### Lighthouse

```bash
npm run build
npm start
# Then run Lighthouse in Chrome DevTools
```

### Web Vitals

Check browser console for real-time Web Vitals reporting during development.

## 🚢 Production Deployment

### Optimizations for Production

1. **Enable compression** (Gzip/Brotli)
2. **Configure CDN** for static assets
3. **Set up database** connection pooling
4. **Enable Redis** for distributed caching
5. **Configure monitoring** (Sentry, DataDog, etc.)
6. **Set up CI/CD** with performance checks

### Environment Variables

```env
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_API_URL="https://your-domain.com"
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 📚 Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/performance)

## 🤝 Contributing

Performance improvements are always welcome! Please ensure:
- Bundle size doesn't increase significantly
- Web Vitals remain in "good" range
- Tests pass
- Documentation is updated

## 📄 License

MIT License - feel free to use this as a template for your own high-performance applications!

---

Built with ⚡ for maximum performance
