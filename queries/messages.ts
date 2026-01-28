import { createClient } from '@/lib/supabase/client'
import { Conversation, Message } from '@/types'

const supabase = createClient()

export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      gig:gigs(*),
      musician:profiles!conversations_musician_id_fkey(*),
      venue:profiles!conversations_venue_id_fkey(*)
    `)
    .or(`musician_id.eq.${userId},venue_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      gig:gigs(*),
      musician:profiles!conversations_musician_id_fkey(*),
      venue:profiles!conversations_venue_id_fkey(*)
    `)
    .eq('id', conversationId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(*)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getOrCreateConversation(
  musicianId: string,
  venueId: string,
  gigId?: string,
  applicationId?: string
): Promise<Conversation> {
  // Try to find existing conversation
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('musician_id', musicianId)
    .eq('venue_id', venueId)

  if (gigId) {
    query = query.eq('gig_id', gigId)
  } else {
    query = query.is('gig_id', null)
  }

  const { data: existing } = await query.single()

  if (existing) {
    return existing
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      musician_id: musicianId,
      venue_id: venueId,
      gig_id: gigId || null,
      application_id: applicationId || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
