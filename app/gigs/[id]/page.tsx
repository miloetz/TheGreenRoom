'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGig } from '@/hooks/useGigs'
import { useCurrentUser } from '@/hooks/useProfiles'
import {
  useGigApplications,
  useUserApplication,
  useApplyToGig,
  useUpdateApplicationStatus,
} from '@/hooks/useApplications'

export default function GigDetail() {
  const params = useParams()
  const router = useRouter()
  const gigId = params.id as string

  const [message, setMessage] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)

  const { data: gig, isLoading: gigLoading } = useGig(gigId)
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser()
  const profile = currentUserData?.profile

  const { data: existingApplication } = useUserApplication(
    gigId,
    profile?.user_type === 'musician' ? profile?.id : undefined
  )

  const { data: applications = [] } = useGigApplications(
    profile?.user_type === 'venue' && gig?.venue_id === profile?.id ? gigId : ''
  )

  const applyMutation = useApplyToGig()
  const updateStatusMutation = useUpdateApplicationStatus()

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !gig) return

    try {
      await applyMutation.mutateAsync({
        gig_id: gig.id,
        musician_id: profile.id,
        message,
      })
      setShowApplyForm(false)
      setMessage('')
    } catch (err) {
      // Error handled by mutation
    }
  }

  const handleUpdateStatus = (applicationId: string, status: 'accepted' | 'rejected') => {
    updateStatusMutation.mutate({ applicationId, gigId, status })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatPay = (min: number | null, max: number | null) => {
    if (!min && !max) return 'TBD'
    if (min === max) return `$${min}`
    return `$${min ?? 0} - $${max ?? 0}`
  }

  if (gigLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!gig) {
    router.push('/dashboard')
    return null
  }

  const isOwner = profile?.id === gig.venue_id
  const canApply = profile?.user_type === 'musician' && !existingApplication && gig.status === 'open'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to gigs
        </Link>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={gig.image_url || '/placeholder-venue.jpg'}
              alt={gig.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-lg">
              {formatPay(gig.pay_min, gig.pay_max)}
            </div>
            {gig.status !== 'open' && (
              <div className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg">
                {gig.status === 'filled' ? 'Position Filled' : 'Closed'}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>

            {/* Venue Info */}
            {gig.venue && (
              <Link
                href={`/profile/${gig.venue.id}`}
                className="flex items-center gap-3 mb-4 hover:opacity-80"
              >
                <img
                  src={gig.venue.avatar_url || '/placeholder-avatar.jpg'}
                  alt={gig.venue.name || 'Venue'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-700">
                  {gig.venue.venue_name || gig.venue.name || 'Unknown Venue'}
                </span>
              </Link>
            )}

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 py-4 border-y">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(gig.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {gig.start_time}
                    {gig.end_time && ` - ${gig.end_time}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{gig.location}</p>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {gig.genres.map((genre: string) => (
                  <span key={genre} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">About this Gig</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
            </div>

            {/* Requirements */}
            {gig.requirements && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{gig.requirements}</p>
              </div>
            )}

            {/* Apply Section */}
            {!profile && (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Sign in to apply for this gig</p>
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Log in or Sign up
                </Link>
              </div>
            )}

            {existingApplication && (
              <div
                className={`p-4 rounded-lg ${
                  existingApplication.status === 'accepted'
                    ? 'bg-green-50'
                    : existingApplication.status === 'rejected'
                    ? 'bg-red-50'
                    : 'bg-blue-50'
                }`}
              >
                <p className="font-medium">
                  {existingApplication.status === 'accepted' && 'Your application was accepted!'}
                  {existingApplication.status === 'rejected' && 'Your application was not selected.'}
                  {existingApplication.status === 'pending' && 'Your application is pending review.'}
                </p>
              </div>
            )}

            {applyMutation.isSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                Application submitted successfully!
              </div>
            )}

            {canApply && !showApplyForm && (
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
              >
                Apply for this Gig
              </button>
            )}

            {showApplyForm && (
              <form onSubmit={handleApply} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Apply for this Gig</h3>
                {applyMutation.isError && (
                  <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
                    {applyMutation.error?.message || 'Failed to submit application'}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Message to the venue *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Introduce yourself, share your experience, and why you'd be great for this gig..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}

            {/* Venue Owner View - Applications */}
            {isOwner && (
              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-xl mb-4">Applications ({applications.length})</h3>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            href={`/profile/${app.musician?.id}`}
                            className="flex items-center gap-3 hover:opacity-80"
                          >
                            <img
                              src={app.musician?.avatar_url || '/placeholder-avatar.jpg'}
                              alt={app.musician?.name || 'Musician'}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">{app.musician?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-500">{app.musician?.email || ''}</p>
                            </div>
                          </Link>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              app.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{app.message}</p>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'accepted')}
                              disabled={updateStatusMutation.isPending}
                              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              disabled={updateStatusMutation.isPending}
                              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 disabled:bg-gray-400"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
