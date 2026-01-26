import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

const supabase = createClient()

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export interface CreateProfileInput {
  id: string
  email: string
  name: string
  user_type: 'musician' | 'venue'
}

export async function createProfile(input: CreateProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([input])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
