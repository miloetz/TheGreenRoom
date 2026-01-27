'use client'

import { useState } from 'react'
import { useGigs } from '@/hooks/useGigs'
import GigCard from '@/components/GigCard'
import { GigFilters, GENRES } from '@/types'

export default function Dashboard() {
  const [filters, setFilters] = useState<GigFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const { data: gigs = [], isLoading } = useGigs(filters)

  const clearFilters = () => setFilters({})

  const toggleGenre = (genre: string) => {
    const currentGenres = filters.genres || []
    if (currentGenres.includes(genre)) {
      setFilters({
        ...filters,
        genres: currentGenres.filter(g => g !== genre)
      })
    } else {
      setFilters({
        ...filters,
        genres: [...currentGenres, genre]
      })
    }
  }

  const activeFilterCount = [
    filters.location,
    filters.dateFrom,
    filters.dateTo,
    filters.payMin,
    filters.payMax,
    filters.genres?.length
  ].filter(Boolean).length

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="heading-xl mb-2">discover gigs</h1>
          <p className="text-[var(--muted)] text-lg">
            find your next opportunity to perform
          </p>
        </div>

        <div className="flex gap-8">
          {/* filters sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
            <div className="card-flat p-5 sticky top-24 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="heading-sm">filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    clear all
                  </button>
                )}
              </div>

              {/* location */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  location
                </label>
                <input
                  type="text"
                  placeholder="any city..."
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input text-sm"
                />
              </div>

              {/* dates */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  date range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="input text-sm"
                  />
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="input text-sm"
                  />
                </div>
              </div>

              {/* pay */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  pay range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="min"
                    value={filters.payMin || ''}
                    onChange={(e) => setFilters({ ...filters, payMin: e.target.value ? Number(e.target.value) : undefined })}
                    className="input text-sm w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="max"
                    value={filters.payMax || ''}
                    onChange={(e) => setFilters({ ...filters, payMax: e.target.value ? Number(e.target.value) : undefined })}
                    className="input text-sm w-1/2"
                  />
                </div>
              </div>

              {/* genres */}
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  genres
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${
                        filters.genres?.includes(genre)
                          ? 'bg-[var(--foreground)] text-[var(--background)]'
                          : 'tag hover:bg-[var(--border)]'
                      }`}
                    >
                      {genre.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* main content */}
          <main className="flex-1 min-w-0">
            {/* mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full btn btn-ghost mb-6 justify-between"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                filters
              </span>
              {activeFilterCount > 0 && (
                <span className="badge badge-musician">{activeFilterCount}</span>
              )}
            </button>

            {/* loading state */}
            {isLoading ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-flat overflow-hidden break-inside-avoid mb-4">
                    <div className="skeleton h-40" />
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between">
                        <div className="skeleton h-6 w-20" />
                        <div className="skeleton h-4 w-16" />
                      </div>
                      <div className="skeleton h-5 w-3/4" />
                      <div className="skeleton h-4 w-1/2" />
                      <div className="flex gap-2">
                        <div className="skeleton h-6 w-16" />
                        <div className="skeleton h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : gigs.length === 0 ? (
              /* empty state */
              <div className="text-center py-20 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="heading-md mb-2">no gigs found</h3>
                <p className="text-[var(--muted)] mb-6">
                  try adjusting your filters or check back later
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="btn btn-ghost">
                    clear filters
                  </button>
                )}
              </div>
            ) : (
              /* gigs grid */
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 stagger-children">
                {gigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}

            {/* results count */}
            {!isLoading && gigs.length > 0 && (
              <p className="text-center text-sm text-[var(--muted)] mt-8 animate-fade-in">
                showing {gigs.length} gig{gigs.length !== 1 ? 's' : ''}
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
