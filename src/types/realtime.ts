export interface NFTUpdatedEvent {
  resource: 'nft'
  nftId: string
  priceEth: string
  oldPriceEth?: string
  title?: string
  availableQuantity: number
  version: number
  updatedAt: string
}

export interface OrderUpdatedEvent {
  resource: 'order'
  orderId: string
  userId?: string
  status: 'pending' | 'confirmed' | 'rejected'
  version: number
  updatedAt: string
}
