'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          {updateProfileMutation.isError && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
              {updateProfileMutation.error?.message || 'Failed to update profile'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.avatar_url && (
                <img
                  src={formData.avatar_url}
                  alt="Preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Venue-specific fields */}
            {profile.user_type === 'venue' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Venue Name</label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    placeholder="The Blue Note"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Venue Address</label>
                  <input
                    type="text"
                    value={formData.venue_address}
                    onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                    placeholder="131 W 3rd St, New York, NY 10012"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Venue Capacity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.venue_capacity}
                    onChange={(e) => setFormData({ ...formData, venue_capacity: e.target.value })}
                    placeholder="200"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {/* Musician-specific fields */}
            {profile.user_type === 'musician' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_years: e.target.value })
                    }
                    placeholder="5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Instruments</label>
                  <div className="flex flex-wrap gap-2">
                    {INSTRUMENTS.map((instrument) => (
                      <button
                        key={instrument}
                        type="button"
                        onClick={() => toggleInstrument(instrument)}
                        className={`text-sm px-3 py-1 rounded-full transition-colors ${
                          formData.instruments.includes(instrument)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Austin, TX"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      formData.genres.includes(genre)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
