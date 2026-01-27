'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--muted)] text-sm">loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back to discover
        </Link>

        <div className="card-flat p-6 md:p-8 animate-fade-in-up">
          <h1 className="heading-lg mb-2">post a new gig</h1>
          <p className="text-[var(--muted)] mb-8">fill in the details to find your perfect musician</p>

          {createGigMutation.isError && (
            <div className="mb-6 alert-error animate-fade-in">
              {createGigMutation.error?.message || 'failed to create gig'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* title */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                gig title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="friday night jazz session"
                className="input"
              />
            </div>

            {/* description */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="describe the gig, what you're looking for, the vibe..."
                className="input resize-none"
              />
            </div>

            {/* date & time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  start time
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                  end time (optional)
                </label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            {/* location */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="austin, tx"
                className="input"
              />
            </div>

            {/* pay range */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                pay range ($)
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pay_min}
                  onChange={(e) => setFormData({ ...formData, pay_min: e.target.value })}
                  placeholder="min"
                  className="input w-1/2"
                />
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.pay_max}
                  onChange={(e) => setFormData({ ...formData, pay_max: e.target.value })}
                  placeholder="max"
                  className="input w-1/2"
                />
              </div>
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
              {formData.genres.length === 0 && (
                <p className="text-xs text-[var(--muted-soft)] mt-2">select at least one genre</p>
              )}
            </div>

            {/* requirements */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                requirements (optional)
              </label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="any specific requirements (equipment, experience, etc.)"
                className="input resize-none"
              />
            </div>

            {/* image url */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                image url (optional)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="input"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-3 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* submit */}
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
                disabled={createGigMutation.isPending || formData.genres.length === 0}
                className="btn btn-accent flex-1"
              >
                {createGigMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    posting...
                  </span>
                ) : (
                  'post gig'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
