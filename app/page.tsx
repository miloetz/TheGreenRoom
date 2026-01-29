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
    <div className="min-h-screen flex flex-col">
      {/* hero */}
      <section className="flex-1 flex items-center justify-center py-24 relative overflow-hidden">
        <LogoAnimation />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            where the music flows
          </h1>
          <p className="text-lg text-[var(--muted)] mb-10">
            connecting musicians and venues. find gigs, book talent, keep the live music spirit alive.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary btn-lg">
              get started
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              sign in
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="py-4 text-center text-sm text-[var(--muted)]">
        <p>thegreenroom.</p>
      </footer>
    </div>
  )
}
