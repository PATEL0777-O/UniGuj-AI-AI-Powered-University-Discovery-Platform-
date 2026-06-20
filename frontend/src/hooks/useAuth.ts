import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setTokens, logout, setLoading } = useAuthStore()

  const register = async (data: { email: string; password: string; name: string }) => {
    setLoading(true)
    try {
      const response = await authApi.register(data)
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      await fetchUser()
      toast.success('Account created successfully!')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: { email: string; password: string }) => {
    setLoading(true)
    try {
      const response = await authApi.login(data)
      const { access_token, refresh_token } = response.data
      setTokens(access_token, refresh_token)
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      await fetchUser()
      toast.success('Welcome back!')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await authApi.me()
      setUser(response.data)
    } catch {
      logout()
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    toast.success('Logged out successfully')
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !user) {
      fetchUser()
    }
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading: useAuthStore((state) => state.isLoading),
    register,
    login,
    logout: handleLogout,
    fetchUser,
  }
}
