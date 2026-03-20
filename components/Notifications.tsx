'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/useNotifications'
import { Notification, NotificationType } from '@/types'

interface NotificationsProps {
  userId: string
}

export default function Notifications({ userId }: NotificationsProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: notifications = [] } = useNotifications(userId)
  const { data: unreadCount = 0 } = useUnreadCount(userId)
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read_at) {
      await markReadMutation.mutateAsync(notification.id)
    }

    // Navigate to link
    if (notification.link) {
      router.push(notification.link)
    }

    setIsOpen(false)
  }

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(userId)
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      case 'application_status':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'gig_updated':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'new_application':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-[var(--danger)] text-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card-flat shadow-lg animate-fade-in-up z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="font-semibold">notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)]">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-sm">no notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors ${
                    !notification.read_at ? 'bg-[var(--accent-soft)]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      !notification.read_at ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-hover)] text-[var(--muted)]'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${!notification.read_at ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'}`}>
                        {notification.title}
                      </p>
                      {notification.body && (
                        <p className="text-xs text-[var(--muted-soft)] line-clamp-2 mt-0.5">
                          {notification.body}
                        </p>
                      )}
                      <p className="text-[10px] text-[var(--muted-soft)] mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read_at && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--accent)] mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
