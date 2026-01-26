import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { signIn, signUp, signOut } from '@/mutations/auth'
import { createProfile, CreateProfileInput } from '@/mutations/profiles'
import { profileKeys } from './useProfiles'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export function useAuthListener() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Invalidate user-related queries on auth change
      queryClient.invalidateQueries({ queryKey: profileKeys.currentUser() })
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  return { user, loading }
}

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.currentUser() })
    },
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      profileData,
    }: {
      email: string
      password: string
      profileData: Omit<CreateProfileInput, 'id' | 'email'>
    }) => {
      const authData = await signUp(email, password)

      if (authData.user) {
        await createProfile({
          id: authData.user.id,
          email,
          ...profileData,
        })
      }

      return authData
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
