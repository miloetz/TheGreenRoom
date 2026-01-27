'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthListener, useSignOut } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useProfiles'

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
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* logo */}
          <a href="/dashboard" className="block">
            <img
              src="/thegreenroom.png"
              alt="the green room"
              className="logo h-9 w-auto hover:opacity-80 transition-all"
            />
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {/* role badge */}
                {profile && (
                  <span className={`badge mr-4 ${
                    profile.user_type === 'venue' ? 'badge-venue' : 'badge-musician'
                  }`}>
                    {profile.user_type}
                  </span>
                )}

                {/* nav links */}
                <a href="/dashboard" className="nav-link">
                  discover
                </a>
                <a href="/messages" className="nav-link">
                  messages
                </a>
                {profile && (
                  <a href={`/profile/${profile.id}`} className="nav-link">
                    profile
                  </a>
                )}

                {/* post gig button for venues */}
                {profile?.user_type === 'venue' && (
                  <a href="/gigs/new" className="btn btn-accent btn-sm ml-2">
                    + post gig
                  </a>
                )}

                {/* logout */}
                <button
                  onClick={handleLogout}
                  disabled={signOutMutation.isPending}
                  className="nav-link ml-2 text-[var(--muted)] hover:text-[var(--danger)]"
                >
                  {signOutMutation.isPending ? '...' : 'logout'}
                </button>

                {/* theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="ml-2 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  aria-label="Toggle theme"
                >
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
              </>
            ) : (
              <>
                <a href="/login" className="nav-link">
                  login
                </a>
                <a href="/signup" className="btn btn-primary btn-sm ml-2">
                  get started
                </a>

                {/* theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="ml-2 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  aria-label="Toggle theme"
                >
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
              </>
            )}
          </nav>

          {/* mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2 hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  {profile && (
                    <span className={`badge self-start mb-2 ${
                      profile.user_type === 'venue' ? 'badge-venue' : 'badge-musician'
                    }`}>
                      {profile.user_type}
                    </span>
                  )}
                  <a href="/dashboard" className="mobile-nav-link">discover</a>
                  <a href="/messages" className="mobile-nav-link">messages</a>
                  {profile && (
                    <a href={`/profile/${profile.id}`} className="mobile-nav-link">profile</a>
                  )}
                  {profile?.user_type === 'venue' && (
                    <a href="/gigs/new" className="mobile-nav-link text-[var(--accent)]">+ post gig</a>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={signOutMutation.isPending}
                    className="mobile-nav-link text-left text-[var(--muted)]"
                  >
                    {signOutMutation.isPending ? 'logging out...' : 'logout'}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="mobile-nav-link text-left flex items-center gap-2"
                  >
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
                  <button
                    onClick={toggleTheme}
                    className="mobile-nav-link text-left flex items-center gap-2"
                  >
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
