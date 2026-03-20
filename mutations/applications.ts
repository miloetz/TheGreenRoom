import { createClient } from '@/lib/supabase/client'
import { createNotification } from './notifications'

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
    .select(`
      *,
      gig:gigs(*),
      musician:profiles!applications_musician_id_fkey(*)
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Notify venue owner of new application
  if (data.gig?.venue_id && data.musician) {
    await createNotification({
      user_id: data.gig.venue_id,
      type: 'new_application',
      title: 'New Application',
      body: `${data.musician.name} applied to ${data.gig.title}`,
      link: `/gigs/${data.gig_id}`,
      related_id: data.gig_id,
    })
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
    const { error: gigUpdateError } = await supabase
      .from('gigs')
      .update({ status: 'filled' })
      .eq('id', application.gig_id)

    if (gigUpdateError) {
      console.error('Failed to update gig status:', gigUpdateError.message)
    }
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

  // Notify musician of application status change
  if (application.gig) {
    await createNotification({
      user_id: application.musician_id,
      type: 'application_status',
      title: status === 'accepted' ? 'Application Accepted' : 'Application Update',
      body: `Your application for ${application.gig.title} was ${status}`,
      link: `/gigs/${application.gig_id}`,
      related_id: applicationId,
    })
  }

  return data
}
