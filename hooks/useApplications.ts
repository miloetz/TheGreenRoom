import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplicationsByGig, getUserApplicationForGig } from '@/queries/applications'
import {
  createApplication,
  updateApplicationStatus,
  CreateApplicationInput,
} from '@/mutations/applications'
import { gigKeys } from './useGigs'

export const applicationKeys = {
  all: ['applications'] as const,
  byGig: (gigId: string) => [...applicationKeys.all, 'gig', gigId] as const,
  userApplication: (gigId: string, userId: string) =>
    [...applicationKeys.all, 'user', gigId, userId] as const,
}

export function useGigApplications(gigId: string) {
  return useQuery({
    queryKey: applicationKeys.byGig(gigId),
    queryFn: () => getApplicationsByGig(gigId),
    enabled: !!gigId,
  })
}

export function useUserApplication(gigId: string, userId: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.userApplication(gigId, userId || ''),
    queryFn: () => getUserApplicationForGig(gigId, userId!),
    enabled: !!gigId && !!userId,
  })
}

export function useApplyToGig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onSuccess: (_, { gig_id, musician_id }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.byGig(gig_id) })
      queryClient.invalidateQueries({
        queryKey: applicationKeys.userApplication(gig_id, musician_id),
      })
    },
  })
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string
      gigId: string
      status: 'accepted' | 'rejected'
    }) => updateApplicationStatus(applicationId, status),
    onSuccess: (_, { gigId }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.byGig(gigId) })
      queryClient.invalidateQueries({ queryKey: gigKeys.detail(gigId) })
    },
  })
}
