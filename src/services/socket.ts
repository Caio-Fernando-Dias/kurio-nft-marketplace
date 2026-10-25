import { io, Socket } from 'socket.io-client'
import type { NFTUpdatedEvent, OrderUpdatedEvent } from '../types/realtime'
import { updateNFTRealtime, updateOrderRealtime } from '../mocks/handlers'

// Connects to origin over websocket protocol for MSW socket.io-binding interception
const SOCKET_URL =
  typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    : 'ws://localhost:5173'

let socketInstance: Socket | null = null

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })
  }
  return socketInstance
}

// Dispatches realistic socket.io events across the network layer
export const simulateNFTUpdate = (
  event: Partial<NFTUpdatedEvent> & { nftId: string; priceEth: string }
) => {
  const fullEvent: NFTUpdatedEvent = {
    resource: 'nft',
    nftId: event.nftId,
    priceEth: event.priceEth,
    oldPriceEth: event.oldPriceEth,
    title: event.title,
    availableQuantity: event.availableQuantity ?? 4,
    version: event.version ?? Date.now(),
    updatedAt: event.updatedAt ?? new Date().toISOString(),
  }
  updateNFTRealtime(fullEvent)
}

export const simulateOrderUpdate = (
  event: Partial<OrderUpdatedEvent> & { orderId: string; status: 'pending' | 'confirmed' | 'rejected' }
) => {
  const fullEvent: OrderUpdatedEvent = {
    resource: 'order',
    orderId: event.orderId,
    userId: event.userId,
    status: event.status,
    version: event.version ?? Date.now(),
    updatedAt: event.updatedAt ?? new Date().toISOString(),
  }
  updateOrderRealtime(fullEvent)
}

