import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, getUnreadCount } from '@/queries/notifications'
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '@/mutations/notifications'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (userId: string) => [...notificationKeys.all, 'list', userId] as const,
  unreadCount: (userId: string) => [...notificationKeys.all, 'unreadCount', userId] as const,
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.list(userId || ''),
    queryFn: () => getNotifications(userId!),
    enabled: !!userId,
    refetchInterval: 30000, // Poll every 30 seconds
  })
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId || ''),
    queryFn: () => getUnreadCount(userId!),
    enabled: !!userId,
    refetchInterval: 15000, // Poll every 15 seconds for badge updates
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
