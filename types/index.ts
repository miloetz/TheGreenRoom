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

export interface ProfileFilters {
  userType?: UserType
  search?: string              // name search (ilike)
  location?: string            // ilike
  genres?: string[]            // overlaps
  instruments?: string[]       // overlaps (musicians only)
  experienceMin?: number       // gte (musicians only)
  experienceMax?: number       // lte (musicians only)
  capacityMin?: number         // gte (venues only)
  capacityMax?: number         // lte (venues only)
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

// Notification Types
export type NotificationType = 'message' | 'application_status' | 'gig_updated' | 'new_application'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body?: string
  link?: string
  read_at?: string
  related_id?: string
  created_at: string
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

// Instrument options
export const INSTRUMENTS = [
  'Vocals',
  'Guitar',
  'Bass',
  'Drums',
  'Piano',
  'Keyboard',
  'Saxophone',
  'Trumpet',
  'Violin',
  'Cello',
  'Flute',
  'Harmonica',
  'Banjo',
  'Mandolin',
  'Ukulele',
  'DJ',
  'Producer',
  'Other',
] as const
