import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

const supabase = createClient()

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message)
  }

  return data
}

export async function getCurrentUser(): Promise<{ user: any; profile: Profile | null }> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const profile = await getProfileById(user.id)
  return { user, profile }
}
