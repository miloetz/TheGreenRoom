import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfileById, getCurrentUser, getProfiles } from '@/queries/profiles'
import { updateProfile, UpdateProfileInput } from '@/mutations/profiles'
import { ProfileFilters } from '@/types'

export const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (filters: ProfileFilters) => [...profileKeys.lists(), filters] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  currentUser: () => [...profileKeys.all, 'currentUser'] as const,
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => getProfileById(id),
    enabled: !!id,
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: profileKeys.currentUser(),
    queryFn: getCurrentUser,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateProfileInput }) =>
      updateProfile(userId, input),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) })
      queryClient.invalidateQueries({ queryKey: profileKeys.currentUser() })
    },
  })
}

export function useProfiles(filters: ProfileFilters = {}) {
  return useQuery({
    queryKey: profileKeys.list(filters),
    queryFn: () => getProfiles(filters),
  })
}
