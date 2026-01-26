'use client'

import { useRouter } from 'next/navigation'
import { TextField } from '@mui/material'
import { useAuthListener, useSignOut } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useProfiles'

export default function Header() {
  const router = useRouter()
  const { user } = useAuthListener()
  const { data: currentUserData } = useCurrentUser()
  const profile = currentUserData?.profile
  const signOutMutation = useSignOut()

  const handleLogout = async () => {
    await signOutMutation.mutateAsync()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/dashboard">
          <img src="/thegreenroom.png" alt="TheGreenRoom" className="h-10" />
        </a>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              {profile && (
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    profile.user_type === 'venue'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {profile.user_type === 'venue' ? 'Venue' : 'Musician'}
                </span>
              )}
              {profile?.user_type === 'venue' && (
                <a
                  href="/gigs/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                >
                  + New Gig
                </a>
              )}
              <TextField
                id="outlined-basic"
                label="search for gigs"
                variant="outlined"
                size="small"
              />
              <a href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </a>
              <a href="/messages" className="hover:text-blue-600">
                Messages
              </a>
              <a href="/profile/edit" className="hover:text-blue-600">
                Profile
              </a>
              <button
                onClick={handleLogout}
                disabled={signOutMutation.isPending}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                {signOutMutation.isPending ? 'Logging out...' : 'Log Out'}
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-blue-600">
                Log In
              </a>
              <a
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
