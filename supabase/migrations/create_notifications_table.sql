-- Create notifications table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,  -- 'message', 'application_status', 'gig_updated', 'new_application'
  title text NOT NULL,
  body text,
  link text,           -- URL to navigate to on click
  read_at timestamptz,
  related_id uuid,     -- gig_id, application_id, or conversation_id
  created_at timestamptz DEFAULT now()
);

-- Index for efficient queries on user_id and read status
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);

-- Index for efficient queries by created_at for ordering
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (for marking as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Allow insert from authenticated users (for creating notifications)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
