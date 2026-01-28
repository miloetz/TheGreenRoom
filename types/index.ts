// User & Profile Types
export type UserType = 'musician' | 'venue'

export interface Profile {
  id: string
  email: string
  name: string
  user_type: UserType
  bio?: string
  location?: string
  avatar_url?: string
  genres?: string[]
  venue_name?: string
  venue_address?: string
  venue_capacity?: number
  instruments?: string[]
  experience_years?: number
  created_at?: string
}

// Gig Types
export interface Gig {
  id: string
  venue_id: string
  title: string
  description: string
  date: string
  start_time: string
  end_time?: string
  location: string
  pay_min: number
  pay_max: number
  genres: string[]
  image_url?: string
  requirements?: string
  status: 'open' | 'closed' | 'filled'
  created_at?: string
  venue?: Profile
}

// Application Types
export interface Application {
  id: string
  gig_id: string
  musician_id: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at?: string
  gig?: Gig
  musician?: Profile
}

// Filter Types
export interface GigFilters {
  location?: string
  dateFrom?: string
  dateTo?: string
  genres?: string[]
  payMin?: number
  payMax?: number
}

// Conversation & Message Types
export interface Conversation {
  id: string
  gig_id?: string
  application_id?: string
  musician_id: string
  venue_id: string
  created_at: string
  updated_at: string
  gig?: Gig
  musician?: Profile
  venue?: Profile
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at?: string
  created_at: string
  sender?: Profile
}

// Genre options
export const GENRES = [
  'Rock',
  'Jazz',
  'Blues',
  'Pop',
  'Country',
  'Folk',
  'R&B',
  'Hip Hop',
  'Electronic',
  'Classical',
  'Metal',
  'Indie',
  'Funk',
  'Soul',
  'Reggae',
  'Latin',
  'World',
  'Acoustic',
  'Cover Band',
  'Original Music',
] as const
