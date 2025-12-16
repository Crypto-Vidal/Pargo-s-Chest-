'use client'

import { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')

  // Debounce search input to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Only fetch when we have a debounced search term
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return []

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`
      )
      return response.json()
    },
    enabled: debouncedSearchTerm.length > 0,
  })

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search treasures..."
        className="w-full px-6 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-treasure-gold focus:outline-none transition-colors"
        aria-label="Search treasures"
      />

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-treasure-gold" />
        </div>
      )}

      {/* Search results dropdown */}
      {results && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
          {results.map((result: any) => (
            <div
              key={result.id}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <h3 className="font-semibold">{result.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {result.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
