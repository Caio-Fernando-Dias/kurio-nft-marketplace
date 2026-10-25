import React, { createContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSession, login as apiLogin, logout as apiLogout, registerUser as apiRegister } from '../services/api'
import type { User, LoginCredentials } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: { username?: string; email: string; password?: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()

  const { data: session, isLoading } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiLogin(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'session'], data)
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: (credentials: { username?: string; email: string; password?: string }) =>
      apiRegister(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'session'], data)
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      // Clear all private cached queries and set session to empty
      queryClient.clear()
      queryClient.setQueryData(['auth', 'session'], { user: null, isAuthenticated: false })
    },
  })

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials)
  }

  const register = async (credentials: { username?: string; email: string; password?: string }) => {
    await registerMutation.mutateAsync(credentials)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isAuthenticated: !!session?.isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
