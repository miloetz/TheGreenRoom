'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@/hooks/useAuth'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [userType, setUserType] = useState<'musician' | 'venue'>('musician')
  const router = useRouter()
  const signUpMutation = useSignUp()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signUpMutation.mutateAsync({
        email,
        password,
        profileData: {
          name,
          user_type: userType,
        },
      })
      router.push('/dashboard')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* brand */}
        <a href="/" className="block text-center mb-12">
          <span className="heading-lg">thegreenroom</span>
        </a>

        {/* title */}
        <h1 className="heading-xl text-center mb-3">join the room</h1>
        <p className="text-center text-[var(--muted)] mb-8">
          connect with venues and musicians
        </p>

        {/* error */}
        {signUpMutation.isError && (
          <div className="mb-6 alert-error animate-fade-in">
            {signUpMutation.error?.message || 'signup failed. please try again.'}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* role selector */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-3 lowercase">
              i am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('musician')}
                className={`group relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'musician'
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-6 h-6 transition-colors ${userType === 'musician' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className={`text-sm font-medium lowercase ${userType === 'musician' ? 'text-[var(--accent)]' : ''}`}>
                    musician
                  </span>
                </div>
                {userType === 'musician' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => setUserType('venue')}
                className={`group relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'venue'
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--surface)]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className={`w-6 h-6 transition-colors ${userType === 'venue' ? 'text-violet-500' : 'text-[var(--muted)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className={`text-sm font-medium lowercase ${userType === 'venue' ? 'text-violet-500' : ''}`}>
                    venue
                  </span>
                </div>
                {userType === 'venue' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
              {userType === 'venue' ? 'venue name' : 'your name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={userType === 'venue' ? 'the blue note' : 'john doe'}
              className="input"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
              email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-2 lowercase">
              password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="create a password"
              className="input"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={signUpMutation.isPending}
            className={`btn w-full btn-lg mt-2 ${
              userType === 'venue'
                ? 'bg-violet-500 hover:bg-violet-600 text-white'
                : 'btn-accent'
            }`}
          >
            {signUpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                creating account...
              </span>
            ) : (
              'create account'
            )}
          </button>
        </form>

        {/* login link */}
        <p className="text-center text-sm text-[var(--muted)] mt-8">
          already have an account?{' '}
          <a href="/login" className="text-[var(--accent)] hover:underline font-medium">
            sign in
          </a>
        </p>
      </div>
    </div>
  )
}
