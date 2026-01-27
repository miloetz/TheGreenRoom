'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GENRES } from '@/types'
import { useCurrentUser, useUpdateProfile } from '@/hooks/useProfiles'

const INSTRUMENTS = [
  'Vocals',
  'Guitar',
  'Bass',
  'Drums',
  'Piano/Keys',
  'Saxophone',
  'Trumpet',
  'Violin',
  'Cello',
  'Flute',
  'Harmonica',
  'Banjo',
  'Mandolin',
  'Ukulele',
  'DJ',
]

export default function EditProfile() {
  const router = useRouter()
  const { data: currentUserData, isLoading } = useCurrentUser()
  const profile = currentUserData?.profile
  const updateProfileMutation = useUpdateProfile()

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    avatar_url: '',
    genres: [] as string[],
    venue_name: '',
    venue_address: '',
    venue_capacity: '',
    instruments: [] as string[],
    experience_years: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        genres: profile.genres || [],
        venue_name: profile.venue_name || '',
        venue_address: profile.venue_address || '',
        venue_capacity: profile.venue_capacity?.toString() || '',
        instruments: profile.instruments || [],
        experience_years: profile.experience_years?.toString() || '',
      })
    }
  }, [profile])

  if (!isLoading && !profile) {
    router.push('/login')
    return null
  }

  const toggleGenre = (genre: string) => {
    if (formData.genres.includes(genre)) {
      setFormData({ ...formData, genres: formData.genres.filter((g) => g !== genre) })
    } else {
      setFormData({ ...formData, genres: [...formData.genres, genre] })
    }
  }

  const toggleInstrument = (instrument: string) => {
    if (formData.instruments.includes(instrument)) {
      setFormData({
        ...formData,
        instruments: formData.instruments.filter((i) => i !== instrument),
      })
    } else {
      setFormData({ ...formData, instruments: [...formData.instruments, instrument] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    const updateData: Record<string, unknown> = {
      name: formData.name,
      bio: formData.bio || undefined,
      location: formData.location || undefined,
      avatar_url: formData.avatar_url || undefined,
      genres: formData.genres.length > 0 ? formData.genres : undefined,
    }

    if (profile.user_type === 'venue') {
      updateData.venue_name = formData.venue_name || undefined
      updateData.venue_address = formData.venue_address || undefined
      updateData.venue_capacity = formData.venue_capacity
        ? Number(formData.venue_capacity)
        : undefined
    } else {
      updateData.instruments = formData.instruments.length > 0 ? formData.instruments : undefined
      updateData.experience_years = formData.experience_years
        ? Number(formData.experience_years)
        : undefined
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        input: updateData,
      })
      router.push(`/profile/${profile.id}`)
    } catch {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--muted)] text-sm">loading profile...</span>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* back link */}
        <Link
          href={`/profile/${profile.id}`}
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back to profile
        </Link>

        <div className="card-flat p-6 md:p-8 animate-fade-in-up">
          <h1 className="heading-lg mb-2">edit profile</h1>
          <p className="text-[var(--muted)] mb-8">update your information</p>

          {updateProfileMutation.isError && (
            <div className="mb-6 alert-error animate-fade-in">
              {updateProfileMutation.error?.message || 'failed to update profile'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* avatar */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                profile picture url
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
                className="input"
              />
              {formData.avatar_url && (
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={formData.avatar_url}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <span className="text-xs text-[var(--muted)]">preview</span>
                </div>
              )}
            </div>

            {/* name */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>

            {/* venue-specific fields */}
            {profile.user_type === 'venue' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                    venue name
                  </label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    placeholder="the blue note"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                    venue address
                  </label>
                  <input
                    type="text"
                    value={formData.venue_address}
                    onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                    placeholder="131 w 3rd st, new york, ny 10012"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                    venue capacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.venue_capacity}
                    onChange={(e) => setFormData({ ...formData, venue_capacity: e.target.value })}
                    placeholder="200"
                    className="input"
                  />
                </div>
              </>
            )}

            {/* musician-specific fields */}
            {profile.user_type === 'musician' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                    years of experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_years: e.target.value })
                    }
                    placeholder="5"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-3 lowercase">
                    instruments
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INSTRUMENTS.map((instrument) => (
                      <button
                        key={instrument}
                        type="button"
                        onClick={() => toggleInstrument(instrument)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                          formData.instruments.includes(instrument)
                            ? 'bg-[var(--accent)] text-white'
                            : 'tag hover:bg-[var(--border)]'
                        }`}
                      >
                        {instrument.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* location */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="austin, tx"
                className="input"
              />
            </div>

            {/* bio */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="tell us about yourself..."
                className="input resize-none"
              />
            </div>

            {/* genres */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-3 lowercase">
                genres
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                      formData.genres.includes(genre)
                        ? 'bg-[var(--foreground)] text-[var(--background)]'
                        : 'tag hover:bg-[var(--border)]'
                    }`}
                  >
                    {genre.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost flex-1"
              >
                cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn btn-primary flex-1"
              >
                {updateProfileMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    saving...
                  </span>
                ) : (
                  'save changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
