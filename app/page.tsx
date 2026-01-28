'use client'

import Link from 'next/link'
import { useAuthListener } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { LogoAnimation } from '@/components/LogoAnimation'

export default function Home() {
  const { user, loading } = useAuthListener()

  useEffect(() => {
    if (!loading && user) {
      redirect('/dashboard')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen">
      {/* hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <LogoAnimation />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
            where musicians<br />
            <span className="text-[var(--accent)]">meet stages</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            the platform connecting talented musicians with venues looking for live performances
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Link href="/signup" className="btn btn-primary btn-lg text-lg px-8">
              get started
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg text-lg px-8">
              i have an account
            </Link>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="heading-xl text-center mb-16">how it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-flat p-8 text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="heading-md mb-3">create your profile</h3>
              <p className="text-[var(--muted)]">
                showcase your talent or venue with photos, genres, and experience
              </p>
            </div>

            <div className="card-flat p-8 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="heading-md mb-3">discover gigs</h3>
              <p className="text-[var(--muted)]">
                browse opportunities that match your style, location, and availability
              </p>
            </div>

            <div className="card-flat p-8 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="heading-md mb-3">book & perform</h3>
              <p className="text-[var(--muted)]">
                connect directly with venues, confirm details, and hit the stage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* for musicians / for venues */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* musicians */}
            <div className="card-flat p-8 md:p-10 border-l-4 border-l-emerald-500">
              <span className="badge badge-musician mb-4">for musicians</span>
              <h3 className="heading-lg mb-4">find your next gig</h3>
              <ul className="space-y-3 text-[var(--muted)]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  browse paid opportunities in your area
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  filter by genre, pay, and date
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  apply with one click
                </li>
              </ul>
            </div>

            {/* venues */}
            <div className="card-flat p-8 md:p-10 border-l-4 border-l-violet-500">
              <span className="badge badge-venue mb-4">for venues</span>
              <h3 className="heading-lg mb-4">book great talent</h3>
              <ul className="space-y-3 text-[var(--muted)]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  post gigs and receive applications
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  review musician profiles and samples
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  manage bookings in one place
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="heading-xl mb-6">ready to get started?</h2>
          <p className="text-xl text-[var(--muted)] mb-10">
            join the community of musicians and venues making live music happen
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg text-lg px-10">
            create your free account
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-[var(--muted)]">
          <p>the green room</p>
        </div>
      </footer>
    </div>
  )
}
