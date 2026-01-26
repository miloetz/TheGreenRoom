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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow">
        <img
          src="/thegreenroom.png"
          alt="TheGreenRoom Logo"
          className="flex items-center justify-center"
        />
        <h2 className="text-3xl font-bold text-center">Log In</h2>

        {signInMutation.isError && (
          <div className="bg-red-50 text-red-500 p-3 rounded">
            {signInMutation.error?.message || 'Login failed'}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={signInMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {signInMutation.isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
