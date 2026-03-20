'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthListener, useSignOut } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useProfiles'
import Notifications from './Notifications'

export default function Header() {
  const router = useRouter()
  const { user } = useAuthListener()
  const { data: currentUserData } = useCurrentUser()
  const profile = currentUserData?.profile
  const signOutMutation = useSignOut()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleLogout = async () => {
    await signOutMutation.mutateAsync()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 glass relative pt-5">
      {user && profile && (
        <span className={`absolute top-3 right-6 text-xs font-medium lowercase px-3 py-1 rounded-full ${
          profile.user_type === 'venue' 
            ? 'bg-purple-500/15 text-purple-400' 
            : 'bg-emerald-500/15 text-emerald-400'
        }`}>
          {profile.user_type}
        </span>
      )}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href={user ? "/dashboard" : "/"} className="block">
            <img
              src="/thegreenroom.png"
              alt="the green room"
              className="logo h-9 w-auto hover:opacity-80 transition-all"
            />
          </a>

          {user ? (
            <div className="flex items-center gap-3">

              <div className="hidden md:flex items-center gap-1">
                <a href="/dashboard" className="nav-link">discover</a>
                <a href="/messages" className="nav-link">messages</a>
                {profile?.user_type === 'venue' && (
                  <a href="/gigs/new" className="nav-link text-[var(--accent)]">+ post</a>
                )}
              </div>

              {profile && <Notifications userId={profile.id} />}

              <div className="nav-expandable" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                <button className="nav-icon-btn" aria-label="Menu">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className={`nav-slide ${menuOpen ? 'open' : ''}`}>
                  <a href="/musicians" className="nav-slide-link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span>musicians</span>
                  </a>
                  <a href="/venues" className="nav-slide-link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>venues</span>
                  </a>
                  {profile && (
                    <a href={`/profile/${profile.id}`} className="nav-slide-link">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>profile</span>
                    </a>
                  )}
                  <button onClick={toggleTheme} className="nav-slide-link">
                    {theme === 'dark' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>light</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span>dark</span>
                      </>
                    )}
                  </button>
                  <button onClick={handleLogout} disabled={signOutMutation.isPending} className="nav-slide-link text-[var(--danger)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{signOutMutation.isPending ? '...' : 'logout'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 -mr-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/login" className="nav-link">login</a>
              <a href="/signup" className="btn btn-primary btn-sm">get started</a>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors" aria-label="Toggle theme">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {menuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  {profile && (
                    <span className={`badge self-start mb-2 ${profile.user_type === 'venue' ? 'badge-venue' : 'badge-musician'}`}>
                      {profile.user_type}
                    </span>
                  )}
                  <a href="/dashboard" className="mobile-nav-link">discover</a>
                  <a href="/musicians" className="mobile-nav-link">musicians</a>
                  <a href="/venues" className="mobile-nav-link">venues</a>
                  <a href="/messages" className="mobile-nav-link">messages</a>
                  {profile && <a href={`/profile/${profile.id}`} className="mobile-nav-link">profile</a>}
                  {profile?.user_type === 'venue' && (
                    <a href="/gigs/new" className="mobile-nav-link text-[var(--accent)]">+ post gig</a>
                  )}
                  <button onClick={handleLogout} disabled={signOutMutation.isPending} className="mobile-nav-link text-left text-[var(--muted)]">
                    {signOutMutation.isPending ? 'logging out...' : 'logout'}
                  </button>
                  <button onClick={toggleTheme} className="mobile-nav-link text-left flex items-center gap-2">
                    {theme === 'dark' ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        light mode
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        dark mode
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="mobile-nav-link">login</a>
                  <a href="/signup" className="mobile-nav-link text-[var(--accent)]">get started</a>
                </>
              )}
            </div>
          </nav>
        )}
      </div>

      <style jsx>{`
        .nav-link {
          padding: 0.5rem 0.875rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--muted);
          border-radius: 8px;
          transition: all 150ms ease;
          text-transform: lowercase;
        }
        .nav-link:hover {
          color: var(--foreground);
          background: var(--surface-hover);
        }
        .nav-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          color: var(--muted);
          transition: all 150ms ease;
        }
        .nav-icon-btn:hover {
          color: var(--foreground);
          background: var(--surface-hover);
        }
        .nav-expandable {
          position: relative;
          display: none;
        }
        @media (min-width: 768px) {
          .nav-expandable {
            display: block;
          }
        }
        .nav-slide {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 140px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 200ms ease;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        .nav-slide.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .nav-slide-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--muted);
          border-radius: 8px;
          transition: all 150ms ease;
          text-transform: lowercase;
          white-space: nowrap;
        }
        .nav-slide-link:hover {
          color: var(--foreground);
          background: var(--surface-hover);
        }
        .mobile-nav-link {
          padding: 0.75rem 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--foreground);
          border-bottom: 1px solid var(--border);
          transition: color 150ms ease;
          text-transform: lowercase;
        }
        .mobile-nav-link:hover {
          color: var(--accent);
        }
        .mobile-nav-link:last-child {
          border-bottom: none;
        }
      `}</style>
    </header>
  )
}
