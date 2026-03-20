import { createClient } from '@/lib/supabase/client'
import { createNotification } from './notifications'

const supabase = createClient()

export interface CreateGigInput {
  venue_id: string
  title: string
  description: string
  date: string
  start_time: string
  end_time?: string
  location: string
  pay_min: number
  pay_max: number
  genres: string[]
  image_url?: string
  requirements?: string
}

export async function createGig(input: CreateGigInput) {
  const { data, error } = await supabase
    .from('gigs')
    .insert([{ ...input, status: 'open' }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateGigStatus(
  gigId: string,
  status: 'open' | 'closed' | 'filled'
) {
  const { data, error } = await supabase
    .from('gigs')
    .update({ status })
    .eq('id', gigId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export interface UpdateGigInput {
  title?: string
  description?: string
  date?: string
  start_time?: string
  end_time?: string
  location?: string
  pay_min?: number
  pay_max?: number
  genres?: string[]
  image_url?: string
  requirements?: string
}

export async function updateGig(gigId: string, input: UpdateGigInput) {
  const { data, error } = await supabase
    .from('gigs')
    .update(input)
    .eq('id', gigId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Notify all applicants that the gig was updated
  const { data: applications } = await supabase
    .from('applications')
    .select('musician_id')
    .eq('gig_id', gigId)

  if (applications && applications.length > 0) {
    // Create notifications for all applicants
    await Promise.all(
      applications.map((app) =>
        createNotification({
          user_id: app.musician_id,
          type: 'gig_updated',
          title: `Gig Updated: ${data.title}`,
          body: 'The details for this gig have been changed',
          link: `/gigs/${gigId}`,
          related_id: gigId,
        })
      )
    )
  }

  return data
}

export async function deleteGig(gigId: string) {
  const { error } = await supabase
    .from('gigs')
    .delete()
    .eq('id', gigId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
