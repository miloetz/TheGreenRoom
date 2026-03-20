import { createClient } from '@/lib/supabase/client'
import { Profile, ProfileFilters } from '@/types'

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

export async function getProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('name', { ascending: true })

  // Filter by user type (musician or venue)
  if (filters.userType) {
    query = query.eq('user_type', filters.userType)
  }

  // Search by name (case-insensitive partial match)
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  // Filter by location (case-insensitive partial match)
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  // Filter by genres (array overlap)
  if (filters.genres && filters.genres.length > 0) {
    query = query.overlaps('genres', filters.genres)
  }

  // Musician-specific filters
  if (filters.instruments && filters.instruments.length > 0) {
    query = query.overlaps('instruments', filters.instruments)
  }
  if (filters.experienceMin !== undefined) {
    query = query.gte('experience_years', filters.experienceMin)
  }
  if (filters.experienceMax !== undefined) {
    query = query.lte('experience_years', filters.experienceMax)
  }

  // Venue-specific filters
  if (filters.capacityMin !== undefined) {
    query = query.gte('venue_capacity', filters.capacityMin)
  }
  if (filters.capacityMax !== undefined) {
    query = query.lte('venue_capacity', filters.capacityMax)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}
