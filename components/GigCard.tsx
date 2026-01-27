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
      month: 'short',
      day: 'numeric'
    }).toLowerCase()
  }

  const formatPay = (min: number, max: number) => {
    if (min === max) return `$${min}`
    return `$${min}-${max}`
  }

  return (
    <Link href={`/gigs/${gig.id}`} className="block">
      <article className="card overflow-hidden break-inside-avoid mb-4 group">
        {/* image */}
        {gig.image_url && (
          <div className="relative overflow-hidden">
            <img
              src={gig.image_url}
              alt=""
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* content */}
        <div className="p-5">
          {/* pay badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="tag tag-accent font-semibold">
              {formatPay(gig.pay_min, gig.pay_max)}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {formatDate(gig.date)}
            </span>
          </div>

          {/* title */}
          <h3 className="heading-sm !normal-case font-bold mb-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
            {gig.title}
          </h3>

          {/* venue */}
          {gig.venue && (
            <p className="text-sm text-[var(--muted)] mb-3">
              {gig.venue.venue_name || gig.venue.name}
            </p>
          )}

          {/* meta */}
          <div className="flex items-center gap-4 text-xs text-[var(--muted-soft)] mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {gig.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {gig.start_time}
            </span>
          </div>

          {/* genres */}
          <div className="flex flex-wrap gap-1.5">
            {gig.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="tag text-[10px]">
                {genre.toLowerCase()}
              </span>
            ))}
            {gig.genres.length > 3 && (
              <span className="tag text-[10px]">
                +{gig.genres.length - 3}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
