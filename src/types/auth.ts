export interface User {
  id: string
  name: string
  email: string
  avatar: string
  walletAddress?: string
  bio?: string
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password?: string
}
