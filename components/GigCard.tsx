'use client'

import { Gig } from '@/types'
import Link from 'next/link'

interface GigCardProps {
  gig: Gig
}

export default function GigCard({ gig }: GigCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPay = (min: number, max: number) => {
    if (min === max) return `$${min}`
    return `$${min} - $${max}`
  }

  return (
    <Link href={`/gigs/${gig.id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer break-inside-avoid mb-4">
        {/* Gig Image */}
        <div className="relative">
          <img
            src={gig.image_url || '/placeholder-venue.jpg'}
            alt={gig.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {formatPay(gig.pay_min, gig.pay_max)}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
            {gig.title}
          </h3>

          {/* Venue Name */}
          {gig.venue && (
            <p className="text-sm text-gray-600 mb-2">
              {gig.venue.venue_name || gig.venue.name}
            </p>
          )}

          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(gig.date)} at {gig.start_time}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {gig.location}
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {gig.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {genre}
              </span>
            ))}
            {gig.genres.length > 3 && (
              <span className="text-gray-400 text-xs px-1">
                +{gig.genres.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
