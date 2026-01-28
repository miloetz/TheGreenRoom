'use client'

import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '@/hooks/useProfiles'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/hooks/useMessages'
import { Conversation } from '@/types'

export default function Messages() {
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser()
  const profile = currentUserData?.profile
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations = [], isLoading: convoLoading } = useConversations(profile?.id)
  const { data: messages = [] } = useMessages(selectedConversation?.id)
  const sendMessageMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && profile) {
      markAsReadMutation.mutate({
        conversationId: selectedConversation.id,
        userId: profile.id,
      })
    }
  }, [selectedConversation?.id, profile?.id])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !profile) return

    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversation.id,
      senderId: profile.id,
      content: newMessage.trim(),
    })
    setNewMessage('')
  }

  const getOtherUser = (convo: Conversation) => {
    if (!profile) return null
    return profile.user_type === 'musician' ? convo.venue : convo.musician
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (userLoading || convoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--muted)] text-sm">loading messages...</span>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="h-[calc(100vh-73px)] flex">
      {/* Conversation List */}
      <div className="w-80 border-r border-[var(--border)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h1 className="heading-md">messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-[var(--muted)]">
              <p className="text-sm">no conversations yet</p>
              <p className="text-xs mt-2">
                {profile.user_type === 'musician'
                  ? 'apply to a gig to start chatting'
                  : 'accept an application to start chatting'}
              </p>
            </div>
          ) : (
            conversations.map((convo) => {
              const otherUser = getOtherUser(convo)
              const isSelected = selectedConversation?.id === convo.id

              return (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConversation(convo)}
                  className={`w-full p-4 text-left border-b border-[var(--border)] transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-soft)]'
                      : 'hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium ${
                      otherUser?.user_type === 'venue'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                    }`}>
                      {otherUser?.avatar_url ? (
                        <img src={otherUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        otherUser?.name?.charAt(0).toLowerCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">
                          {otherUser?.user_type === 'venue' ? otherUser?.venue_name || otherUser?.name : otherUser?.name}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {formatTime(convo.updated_at)}
                        </span>
                      </div>
                      {convo.gig && (
                        <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                          re: {convo.gig.title}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
              {(() => {
                const otherUser = getOtherUser(selectedConversation)
                return (
                  <>
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium ${
                      otherUser?.user_type === 'venue'
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600'
                        : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                    }`}>
                      {otherUser?.avatar_url ? (
                        <img src={otherUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        otherUser?.name?.charAt(0).toLowerCase()
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium">
                        {otherUser?.user_type === 'venue' ? otherUser?.venue_name || otherUser?.name : otherUser?.name}
                      </h2>
                      {selectedConversation.gig && (
                        <p className="text-xs text-[var(--muted)]">
                          re: {selectedConversation.gig.title}
                        </p>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[var(--muted)] text-sm">
                  no messages yet - say hello!
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === profile.id

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--surface-hover)]'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-[var(--border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="type a message..."
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className="btn btn-primary px-6"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--muted)]">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
