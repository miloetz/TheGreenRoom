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
  // Get application with gig info first
  const { data: application, error: fetchError } = await supabase
    .from('applications')
    .select('*, gig:gigs(*)')
    .eq('id', applicationId)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  // Update the status
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (status === 'accepted') {
      await supabase
        .from('gigs')
        .update({ status: 'filled' })
        .eq('id', application.gig_id)
    }

  // If accepted, create a conversation
  if (status === 'accepted' && application.gig) {
    const { error: convoError } = await supabase
      .from('conversations')
      .insert({
        musician_id: application.musician_id,
        venue_id: application.gig.venue_id,
        gig_id: application.gig_id,
        application_id: applicationId,
      })
      .select()
      .single()

    // Ignore duplicate error (conversation already exists)
    if (convoError && !convoError.message.includes('duplicate')) {
      console.error('Failed to create conversation:', convoError)
    }
  }

  return data
}
