import { createClient } from '@/lib/supabase/client'
import { NotificationType } from '@/types'

const supabase = createClient()

export interface CreateNotificationInput {
  user_id: string
  type: NotificationType
  title: string
  body?: string
  link?: string
  related_id?: string
}

export async function createNotification(input: CreateNotificationInput) {
  const { data, error } = await supabase.rpc('create_notification', {
    p_user_id: input.user_id,
    p_type: input.type,
    p_title: input.title,
    p_body: input.body ?? null,
    p_link: input.link ?? null,
    p_related_id: input.related_id ?? null,
  })

  if (error) {
    console.error('Failed to create notification:', error.message)
    return null
  }

  return { id: data, ...input }
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
