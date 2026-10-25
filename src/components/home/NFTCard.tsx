import React from 'react'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { NFT, NFTListResponse } from '../../types/nft'
import { toggleFavoriteNft } from '../../services/api'

interface NFTCardProps {
  nft: NFT
  onSelect?: (id: string) => void
  isMobile?: boolean
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onSelect, isMobile }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Optimistic update for favorite toggling with rollback
  const favoriteMutation = useMutation({
    mutationFn: (id: string) => toggleFavoriteNft(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['nfts'] })

      const previousQueries = queryClient.getQueriesData<NFTListResponse>({
        queryKey: ['nfts'],
      })

      queryClient.setQueriesData<NFTListResponse>(
        { queryKey: ['nfts'] },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            ),
          }
        }
      )

      return { previousQueries }
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
  })

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoriteMutation.mutate(nft.id)
  }

  // Mobile layout matching Mobile_Inicio.css & Mobile_Inicio.png
  if (isMobile) {
    return (
      <article
        onClick={() => {
          if (onSelect) {
            onSelect(nft.id)
          } else {
            navigate({ to: `/nft/${nft.id}` as any })
          }
        }}
        className="group flex flex-col cursor-pointer font-mono w-[175px] shrink-0"
      >
        {/* Card Body: 175x200px, rounded-[20px], gradient */}
        <div
          className="relative w-[175px] h-[200px] rounded-[20px] p-[3px] flex items-center justify-center border border-[#3F2319]/40 shadow-lg overflow-hidden"
          style={{
            background: 'linear-gradient(143.28deg, #241612 -12%, #2F1D15 106.59%)',
          }}
        >
          {/* Inner Artwork: 168x168px with rounded-[16px] */}
          <div className="w-[168px] h-[168px] rounded-[16px] overflow-hidden bg-[#140D0A] relative">
            <img
              src={nft.image}
              alt={nft.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* RARE badge: matching Figma */}
            {nft.isRare && (
              <Badge
                variant="rare"
                className="absolute top-2 left-0 px-2.5 py-1 text-[13px] leading-[16px] rounded-l-none rounded-r-md"
              >
                RARO
              </Badge>
            )}

            {/* Favorite button: 28x28px circular button at top right */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={nft.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className="absolute top-2 right-2 w-[28px] h-[28px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center cursor-pointer shadow-md active:scale-95 transition-transform"
            >
              <Heart
                className={`w-[15px] h-[15px] text-[#D28A4C] transition-transform duration-200 ${
                  nft.isFavorite ? 'fill-[#D28A4C]' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info below card matching Figma Frame 413 */}
        <div className="pt-2 px-1 flex flex-col gap-0.5 w-full">
          <h3 className="text-[#F5F1EB] font-normal text-[15px] leading-[20px] truncate group-hover:text-[#E89B55] transition-colors">
            {nft.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[#E89B55] font-bold text-[16px] leading-[16px]">
              {nft.priceEth} ETH
            </span>
            {nft.originalPriceEth && (
              <span className="text-[#B39463] text-[13px] leading-[16px] font-normal line-through">
                {nft.originalPriceEth} ETH
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      onClick={() => {
        if (onSelect) {
          onSelect(nft.id)
        } else {
          navigate({ to: `/nft/${nft.id}` as any })
        }
      }}
      className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 font-mono w-full"
    >
      {/* 
        Card Body:
        O fundo (#241612) NÃO deve ter bordas arredondadas (rounded-none)
      */}
      <div className="relative w-full h-[200px] sm:h-[260px] md:h-[300px] bg-[#241612] rounded-none p-2 sm:p-2.5 md:p-3 flex items-center justify-center border border-[#3F2319]/40 shadow-lg">
        {/* Inner Artwork */}
        <div className="w-full h-full rounded-[8px] md:rounded-[15px] overflow-hidden bg-[#140D0A] relative">
          <img
            src={nft.image}
            alt={nft.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* RARE badge matching Figma */}
          {nft.isRare && (
            <Badge
              variant="rare"
              className="absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-[4px]"
            >
              RARO
            </Badge>
          )}

          {/* Favorite heart button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={nft.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 backdrop-blur-md ${
              nft.isFavorite
                ? 'bg-[#D28A4C] text-[#140D0A] shadow-md'
                : 'bg-[#140D0A]/60 text-[#F5F1EB]/80 hover:text-white hover:bg-[#140D0A]/90'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                nft.isFavorite ? 'fill-current scale-110' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info: Title (16px regular #F5F1EB) & Price (18px bold #E89B55) */}
      <div className="pt-2 md:pt-3 flex flex-col gap-1 w-full">
        <h3 className="text-[#F5F1EB] font-normal text-[12px] md:text-[16px] leading-[16px] truncate group-hover:text-[#E89B55] transition-colors">
          {nft.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-[#E89B55] font-bold text-[12px] md:text-[18px] leading-[16px]">
            {nft.priceEth} ETH
          </span>
          {nft.originalPriceEth && (
            <span className="text-[#B39463] text-[11px] md:text-[18px] leading-[16px] font-normal line-through">
              {nft.originalPriceEth} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
