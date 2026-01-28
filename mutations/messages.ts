import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types'

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
