import { useRealtime } from '../context/RealtimeContext'

/**
 * Hook providing access to realtime events and status.
 * Backed by RealtimeProvider to prevent duplicate socket listeners.
 */
export const useNFTRealtime = () => {
  return useRealtime()
}
