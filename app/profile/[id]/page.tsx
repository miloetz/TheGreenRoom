'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useProfile, useCurrentUser } from '@/hooks/useProfiles'
import { useVenueGigs } from '@/hooks/useGigs'
import GigCard from '@/components/GigCard'

export default function ProfileView() {
  const params = useParams()
  const profileId = params.id as string

  const { data: profile, isLoading: profileLoading } = useProfile(profileId)
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser()
  const currentUser = currentUserData?.profile

  const { data: gigs = [] } = useVenueGigs(
    profile?.user_type === 'venue' ? profileId : ''
  )

  if (profileLoading || userLoading) {
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

  const isOwnProfile = currentUser?.id === profile.id
  const displayName = profile.user_type === 'venue' && profile.venue_name
    ? profile.venue_name
    : profile.name

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

        {/* profile card */}
        <div className="card-flat overflow-hidden animate-fade-in-up">
          {/* profile content */}
          <div className="p-6 md:p-8">
            {/* avatar & header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className={`w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ${
                profile.user_type === 'venue'
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500'
              }`}>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {displayName.charAt(0).toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="heading-lg !normal-case">{displayName}</h1>
                    {profile.user_type === 'venue' && profile.venue_name && profile.name && (
                      <p className="text-[var(--muted)] text-sm">by {profile.name}</p>
                    )}
                    <span className={`badge mt-2 inline-block ${
                      profile.user_type === 'venue' ? 'badge-venue' : 'badge-musician'
                    }`}>
                      {profile.user_type}
                    </span>
                  </div>

                  {isOwnProfile && (
                    <Link
                      href="/profile/edit"
                      className="btn btn-ghost btn-sm self-start"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      edit
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* stats / quick info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {profile.location && (
                <div className="card-flat p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-xs">location</span>
                  </div>
                  <p className="font-medium text-sm">{profile.location.toLowerCase()}</p>
                </div>
              )}

              {profile.user_type === 'venue' && profile.venue_capacity && (
                <div className="card-flat p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">capacity</span>
                  </div>
                  <p className="font-medium text-sm">{profile.venue_capacity} people</p>
                </div>
              )}

              {profile.user_type === 'musician' && profile.experience_years && (
                <div className="card-flat p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">experience</span>
                  </div>
                  <p className="font-medium text-sm">{profile.experience_years} years</p>
                </div>
              )}

              {profile.user_type === 'venue' && gigs.length > 0 && (
                <div className="card-flat p-4">
                  <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-xs">gigs posted</span>
                  </div>
                  <p className="font-medium text-sm">{gigs.length}</p>
                </div>
              )}
            </div>

            {/* genres */}
            {profile.genres && profile.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="heading-sm mb-3">genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.genres.map((genre) => (
                    <span key={genre} className="tag tag-accent">
                      {genre.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* instruments (musician) */}
            {profile.user_type === 'musician' && profile.instruments && profile.instruments.length > 0 && (
              <div className="mb-6">
                <h3 className="heading-sm mb-3">instruments</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.instruments.map((instrument) => (
                    <span key={instrument} className="tag">
                      {instrument.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* bio */}
            {profile.bio && (
              <div className="mb-6">
                <h3 className="heading-sm mb-3">about</h3>
                <p className="text-[var(--muted)] leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* venue address */}
            {profile.user_type === 'venue' && profile.venue_address && (
              <div className="mb-6">
                <h3 className="heading-sm mb-3">address</h3>
                <div className="flex items-start gap-3 text-[var(--muted)]">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>{profile.venue_address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* venue's gigs */}
        {profile.user_type === 'venue' && gigs.length > 0 && (
          <div className="mt-10 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-md">posted gigs</h2>
              {isOwnProfile && (
                <Link href="/gigs/new" className="btn btn-accent btn-sm">
                  + post new gig
                </Link>
              )}
            </div>
            <div className="columns-1 sm:columns-2 gap-4 stagger-children">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        )}

        {/* empty state for venue with no gigs */}
        {profile.user_type === 'venue' && gigs.length === 0 && isOwnProfile && (
          <div className="mt-10 card-flat p-10 text-center animate-fade-in">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="heading-md mb-2">no gigs posted yet</h2>
            <p className="text-[var(--muted)] mb-6">
              start attracting talent by posting your first gig
            </p>
            <Link href="/gigs/new" className="btn btn-accent">
              post your first gig
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
