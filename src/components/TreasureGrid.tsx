'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Lazy-loaded treasure card component
function TreasureCard({ treasure }: { treasure: any }) {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  })

  return (
    <div
      ref={targetRef}
      className="lazy-content bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {hasIntersected ? (
        <>
          {treasure.imageUrl && (
            <div className="relative h-48 w-full">
              <Image
                src={treasure.imageUrl}
                alt={treasure.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNjY2MiLz48L3N2Zz4="
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{treasure.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {treasure.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm bg-treasure-gold text-white px-3 py-1 rounded">
                {treasure.rarity}
              </span>
              <span className="text-lg font-bold text-treasure-gold">
                ${treasure.value}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-64 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

export default function TreasureGrid() {
  const { data: treasures, isLoading } = useQuery({
    queryKey: ['treasures'],
    queryFn: async () => {
      const response = await fetch('/api/treasures')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {treasures?.map((treasure: any) => (
        <TreasureCard key={treasure.id} treasure={treasure} />
      ))}
    </div>
  )
}
