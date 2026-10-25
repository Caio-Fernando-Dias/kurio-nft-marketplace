import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import type { NFTUpdatedEvent, OrderUpdatedEvent } from '../types/realtime'

export const activeIoClients: any[] = []

// Intercepts WebSocket connections matching the socket.io endpoint pattern
export const socketIoLink = ws.link(/^wss?:\/\/.*\/socket\.io\/.*/)

export const socketIoHandler = socketIoLink.addEventListener('connection', (connection: any) => {
  const io = toSocketIo(connection)
  activeIoClients.push(io)

  if (connection?.client?.addEventListener) {
    connection.client.addEventListener('close', () => {
      const idx = activeIoClients.indexOf(io)
      if (idx > -1) {
        activeIoClients.splice(idx, 1)
      }
    })
  }
})

export const emitSocketIOEvent = (
  event: 'nft.updated' | 'order.updated',
  data: NFTUpdatedEvent | OrderUpdatedEvent
) => {
  activeIoClients.forEach((io) => {
    try {
      io.client.emit(event, data)
    } catch (err) {
      console.warn('Failed to emit Socket.IO packet to client:', err)
    }
  })
}

// Global hook for manual testing and demonstration
if (typeof window !== 'undefined') {
  ;(window as any).__emitSocketEvent = emitSocketIOEvent
}
