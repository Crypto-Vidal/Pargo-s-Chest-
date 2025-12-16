'use client'

import { useQuery } from '@tanstack/react-query'
import { cacheMetadata } from '@/lib/cache'

export default function Statistics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: () =>
      cacheMetadata('stats', async () => {
        const response = await fetch('/api/statistics')
        return response.json()
      }, 300000), // Cache for 5 minutes
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const statItems = [
    { label: 'Total Treasures', value: stats?.totalTreasures || 0, color: 'text-treasure-gold' },
    { label: 'Total Value', value: `$${stats?.totalValue || 0}`, color: 'text-treasure-silver' },
    { label: 'Collectors', value: stats?.totalUsers || 0, color: 'text-treasure-bronze' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center animate-slide-up"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
          <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
