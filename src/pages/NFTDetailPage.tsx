import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { NFTDetailDesktop } from '../components/detail/NFTDetailDesktop'
import { NFTDetailMobile } from '../components/detail/NFTDetailMobile'
import { fetchNftById, fetchNfts } from '../services/api'
import type { NFT } from '../types/nft'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { NFTDetailSkeleton } from '../components/detail/NFTDetailSkeleton'

interface NFTDetailPageProps {
  id: string
}

export const NFTDetailPage: React.FC<NFTDetailPageProps> = ({ id }) => {
  // Scroll to top on mount or id change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Fetch the selected NFT
  const {
    data: nft,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['nft', id],
    queryFn: () => fetchNftById(id),
  })

  // Fetch related collection items
  const { data: relatedData } = useQuery({
    queryKey: ['nfts', 'related'],
    queryFn: () => fetchNfts({ limit: 8 }),
  })

  // Render shimmer skeleton during loading (Section 8 requirement)
  if (isLoading) {
    return <NFTDetailSkeleton />
  }

  // Render accessible error state if failed
  if (isError && !nft) {
    return (
      <div className="min-h-screen bg-[#140D0A] font-mono text-[#F5F1EB] flex flex-col justify-between">
        <div className="w-full max-w-[1200px] mx-auto pt-6 px-4">
          <Header initialActiveSection="mercado" />
          <div
            role="alert"
            className="w-full max-w-[600px] mx-auto mt-20 p-8 bg-[#241612] border border-[#3F2319] rounded-[8px] flex flex-col items-center text-center gap-4 shadow-xl"
          >
            <AlertCircle className="w-12 h-12 text-[#E89B55]" />
            <h2 className="text-xl font-bold text-[#F5F1EB]">Erro ao carregar detalhes do NFT</h2>
            <p className="text-sm text-[#CFB28C]">
              Não foi possível obter as informações do colecionável no momento. Verifique sua conexão ou tente novamente.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 flex items-center gap-2 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold px-5 py-2.5 rounded-[4px] cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto mt-20">
          <Footer />
        </div>
      </div>
    )
  }

  // Fallback Emerald Ape if mock missing
  const fallbackNft: NFT = {
    id: id || 'nft-1',
    title: 'Emerald Ape #042',
    collection: 'Arte digital',
    network: 'Ethereum',
    category: 'all',
    priceEth: '1.19',
    image: '/assets/image.png',
    isRare: false,
    isFavorite: false,
    availableQuantity: 5,
    creator: '0xStudio',
    description:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    listedAt: '2026-10-20T10:00:00Z',
  }

  const currentNft = nft || fallbackNft

  // Filter out the current item for related products
  const relatedNfts =
    relatedData?.items.filter((item) => item.id !== currentNft.id) || [
      {
        id: 'nft-4',
        title: 'Cosmic Bloom #118',
        collection: 'Fotografia',
        network: 'Ethereum',
        category: 'new',
        priceEth: '1.29',
        image: '/assets/image2.png',
        availableQuantity: 8,
        creator: 'WandererLab',
        description: 'Edição limitada em tonalidade lilás e olhar sereno.',
        listedAt: '2026-10-23T09:00:00Z',
      },
      {
        id: 'nft-5',
        title: 'Violet Nomad #314',
        collection: 'Colecionáveis',
        network: 'Solana',
        category: 'all',
        priceEth: '1.39',
        image: '/assets/image2.png',
        availableQuantity: 4,
        creator: 'WandererLab',
        description: 'Colecionável estilizado da série nômade.',
        listedAt: '2026-10-18T16:20:00Z',
      },
      {
        id: 'nft-6',
        title: 'Ivory Baron #088',
        collection: 'Arte 3D',
        network: 'Ethereum',
        category: 'trending',
        priceEth: '1.79',
        image: '/assets/image3.png',
        availableQuantity: 6,
        creator: 'CyberMonks',
        description: 'Aristocrata digital com brinco dourado e postura refinada.',
        listedAt: '2026-10-19T11:45:00Z',
      },
      {
        id: 'nft-7',
        title: 'Golden Beat #207',
        collection: 'Música',
        network: 'Polygon',
        category: 'all',
        priceEth: '0.99',
        image: '/assets/image4.png',
        availableQuantity: 10,
        creator: 'AudioApes',
        description: 'Fones de alta fidelidade e vibrações sonoras douradas.',
        listedAt: '2026-10-17T20:10:00Z',
      },
      {
        id: 'nft-9',
        title: 'Golden Signal #160',
        collection: 'Música',
        network: 'Solana',
        category: 'trending',
        priceEth: '0.39',
        image: '/assets/image4.png',
        availableQuantity: 7,
        creator: 'AudioApes',
        description: 'Transmissão com sorriso radiante e jaqueta bege.',
        listedAt: '2026-10-23T12:00:00Z',
      },
    ]

  return (
    <div className="min-h-screen bg-[#140D0A] font-mono text-[#F5F1EB] flex flex-col">
      {/* 
        DESKTOP VIEW (hidden on mobile, visible on md and up)
        Matching Desktop_Detalhes_do_NFT.css:
        - Consistent 1200px width centered layout across Header, Main and Footer
      */}
      <div className="hidden md:flex flex-col items-center w-full">
        {/* Top Header Row with 'Mercado' active tab */}
        <div className="w-full max-w-[1200px] mx-auto pt-6">
          <Header initialActiveSection="mercado" />
        </div>

        {/* Content Container (1200px) */}
        <main className="w-full max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="w-8 h-8 text-[#D28A4C] animate-spin" />
              <span className="text-sm text-[#CFB28C]">Carregando detalhes do NFT...</span>
            </div>
          ) : isError ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-4 bg-[#241612] rounded-2xl p-8 border border-[#3F2319] my-12">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <h2 className="text-lg font-bold text-[#F5F1EB]">Erro ao carregar detalhes</h2>
              <p className="text-sm text-[#CFB28C]">Não foi possível encontrar este NFT.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <NFTDetailDesktop nft={currentNft} relatedNfts={relatedNfts} />
          )}
        </main>

        {/* Footer 1200px wide */}
        <div className="w-full max-w-[1200px] mx-auto">
          <Footer />
        </div>
      </div>

      {/* 
        MOBILE VIEW (visible on mobile < 768px, hidden on md and up)
        Matching Mobile_Detalhes_do_NFT.css:
        - 414px layout, hero gradient, details sheet, fixed buy bar
      */}
      <div className="block md:hidden w-full">
        <main className="w-full">
          {isLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="w-8 h-8 text-[#D28A4C] animate-spin" />
              <span className="text-sm text-[#CFB28C]">Carregando detalhes do NFT...</span>
            </div>
          ) : isError ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-4 bg-[#241612] rounded-2xl p-8 border border-[#3F2319] my-12 mx-4">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <h2 className="text-lg font-bold text-[#F5F1EB]">NFT não encontrado</h2>
              <p className="text-sm text-[#CFB28C]">Não foi possível encontrar este NFT ou edição.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <NFTDetailMobile nft={currentNft} />
          )}
        </main>
      </div>
    </div>
  )
}
