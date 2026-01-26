import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface CreateApplicationInput {
  gig_id: string
  musician_id: string
  message: string
}

export async function createApplication(input: CreateApplicationInput) {
  const { data, error } = await supabase
    .from('applications')
    .insert([{ ...input, status: 'pending' }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'accepted' | 'rejected'
) {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
