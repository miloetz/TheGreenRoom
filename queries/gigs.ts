import { createClient } from '@/lib/supabase/client'
import { Gig, GigFilters } from '@/types'

const supabase = createClient()

export async function getOpenGigs(filters: GigFilters = {}): Promise<Gig[]> {
  let query = supabase
    .from('gigs')
    .select(`
      *,
      venue:profiles!gigs_venue_id_fkey(*)
    `)
    .eq('status', 'open')
    .order('date', { ascending: true })

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo)
  }
  if (filters.payMin) {
    query = query.gte('pay_min', filters.payMin)
  }
  if (filters.payMax) {
    query = query.lte('pay_max', filters.payMax)
  }
  if (filters.genres && filters.genres.length > 0) {
    query = query.overlaps('genres', filters.genres)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getGigById(id: string): Promise<Gig | null> {
  const { data, error } = await supabase
    .from('gigs')
    .select(`
      *,
      venue:profiles!gigs_venue_id_fkey(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message)
  }

  return data
}

export async function getGigsByVenue(venueId: string): Promise<Gig[]> {
  const { data, error } = await supabase
    .from('gigs')
    .select('*, venue:profiles!gigs_venue_id_fkey(*)')
    .eq('venue_id', venueId)
    .order('date', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}
