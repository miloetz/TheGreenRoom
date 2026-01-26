import { createClient } from '@/lib/supabase/client'

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
