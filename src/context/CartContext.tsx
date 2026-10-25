import React, { createContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateCartQuantity,
  removeFromCart as apiRemoveFromCart,
} from '../services/api'
import type { CartResponse } from '../types/cart'

interface CartContextValue {
  cart: CartResponse | undefined
  count: number
  isLoading: boolean
  addItem: (id: string, quantity?: number) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const addMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity?: number }) =>
      apiAddToCart(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiUpdateCartQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiRemoveFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const addItem = async (id: string, quantity = 1) => {
    await addMutation.mutateAsync({ id, quantity })
  }

  const updateQuantity = async (id: string, quantity: number) => {
    await updateMutation.mutateAsync({ id, quantity })
  }

  const removeItem = async (id: string) => {
    await removeMutation.mutateAsync(id)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        count: cart?.count ?? 0,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export { CartContext }
