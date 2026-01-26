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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) return null

  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 mb-6">
              <img
                src={profile.avatar_url || '/placeholder-avatar.jpg'}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white"
              />
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.user_type === 'venue' && profile.venue_name
                        ? profile.venue_name
                        : profile.name}
                    </h1>
                    {profile.user_type === 'venue' && profile.venue_name && (
                      <p className="text-gray-600">by {profile.name}</p>
                    )}
                    <span
                      className={`inline-block mt-1 text-sm px-3 py-1 rounded-full ${
                        profile.user_type === 'venue'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {profile.user_type === 'venue' ? 'Venue' : 'Musician'}
                    </span>
                  </div>
                  {isOwnProfile && (
                    <Link
                      href="/profile/edit"
                      className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium self-start"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Location */}
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profile.location}
                </div>
              )}

              {/* Venue specific */}
              {profile.user_type === 'venue' && profile.venue_capacity && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Capacity: {profile.venue_capacity}
                </div>
              )}

              {/* Musician specific */}
              {profile.user_type === 'musician' && profile.experience_years && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {profile.experience_years} years experience
                </div>
              )}
            </div>

            {/* Genres */}
            {profile.genres && profile.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instruments (Musician) */}
            {profile.user_type === 'musician' &&
              profile.instruments &&
              profile.instruments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Instruments</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.instruments.map((instrument) => (
                      <span
                        key={instrument}
                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                      >
                        {instrument}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {/* Venue Address */}
            {profile.user_type === 'venue' && profile.venue_address && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-700">{profile.venue_address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Venue's Gigs */}
        {profile.user_type === 'venue' && gigs.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Posted Gigs</h2>
              {isOwnProfile && (
                <Link
                  href="/gigs/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Post New Gig
                </Link>
              )}
            </div>
            <div className="columns-1 sm:columns-2 gap-4">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        )}

        {/* Post Gig CTA for venue with no gigs */}
        {profile.user_type === 'venue' && gigs.length === 0 && isOwnProfile && (
          <div className="mt-8 bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-bold mb-2">No gigs posted yet</h2>
            <p className="text-gray-600 mb-4">Start attracting talent by posting your first gig!</p>
            <Link
              href="/gigs/new"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Post Your First Gig
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
