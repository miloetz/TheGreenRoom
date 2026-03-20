'use client'

import { useState } from 'react'
import { useProfiles } from '@/hooks/useProfiles'
import { ProfileFilters, GENRES, INSTRUMENTS } from '@/types'
import Link from 'next/link'

export default function MusiciansPage() {
  const [filters, setFilters] = useState<ProfileFilters>({ userType: 'musician' })
  const [showFilters, setShowFilters] = useState(false)

  const { data: musicians = [], isLoading } = useProfiles(filters)

  const clearFilters = () => setFilters({ userType: 'musician' })

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

  const toggleInstrument = (instrument: string) => {
    const currentInstruments = filters.instruments || []
    if (currentInstruments.includes(instrument)) {
      setFilters({
        ...filters,
        instruments: currentInstruments.filter(i => i !== instrument)
      })
    } else {
      setFilters({
        ...filters,
        instruments: [...currentInstruments, instrument]
      })
    }
  }

  const activeFilterCount = [
    filters.search,
    filters.location,
    filters.genres?.length,
    filters.instruments?.length,
    filters.experienceMin,
    filters.experienceMax,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="heading-xl mb-2">find musicians</h1>
          <p className="text-[var(--muted)] text-lg">
            discover talented artists for your venue
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

              {/* search */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  search
                </label>
                <input
                  type="text"
                  placeholder="search by name..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input text-sm"
                />
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

              {/* experience */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  experience (years)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="min"
                    value={filters.experienceMin || ''}
                    onChange={(e) => setFilters({ ...filters, experienceMin: e.target.value ? Number(e.target.value) : undefined })}
                    className="input text-sm w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="max"
                    value={filters.experienceMax || ''}
                    onChange={(e) => setFilters({ ...filters, experienceMax: e.target.value ? Number(e.target.value) : undefined })}
                    className="input text-sm w-1/2"
                  />
                </div>
              </div>

              {/* instruments */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  instruments
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {INSTRUMENTS.map((instrument) => (
                    <button
                      key={instrument}
                      onClick={() => toggleInstrument(instrument)}
                      className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${
                        filters.instruments?.includes(instrument)
                          ? 'bg-[var(--foreground)] text-[var(--background)]'
                          : 'tag hover:bg-[var(--border)]'
                      }`}
                    >
                      {instrument.toLowerCase()}
                    </button>
                  ))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-flat overflow-hidden">
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-12 h-12 rounded-full" />
                        <div className="flex-1">
                          <div className="skeleton h-5 w-3/4 mb-2" />
                          <div className="skeleton h-4 w-1/2" />
                        </div>
                      </div>
                      <div className="skeleton h-4 w-full" />
                      <div className="flex gap-2">
                        <div className="skeleton h-6 w-16" />
                        <div className="skeleton h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : musicians.length === 0 ? (
              /* empty state */
              <div className="text-center py-20 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="heading-md mb-2">no musicians found</h3>
                <p className="text-[var(--muted)] mb-6">
                  try adjusting your filters
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="btn btn-ghost">
                    clear filters
                  </button>
                )}
              </div>
            ) : (
              /* musicians grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {musicians.map((musician) => (
                  <Link key={musician.id} href={`/profile/${musician.id}`} className="block">
                    <article className="card overflow-hidden group">
                      <div className="p-5">
                        {/* avatar & name */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {musician.avatar_url ? (
                              <img
                                src={musician.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-bold text-[var(--muted)]">
                                {musician.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="heading-sm !normal-case font-bold truncate group-hover:text-[var(--accent)] transition-colors">
                              {musician.name}
                            </h3>
                            {musician.location && (
                              <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {musician.location}
                              </p>
                            )}
                          </div>
                          <span className="badge badge-musician">musician</span>
                        </div>

                        {/* bio preview */}
                        {musician.bio && (
                          <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">
                            {musician.bio}
                          </p>
                        )}

                        {/* experience */}
                        {musician.experience_years && (
                          <p className="text-xs text-[var(--muted-soft)] mb-3">
                            {musician.experience_years} year{musician.experience_years !== 1 ? 's' : ''} experience
                          </p>
                        )}

                        {/* instruments */}
                        {musician.instruments && musician.instruments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {musician.instruments.slice(0, 3).map((instrument) => (
                              <span key={instrument} className="tag tag-accent text-[10px]">
                                {instrument.toLowerCase()}
                              </span>
                            ))}
                            {musician.instruments.length > 3 && (
                              <span className="tag text-[10px]">
                                +{musician.instruments.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* genres */}
                        {musician.genres && musician.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {musician.genres.slice(0, 3).map((genre) => (
                              <span key={genre} className="tag text-[10px]">
                                {genre.toLowerCase()}
                              </span>
                            ))}
                            {musician.genres.length > 3 && (
                              <span className="tag text-[10px]">
                                +{musician.genres.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* results count */}
            {!isLoading && musicians.length > 0 && (
              <p className="text-center text-sm text-[var(--muted)] mt-8 animate-fade-in">
                showing {musicians.length} musician{musicians.length !== 1 ? 's' : ''}
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
