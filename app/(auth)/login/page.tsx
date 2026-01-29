'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const signInMutation = useSignIn()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await signInMutation.mutateAsync({ email, password })
      router.push('/dashboard')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-sm animate-fade-in-up">

        {/* title */}
        <h1 className="heading-xl text-center mb-8">welcome back</h1>

        {/* error */}
        {signInMutation.isError && (
          <div className="mb-6 alert-error animate-fade-in">
            {signInMutation.error?.message || 'login failed. please try again.'}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="your password"
              className="input"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={signInMutation.isPending}
            className="btn btn-primary w-full btn-lg mt-2"
          >
            {signInMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                signing in...
              </span>
            ) : (
              'sign in'
            )}
          </button>
        </form>

        {/* signup link */}
        <p className="text-center text-sm text-[var(--muted)] mt-8">
          don't have an account?{' '}
          <a href="/signup" className="text-[var(--accent)] hover:underline font-medium">
            get started
          </a>
        </p>
      </div>
    </div>
  )
}
