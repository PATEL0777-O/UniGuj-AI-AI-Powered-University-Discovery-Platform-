import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
  me: () => api.get('/auth/me'),
}

// Universities API
export const universityApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/universities/', { params }),
  getById: (id: string) => api.get(`/universities/${id}`),
  search: (q: string) => api.get('/universities/search', { params: { q } }),
  getTop: (limit?: number) => api.get('/universities/top', { params: { limit } }),
}

// Compare API
export const compareApi = {
  compare: (universityIds: string[]) =>
    api.post('/compare/', { university_ids: universityIds }),
}

// Scholarships API
export const scholarshipApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/scholarships/', { params }),
  checkEligibility: (params: Record<string, any>) =>
    api.get('/scholarships/eligible', { params }),
  getById: (id: string) => api.get(`/scholarships/${id}`),
}

// Placements API
export const placementApi = {
  getAll: (params?: Record<string, any>) =>
    api.get('/placements/', { params }),
  getStats: () => api.get('/placements/stats'),
  getTrends: () => api.get('/placements/trends'),
}

// AI Chat API
export const chatApi = {
  sendMessage: (data: { query: string; conversation_id?: string }) =>
    api.post('/ai/chat/json', data),
  streamMessage: (data: { query: string; conversation_id?: string }) => {
    return fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
      body: JSON.stringify(data),
    })
  },
}

// Recommendations API
export const recommendationApi = {
  getRecommendations: (data: {
    education: string;
    interests: string[];
    skills: string[];
    budget_max: number;
    preferred_location?: string;
    preferred_course?: string;
  }) => api.post('/recommendations/', data),
}
