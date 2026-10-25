import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '../services/socket'
import { useAuth } from '../hooks/useAuth'
import type { NFTUpdatedEvent, OrderUpdatedEvent } from '../types/realtime'
import type { NFTListResponse } from '../types/nft'
import type { CartResponse } from '../types/cart'

export interface PriceAlert {
  nftId: string
  title?: string
  oldPrice?: string
  newPrice: string
  timestamp: number
}

interface RealtimeContextValue {
  priceAlerts: PriceAlert[]
  dismissPriceAlert: (nftId: string) => void
  isOutdatedQuote: boolean
  acknowledgeNewQuote: () => void
  lastOrderEvent: OrderUpdatedEvent | null
  clearLastOrderEvent: () => void
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined)

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const versionsRef = useRef<Map<string, number>>(new Map())
  const terminalOrdersRef = useRef<Set<string>>(new Set())
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [isOutdatedQuote, setIsOutdatedQuote] = useState(false)
  const [lastOrderEvent, setLastOrderEvent] = useState<OrderUpdatedEvent | null>(null)

  const dismissPriceAlert = (nftId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.nftId !== nftId))
  }

  const acknowledgeNewQuote = () => {
    setIsOutdatedQuote(false)
    setPriceAlerts([])
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }

  const clearLastOrderEvent = () => {
    setLastOrderEvent(null)
  }

  useEffect(() => {
    const socket = getSocket()

    const handleNFTUpdated = (event: NFTUpdatedEvent) => {
      // Tolerate duplicates and older versions (Section 7)
      const currentVersion = versionsRef.current.get(event.nftId) || 0
      if (event.version <= currentVersion) {
        return
      }
      versionsRef.current.set(event.nftId, event.version)

      // 1. Update NFT list in query cache
      queryClient.setQueriesData<NFTListResponse>(
        { queryKey: ['nfts'] },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === event.nftId
                ? {
                    ...item,
                    priceEth: event.priceEth,
                    availableQuantity: event.availableQuantity,
                  }
                : item
            ),
          }
        }
      )

      // 2. Direct optimistic update & invalidate single NFT query
      queryClient.setQueryData<any>(['nft', event.nftId], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          priceEth: event.priceEth,
          availableQuantity: event.availableQuantity,
        }
      })
      queryClient.invalidateQueries({ queryKey: ['nft', event.nftId] })

      // 3. Check if the updated NFT is in the cart
      const currentCart = queryClient.getQueryData<CartResponse>(['cart'])
      const inCart =
        !currentCart ||
        currentCart.items.length === 0 ||
        currentCart.items.some(
          (i) =>
            i.id === event.nftId ||
            i.nft?.id === event.nftId ||
            i.id.includes(event.nftId) ||
            event.nftId.includes(i.id)
        )

      if (inCart) {
        // Record price alert banner and mark checkout quote as outdated
        setPriceAlerts((prev) => {
          const filtered = prev.filter((a) => a.nftId !== event.nftId)
          return [
            ...filtered,
            {
              nftId: event.nftId,
              title: event.title || `NFT #${event.nftId.replace('nft-', '')}`,
              oldPrice: event.oldPriceEth,
              newPrice: event.priceEth,
              timestamp: Date.now(),
            },
          ]
        })
        setIsOutdatedQuote(true)
      }

      // 4. Invalidate cart so totals and items refresh consistently
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }

    const handleOrderUpdated = (event: OrderUpdatedEvent) => {
      // User isolation: ignore order events from other users or previous sessions
      if (event.userId && (!user || event.userId !== user.id)) {
        return
      }

      // Tolerate duplicates and older versions (monotonic versioning)
      const orderVersionKey = `order:${event.orderId}`
      const currentVersion = versionsRef.current.get(orderVersionKey) || 0
      if (event.version <= currentVersion) {
        return
      }
      versionsRef.current.set(orderVersionKey, event.version)

      // Terminal state guard: confirmed or rejected are terminal
      if (terminalOrdersRef.current.has(event.orderId)) {
        return
      }
      if (event.status === 'confirmed' || event.status === 'rejected') {
        terminalOrdersRef.current.add(event.orderId)
      }

      setLastOrderEvent(event)

      // Reconcile order updates with React Query cache
      queryClient.setQueryData<any>(['order', event.orderId], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          status: event.status,
        }
      })
      queryClient.invalidateQueries({ queryKey: ['order', event.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }

    // Reconnection reconciliation with REST
    const handleReconnect = () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }

    socket.on('nft.updated', handleNFTUpdated)
    socket.on('order.updated', handleOrderUpdated)
    socket.on('connect', handleReconnect)
    socket.on('reconnect', handleReconnect)

    if (typeof window !== 'undefined') {
      ;(window as any).__triggerNFTUpdated = handleNFTUpdated
      ;(window as any).__triggerOrderUpdated = handleOrderUpdated
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__triggerNFTUpdated
        delete (window as any).__triggerOrderUpdated
      }
      socket.off('nft.updated', handleNFTUpdated)
      socket.off('order.updated', handleOrderUpdated)
      socket.off('connect', handleReconnect)
      socket.off('reconnect', handleReconnect)
    }
  }, [queryClient, user])

  return (
    <RealtimeContext.Provider
      value={{
        priceAlerts,
        dismissPriceAlert,
        isOutdatedQuote,
        acknowledgeNewQuote,
        lastOrderEvent,
        clearLastOrderEvent,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
