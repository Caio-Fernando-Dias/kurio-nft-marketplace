import type { NFT } from './nft'

export interface CartItem {
  id: string
  nft: NFT
  quantity: number
  priceEth: string
  tokenId?: string
  edition?: string
}

export interface CartResponse {
  items: CartItem[]
  count: number
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
}
