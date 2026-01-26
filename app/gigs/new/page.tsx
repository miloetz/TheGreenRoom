'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GENRES } from '@/types'
import { useCurrentUser } from '@/hooks/useProfiles'
import { useCreateGig } from '@/hooks/useGigs'

export default function NewGig() {
  const router = useRouter()
  const { data: currentUserData, isLoading } = useCurrentUser()
  const profile = currentUserData?.profile
  const createGigMutation = useCreateGig()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    pay_min: '',
    pay_max: '',
    genres: [] as string[],
    requirements: '',
    image_url: '',
  })

  // Redirect if not venue
  if (!isLoading && (!profile || profile.user_type !== 'venue')) {
    router.push('/dashboard')
    return null
  }

  const toggleGenre = (genre: string) => {
    if (formData.genres.includes(genre)) {
      setFormData({
        ...formData,
        genres: formData.genres.filter((g) => g !== genre),
      })
    } else {
      setFormData({
        ...formData,
        genres: [...formData.genres, genre],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      await createGigMutation.mutateAsync({
        venue_id: profile.id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        location: formData.location,
        pay_min: Number(formData.pay_min),
        pay_max: Number(formData.pay_max),
        genres: formData.genres,
        requirements: formData.requirements || undefined,
        image_url: formData.image_url || undefined,
      })
      router.push('/dashboard')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Post a New Gig</h1>

          {createGigMutation.isError && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
              {createGigMutation.error?.message || 'Failed to create gig'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Gig Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Friday Night Jazz Session"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the gig, what you're looking for, the vibe, etc."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start Time *</label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Austin, TX"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pay Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Pay Range ($) *</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pay_min}
                  onChange={(e) => setFormData({ ...formData, pay_min: e.target.value })}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pay_max}
                  onChange={(e) => setFormData({ ...formData, pay_max: e.target.value })}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">Genres *</label>
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
              {formData.genres.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">Select at least one genre</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium mb-2">Requirements (Optional)</label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Any specific requirements (equipment, experience, etc.)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
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
                disabled={createGigMutation.isPending || formData.genres.length === 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {createGigMutation.isPending ? 'Posting...' : 'Post Gig'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
