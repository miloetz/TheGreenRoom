import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types'
import { createNotification } from './notifications'

const supabase = createClient()

export interface SendMessageInput {
  conversationId: string
  senderId: string
  content: string
}

export async function sendMessage(input: SendMessageInput): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: input.conversationId,
      sender_id: input.senderId,
      content: input.content,
    })
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(*)
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // Get conversation to find recipient
  const { data: conversation } = await supabase
    .from('conversations')
    .select('musician_id, venue_id')
    .eq('id', input.conversationId)
    .single()

  // Notify recipient of new message
  if (conversation && data.sender) {
    const recipientId = conversation.musician_id === input.senderId
      ? conversation.venue_id
      : conversation.musician_id

    await createNotification({
      user_id: recipientId,
      type: 'message',
      title: `New message from ${data.sender.name}`,
      body: input.content.substring(0, 100) + (input.content.length > 100 ? '...' : ''),
      link: `/messages?conversation=${input.conversationId}`,
      related_id: input.conversationId,
    })
  }

  return data
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null)

  if (error) {
    throw new Error(error.message)
  }
}
