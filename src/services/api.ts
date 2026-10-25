import axios from 'axios'
import type { NFT, NFTFilters, NFTListResponse } from '../types/nft'
import type { AuthSession, LoginCredentials, User } from '../types/auth'
import type { CartResponse } from '../types/cart'

export const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// NFTs API
export const fetchNfts = async (filters: NFTFilters = {}): Promise<NFTListResponse> => {
  const params = new URLSearchParams()
  if (filters.search) params.append('search', filters.search)
  if (filters.collection) params.append('collection', filters.collection)
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
  if (filters.network) params.append('network', filters.network)
  if (filters.category) params.append('category', filters.category)
  if (filters.sort) params.append('sort', filters.sort)
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())

  const response = await api.get<NFTListResponse>(`/api/nfts?${params.toString()}`)
  return response.data
}

export const fetchNftById = async (id: string): Promise<NFT> => {
  const response = await api.get<NFT>(`/api/nfts/${id}`)
  return response.data
}

export const fetchFavorites = async (): Promise<{ favorites: string[]; count: number; items: NFT[] }> => {
  const response = await api.get<{ favorites: string[]; count: number; items: NFT[] }>('/api/favorites')
  return response.data
}

export const toggleFavoriteNft = async (id: string): Promise<{ id: string; isFavorite: boolean }> => {
  const response = await api.post<{ id: string; isFavorite: boolean }>(`/api/favorites/${id}`)
  return response.data
}

export const removeFavorite = async (id: string): Promise<{ id: string; isFavorite: boolean }> => {
  const response = await api.delete<{ id: string; isFavorite: boolean }>(`/api/favorites/${id}`)
  return response.data
}

// Cart API
export const fetchCart = async (): Promise<CartResponse> => {
  const response = await api.get<CartResponse>('/api/cart')
  return response.data
}

export const addToCart = async (id: string, quantity = 1): Promise<{ success: boolean; count: number }> => {
  const response = await api.post<{ success: boolean; count: number }>('/api/cart', { id, quantity })
  return response.data
}

export const updateCartQuantity = async (id: string, quantity: number): Promise<{ success: boolean; count: number }> => {
  const response = await api.put<{ success: boolean; count: number }>(`/api/cart/${id}`, { quantity })
  return response.data
}

export const removeFromCart = async (id: string): Promise<{ success: boolean; count: number }> => {
  const response = await api.delete<{ success: boolean; count: number }>(`/api/cart/${id}`)
  return response.data
}


// Auth API
export const fetchSession = async (): Promise<AuthSession> => {
  const response = await api.get<AuthSession>('/api/auth/session')
  return response.data
}

export const login = async (credentials: LoginCredentials): Promise<AuthSession> => {
  const response = await api.post<AuthSession>('/api/auth/login', credentials)
  return response.data
}

export const registerUser = async (credentials: { username?: string; email: string; password?: string }): Promise<AuthSession> => {
  const response = await api.post<AuthSession>('/api/auth/register', credentials)
  return response.data
}

export const logout = async (): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>('/api/auth/logout')
  return response.data
}

export const expireSession = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/api/auth/expire')
  return response.data
}

// Orders API
export interface OrderPayload {
  subtotalEth: string
  discountEth?: string
  networkFeeEth: string
  totalEth: string
  walletName?: string
  simulateRefusal?: boolean
}

export interface OrderResponse {
  orderId: string
  transactionId: string
  status: 'confirmed' | 'rejected'
  items: any[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  date: string
  walletName: string
  createdAt: string
}

export const createOrder = async (payload: OrderPayload, idempotencyKey?: string): Promise<OrderResponse> => {
  const headers: Record<string, string> = {}
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey
  }
  const response = await api.post<OrderResponse>('/api/orders', payload, { headers })
  return response.data
}

export const fetchOrderById = async (id: string): Promise<OrderResponse> => {
  const response = await api.get<OrderResponse>(`/api/orders/${id}`)
  return response.data
}

// Quote & Coupon API
export const validateCoupon = async (code: string): Promise<{ valid: boolean; discountEth?: string; error?: string }> => {
  const response = await api.post<{ valid: boolean; discountEth?: string; error?: string }>('/api/quote', { code })
  return response.data
}

// Profile API
export const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; profile: User }> => {
  const response = await api.put<{ success: boolean; profile: User }>('/api/profile', updates)
  return response.data
}

export const changePassword = async (passwords: { currentPassword?: string; newPassword?: string }): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/api/profile/password', passwords)
  return response.data
}

// Wallets API
export const fetchWallets = async (): Promise<{ wallets: any }> => {
  const response = await api.get<{ wallets: any }>('/api/wallets')
  return response.data
}

export const saveWallets = async (wallets: any): Promise<{ success: boolean; wallets: any }> => {
  const response = await api.post<{ success: boolean; wallets: any }>('/api/wallets', wallets)
  return response.data
}

// Reset scenario
export const resetScenario = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/api/reset')
  return response.data
}
