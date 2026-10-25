export type NFTNetwork = 'Ethereum' | 'Polygon' | 'Solana'

export type NFTCategoryTab = 'all' | 'new' | 'trending'

export type NFTCollection =
  | 'Arte digital'
  | 'Fotografia'
  | 'Música'
  | 'Arte 3D'
  | 'Colecionáveis'
  | 'Generativa'
  | 'Jogos'
  | 'Assinaturas'
  | 'Utilidade'

export interface NFT {
  id: string
  title: string
  collection: NFTCollection
  network: NFTNetwork
  category: NFTCategoryTab
  priceEth: string // Decimal string as required by README
  originalPriceEth?: string
  image: string
  isRare?: boolean
  isFavorite?: boolean
  availableQuantity: number
  creator: string
  creatorAvatar?: string
  description: string
  listedAt: string
}

export interface NFTFilters {
  search?: string
  collection?: string
  minPrice?: number
  maxPrice?: number
  network?: string
  category?: NFTCategoryTab
  sort?: 'recent' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}

export interface NFTListResponse {
  items: NFT[]
  total: number
  page: number
  totalPages: number
  limit: number
  counts: {
    collections: Record<string, number>
    networks: Record<string, number>
  }
}
