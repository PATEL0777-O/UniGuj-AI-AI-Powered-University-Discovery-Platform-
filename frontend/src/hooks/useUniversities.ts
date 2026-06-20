import { useQuery } from '@tanstack/react-query'
import { universityApi } from '@/services/api'
import { University } from '@/types'

export const useUniversities = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['universities', params],
    queryFn: async () => {
      const response = await universityApi.getAll(params)
      return response.data as University[]
    },
  })
}

export const useUniversity = (id: string) => {
  return useQuery({
    queryKey: ['university', id],
    queryFn: async () => {
      const response = await universityApi.getById(id)
      return response.data as University
    },
    enabled: !!id,
  })
}

export const useTopUniversities = (limit = 10) => {
  return useQuery({
    queryKey: ['top-universities', limit],
    queryFn: async () => {
      const response = await universityApi.getTop(limit)
      return response.data as University[]
    },
  })
}

export const useSearchUniversities = (query: string) => {
  return useQuery({
    queryKey: ['university-search', query],
    queryFn: async () => {
      const response = await universityApi.search(query)
      return response.data as University[]
    },
    enabled: query.length > 2,
  })
}
