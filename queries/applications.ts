import { createClient } from '@/lib/supabase/client'
import { Application } from '@/types'

const supabase = createClient()

export async function getApplicationsByGig(gigId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      musician:profiles!applications_musician_id_fkey(*)
    `)
    .eq('gig_id', gigId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getUserApplicationForGig(
  gigId: string,
  userId: string
): Promise<Application | null> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('gig_id', gigId)
    .eq('musician_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message)
  }

  return data
}
