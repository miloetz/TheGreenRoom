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
    } catch {
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
      month: 'short',
      day: 'numeric',
    }).toLowerCase()
  }

  const formatPay = (min: number | null, max: number | null) => {
    if (!min && !max) return 'tbd'
    if (min === max) return `$${min}`
    return `$${min ?? 0}-${max ?? 0}`
  }

  if (gigLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--muted)] text-sm">loading gig...</span>
        </div>
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
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-6">
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

        <article className="card-flat overflow-hidden animate-fade-in-up">
          {/* hero image */}
          {gig.image_url && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={gig.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* pay badge */}
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--accent)] text-white font-bold text-lg">
                  {formatPay(gig.pay_min, gig.pay_max)}
                </span>
              </div>

              {/* status badge */}
              {gig.status !== 'open' && (
                <div className="absolute top-4 left-6">
                  <span className="tag bg-[var(--foreground)] text-[var(--background)]">
                    {gig.status === 'filled' ? 'position filled' : 'closed'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* content */}
          <div className="p-6 md:p-8">
            {/* title */}
            <h1 className="heading-lg !normal-case mb-4">{gig.title}</h1>

            {/* venue info */}
            {gig.venue && (
              <Link
                href={`/profile/${gig.venue.id}`}
                className="inline-flex items-center gap-3 mb-6 group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                  {gig.venue.avatar_url ? (
                    <img
                      src={gig.venue.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="font-medium group-hover:text-[var(--accent)] transition-colors">
                  {gig.venue.venue_name || gig.venue.name}
                </span>
              </Link>
            )}

            {/* quick info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-[var(--border)] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] lowercase">date</p>
                  <p className="font-medium text-sm">{formatDate(gig.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] lowercase">time</p>
                  <p className="font-medium text-sm">
                    {gig.start_time}
                    {gig.end_time && ` - ${gig.end_time}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--surface-hover)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] lowercase">location</p>
                  <p className="font-medium text-sm">{gig.location}</p>
                </div>
              </div>
            </div>

            {/* genres */}
            <div className="mb-6">
              <h3 className="heading-sm mb-3">genres</h3>
              <div className="flex flex-wrap gap-2">
                {gig.genres.map((genre: string) => (
                  <span key={genre} className="tag tag-accent">
                    {genre.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* description */}
            <div className="mb-6">
              <h3 className="heading-sm mb-3">about this gig</h3>
              <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>

            {/* requirements */}
            {gig.requirements && (
              <div className="mb-8">
                <h3 className="heading-sm mb-3">requirements</h3>
                <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                  {gig.requirements}
                </p>
              </div>
            )}

            {/* apply section */}
            <div className="pt-6 border-t border-[var(--border)]">
              {!profile && (
                <div className="card-flat p-6 text-center">
                  <p className="text-[var(--muted)] mb-4">sign in to apply for this gig</p>
                  <Link href="/login" className="btn btn-primary">
                    log in or sign up
                  </Link>
                </div>
              )}

              {existingApplication && (
                <div
                  className={`p-5 rounded-lg ${
                    existingApplication.status === 'accepted'
                      ? 'bg-[var(--accent-soft)]'
                      : existingApplication.status === 'rejected'
                      ? 'bg-[var(--danger-soft)]'
                      : 'bg-[var(--surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {existingApplication.status === 'accepted' && (
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {existingApplication.status === 'rejected' && (
                      <svg className="w-5 h-5 text-[var(--danger)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {existingApplication.status === 'pending' && (
                      <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="font-medium">
                      {existingApplication.status === 'accepted' && 'your application was accepted!'}
                      {existingApplication.status === 'rejected' && 'your application was not selected'}
                      {existingApplication.status === 'pending' && 'your application is pending review'}
                    </span>
                  </div>
                </div>
              )}

              {applyMutation.isSuccess && (
                <div className="p-5 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] animate-fade-in">
                  application submitted successfully!
                </div>
              )}

              {canApply && !showApplyForm && (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="btn btn-accent btn-lg w-full group"
                >
                  <span>apply for this gig</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}

              {showApplyForm && (
                <form onSubmit={handleApply} className="card-flat p-6 animate-fade-in-up">
                  <h3 className="heading-sm mb-4">apply for this gig</h3>
                  {applyMutation.isError && (
                    <div className="mb-4 alert-error">
                      {applyMutation.error?.message || 'failed to submit application'}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
                      message to the venue
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="introduce yourself, share your experience, and why you'd be great for this gig..."
                      className="input resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="btn btn-ghost flex-1"
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      disabled={applyMutation.isPending}
                      className="btn btn-accent flex-1"
                    >
                      {applyMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          submitting...
                        </span>
                      ) : (
                        'submit application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* venue owner view - applications */}
            {isOwner && (
              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <h3 className="heading-md mb-6">
                  applications
                  <span className="ml-2 text-[var(--muted)]">({applications.length})</span>
                </h3>
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-[var(--muted)]">no applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 stagger-children">
                    {applications.map((app) => (
                      <div key={app.id} className="card-flat p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <Link
                            href={`/profile/${app.musician?.id}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                              {app.musician?.avatar_url ? (
                                <img
                                  src={app.musician.avatar_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium group-hover:text-[var(--accent)] transition-colors">
                                {app.musician?.name || 'unknown'}
                              </p>
                              <p className="text-xs text-[var(--muted)]">{app.musician?.email || ''}</p>
                            </div>
                          </Link>
                          <span
                            className={`badge ${
                              app.status === 'accepted'
                                ? 'badge-musician'
                                : app.status === 'rejected'
                                ? 'bg-[var(--danger-soft)] text-[var(--danger-text)]'
                                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[var(--muted)] text-sm mb-4">{app.message}</p>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'accepted')}
                              disabled={updateStatusMutation.isPending}
                              className="btn btn-accent btn-sm"
                            >
                              accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              disabled={updateStatusMutation.isPending}
                              className="btn btn-ghost btn-sm text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                            >
                              reject
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
        </article>
      </div>
    </div>
  )
}
