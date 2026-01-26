import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOpenGigs, getGigById, getGigsByVenue } from '@/queries/gigs'
import { createGig, updateGigStatus, CreateGigInput } from '@/mutations/gigs'
import { GigFilters } from '@/types'

export const gigKeys = {
  all: ['gigs'] as const,
  lists: () => [...gigKeys.all, 'list'] as const,
  list: (filters: GigFilters) => [...gigKeys.lists(), filters] as const,
  details: () => [...gigKeys.all, 'detail'] as const,
  detail: (id: string) => [...gigKeys.details(), id] as const,
  byVenue: (venueId: string) => [...gigKeys.all, 'venue', venueId] as const,
}

export function useGigs(filters: GigFilters = {}) {
  return useQuery({
    queryKey: gigKeys.list(filters),
    queryFn: () => getOpenGigs(filters),
  })
}

export function useGig(id: string) {
  return useQuery({
    queryKey: gigKeys.detail(id),
    queryFn: () => getGigById(id),
    enabled: !!id,
  })
}

export function useVenueGigs(venueId: string) {
  return useQuery({
    queryKey: gigKeys.byVenue(venueId),
    queryFn: () => getGigsByVenue(venueId),
    enabled: !!venueId,
  })
}

export function useCreateGig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateGigInput) => createGig(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gigKeys.all })
    },
  })
}

export function useUpdateGigStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gigId, status }: { gigId: string; status: 'open' | 'closed' | 'filled' }) =>
      updateGigStatus(gigId, status),
    onSuccess: (_, { gigId }) => {
      queryClient.invalidateQueries({ queryKey: gigKeys.detail(gigId) })
      queryClient.invalidateQueries({ queryKey: gigKeys.lists() })
    },
  })
}
