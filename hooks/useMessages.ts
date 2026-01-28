import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getConversations, getConversation, getMessages, getOrCreateConversation } from '@/queries/messages'
import { sendMessage, markMessagesAsRead, SendMessageInput } from '@/mutations/messages'

export function useConversations(userId: string | undefined) {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => getConversations(userId!),
    enabled: !!userId,
  })
}

export function useConversation(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => getConversation(conversationId!),
    enabled: !!conversationId,
  })
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SendMessageInput) => sendMessage(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      markMessagesAsRead(conversationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useGetOrCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      musicianId,
      venueId,
      gigId,
      applicationId,
    }: {
      musicianId: string
      venueId: string
      gigId?: string
      applicationId?: string
    }) => getOrCreateConversation(musicianId, venueId, gigId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
