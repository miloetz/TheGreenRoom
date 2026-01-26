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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <img
          src="/thegreenroom.png"
          alt="TheGreenRoom Logo"
          className="flex items-center justify-center"
        />

        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {signUpMutation.isError && (
          <div className="bg-red-50 text-red-500 p-3 rounded">
            {signUpMutation.error?.message || 'Signup failed'}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">I am a:</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('musician')}
                className={`flex-1 py-2 px-4 rounded ${
                  userType === 'musician' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Musician
              </button>
              <button
                type="button"
                onClick={() => setUserType('venue')}
                className={`flex-1 py-2 px-4 rounded ${
                  userType === 'venue' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                Venue
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            disabled={signUpMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {signUpMutation.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
