import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Hero } from '@/components/Hero'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Code splitting: Lazy load heavy components
const TreasureGrid = dynamic(() => import('@/components/TreasureGrid'), {
  loading: () => <LoadingSpinner />,
  ssr: true, // Still render on server for SEO
})

const SearchBar = dynamic(() => import('@/components/SearchBar'), {
  loading: () => <div className="h-12 bg-gray-200 animate-pulse rounded" />,
  ssr: false, // Client-only component
})

const Statistics = dynamic(() => import('@/components/Statistics'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
})

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      {/* Above-the-fold content loads immediately */}
      <Hero />

      {/* Search with debouncing - lazy loaded */}
      <section className="my-8">
        <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse rounded" />}>
          <SearchBar />
        </Suspense>
      </section>

      {/* Statistics section - lazy loaded */}
      <section className="my-12">
        <Suspense fallback={<LoadingSpinner />}>
          <Statistics />
        </Suspense>
      </section>

      {/* Treasure grid - code split and lazy loaded */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Treasure Collection</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <TreasureGrid />
        </Suspense>
      </section>
    </main>
  )
}
