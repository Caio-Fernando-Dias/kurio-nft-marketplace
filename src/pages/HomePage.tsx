import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'
import { fetchNfts } from '../services/api'
import { useNFTRealtime } from '../hooks/useNFTRealtime'
import type { NFTFilters, NFTCategoryTab } from '../types/nft'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Header } from '../components/layout/Header'
import { HeroSection } from '../components/home/HeroSection'
import { CategoryTabs } from '../components/home/CategoryTabs'
import { SidebarFilters } from '../components/home/SidebarFilters'
import { MobileFilterDrawer } from '../components/home/MobileFilterDrawer'
import { NFTCard } from '../components/home/NFTCard'
import { NFTCardSkeleton } from '../components/home/NFTCardSkeleton'
import { Pagination } from '../components/home/Pagination'
import { PromoBanners } from '../components/home/PromoBanners'
import { MintDiary } from '../components/home/MintDiary'
import { Footer } from '../components/layout/Footer'
import { MobileBottomNav } from '../components/layout/MobileBottomNav'

interface HomePageProps {
  filters: NFTFilters
  onFilterChange: (newFilters: Partial<NFTFilters>) => void
}

export const HomePage: React.FC<HomePageProps> = ({ filters, onFilterChange }) => {
  useNFTRealtime()

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['nfts', filters],
    queryFn: () => fetchNfts({ limit: 9, ...filters }),
    staleTime: 1000 * 30,
  })

  const handleSearchChange = (search: string) => {
    onFilterChange({ search: search || undefined, page: 1 })
  }

  const handleCategoryChange = (category: NFTCategoryTab) => {
    onFilterChange({ category, page: 1 })
  }

  const handleCollectionChange = (collection?: string) => {
    onFilterChange({ collection, page: 1 })
  }

  const handleNetworkChange = (network?: string) => {
    onFilterChange({ network, page: 1 })
  }

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({ minPrice: min, maxPrice: max, page: 1 })
  }

  const handleSortChange = (sort: 'recent' | 'price_asc' | 'price_desc') => {
    onFilterChange({ sort, page: 1 })
  }

  const handlePageChange = (page: number) => {
    onFilterChange({ page })
    const catalogEl = document.getElementById('catalogo')
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClearFilters = () => {
    onFilterChange({
      search: undefined,
      collection: undefined,
      network: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      category: 'all',
      sort: 'recent',
      page: 1,
    })
    setIsMobileFiltersOpen(false)
  }

  const sortLabels: Record<string, string> = {
    recent: 'Listados recentemente',
    price_asc: 'Menor preço',
    price_desc: 'Maior preço',
  }

  const currentSort = filters.sort || 'recent'

  return (
    <main id="main-content" className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col items-center">
      {/* 
        Desktop / Início (Figma: width 1440px, padding: 24px 120px, gap: 96px)
        Mobile / Início (Figma: width 414px, padding: 40px 24px 0px, gap: 16px)
      */}
      <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[120px] pt-10 pb-28 md:py-[24px] flex flex-col gap-4 md:gap-16 lg:gap-[96px]">
        {/* Top: Navbar + Hero (1200px wide, gap: 16px on mobile, 32px on desktop) */}
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 md:gap-[32px]">
          <Header
            searchQuery={filters.search || ''}
            onSearchChange={handleSearchChange}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
          />

          <HeroSection
            onExploreClick={() => {
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </div>

        {/* 
          Main Catalog & Sidebar:
          Figma: width 1200px, gap: 48px
          Left: 310px (Sidebar)
          Right: flex-1 (Product Grid)
        */}
        <section
          id="catalogo"
          aria-label="Catálogo de NFTs"
          className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-4 md:gap-8 lg:gap-[48px]"
        >
          {/* Left Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-[310px] shrink-0 sticky top-6">
            <SidebarFilters
              selectedCollection={filters.collection}
              onCollectionChange={handleCollectionChange}
              selectedNetwork={filters.network}
              onNetworkChange={handleNetworkChange}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onPriceChange={handlePriceChange}
              counts={data?.counts}
            />
          </div>

          {/* Right Column: Catalog Grid (fluidly fills remaining space up to 842px) */}
          <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4 md:gap-[32px]">
            {/* Toolbar: Category Tabs + Sort Aligned */}
            <div className="flex items-center justify-between gap-4 pb-0 md:pb-2 md:border-b md:border-[#3F2319]/40">
              <CategoryTabs
                activeTab={filters.category || 'all'}
                onTabChange={handleCategoryChange}
              />

              {/* Minimal inline sort selector - Desktop only using DropdownMenu */}
              <div className="hidden md:flex relative self-end sm:self-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs sm:text-[15px] leading-[20px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer py-1 select-none"
                    >
                      <span className="text-[#F5F1EB]">Ordenar por:</span>
                      <span className="font-medium text-[#F5F1EB]">{sortLabels[currentSort]}</span>
                      <ChevronDown className="w-4 h-4 ml-0.5 text-[#F5F1EB]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#241612] border border-[#3F2319] p-1 font-mono">
                    <DropdownMenuItem
                      onClick={() => handleSortChange('recent')}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        currentSort === 'recent'
                          ? 'bg-[#D28A4C] text-[#140D0A] font-bold'
                          : 'text-[#F5F1EB] hover:bg-[#38220F]'
                      }`}
                    >
                      Listados recentemente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange('price_asc')}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        currentSort === 'price_asc'
                          ? 'bg-[#D28A4C] text-[#140D0A] font-bold'
                          : 'text-[#F5F1EB] hover:bg-[#38220F]'
                      }`}
                    >
                      Menor preço
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange('price_desc')}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        currentSort === 'price_desc'
                          ? 'bg-[#D28A4C] text-[#140D0A] font-bold'
                          : 'text-[#F5F1EB] hover:bg-[#38220F]'
                      }`}
                    >
                      Maior preço
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Barra de Filtros Ativos (Coleções, Preço, Rede, Busca) */}
            {(filters.collection || filters.network || filters.maxPrice !== undefined || filters.search) && (
              <div className="flex flex-wrap items-center gap-2 -mt-2 pb-2 text-xs">
                <span className="text-[#CFB28C] text-[13px] font-medium">Filtros ativos:</span>

                {filters.collection && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#38220F] text-[#E89B55] border border-[#55321F] rounded-full text-xs">
                    Coleção: {filters.collection}
                    <button
                      type="button"
                      onClick={() => handleCollectionChange(undefined)}
                      className="hover:text-white cursor-pointer ml-1 font-bold text-sm"
                      aria-label="Remover filtro de coleção"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.network && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#38220F] text-[#E89B55] border border-[#55321F] rounded-full text-xs">
                    Rede: {filters.network}
                    <button
                      type="button"
                      onClick={() => handleNetworkChange(undefined)}
                      className="hover:text-white cursor-pointer ml-1 font-bold text-sm"
                      aria-label="Remover filtro de rede"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.maxPrice !== undefined && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#38220F] text-[#E89B55] border border-[#55321F] rounded-full text-xs">
                    Preço: até {filters.maxPrice.toFixed(2).replace('.', ',')} ETH
                    <button
                      type="button"
                      onClick={() => handlePriceChange(undefined, undefined)}
                      className="hover:text-white cursor-pointer ml-1 font-bold text-sm"
                      aria-label="Remover filtro de preço"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#38220F] text-[#E89B55] border border-[#55321F] rounded-full text-xs">
                    Busca: "{filters.search}"
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="hover:text-white cursor-pointer ml-1 font-bold text-sm"
                      aria-label="Remover busca"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[#CFB28C] hover:text-[#E89B55] underline ml-2 cursor-pointer transition-colors"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Catalog Grid: Desktop 3 columns (gap-x 32px, gap-y 72px) / Mobile staggered 2 columns (gap 24px, Column R offset 32px) */}
            {isLoading ? (
              <>
                {/* Desktop Skeletons */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-[32px] lg:gap-y-[72px] w-full">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <NFTCardSkeleton key={idx} />
                  ))}
                </div>

                {/* Mobile Skeletons (staggered) */}
                <div className="md:hidden flex flex-row justify-between items-start gap-4 w-full max-w-[366px] mx-auto">
                  <div className="flex flex-col items-start gap-6 w-[175px]">
                    <NFTCardSkeleton />
                    <NFTCardSkeleton />
                  </div>
                  <div className="flex flex-col items-start gap-6 w-[175px] pt-[32px]">
                    <NFTCardSkeleton />
                    <NFTCardSkeleton />
                  </div>
                </div>
              </>
            ) : isError ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 bg-[#241612] rounded-2xl p-8 border border-[#3F2319]">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <h2 className="text-lg font-bold text-[#F5F1EB]">
                  Erro ao carregar o catálogo de NFTs
                </h2>
                <p className="text-sm text-[#CFB28C] max-w-md">
                  Ocorreu uma instabilidade na conexão simulada. Tente novamente.
                </p>
                <Button
                  type="button"
                  onClick={() => refetch()}
                  className="px-6 py-2.5 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar novamente</span>
                </Button>
              </div>
            ) : data?.items.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 bg-[#241612] rounded-2xl p-8 border border-[#3F2319]">
                <div className="w-12 h-12 rounded-full bg-[#140D0A] flex items-center justify-center text-[#E89B55]">
                  🔍
                </div>
                <h2 className="text-lg font-bold text-[#F5F1EB]">
                  Nenhum NFT encontrado
                </h2>
                <p className="text-sm text-[#CFB28C] max-w-md">
                  Nenhum item corresponde aos filtros selecionados.
                </p>
                <Button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Grid (3 columns) */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-[32px] lg:gap-y-[72px] w-full">
                  {data?.items.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>

                {/* Mobile Staggered Grid matching Mobile_Inicio.png & Mobile_Inicio.css */}
                <div className="md:hidden flex flex-row justify-between items-start gap-4 w-full max-w-[366px] mx-auto">
                  {/* Column L (even indices: 0, 2, 4...) */}
                  <div className="flex flex-col items-start gap-6 w-[175px]">
                    {data?.items
                      .filter((_, idx) => idx % 2 === 0)
                      .map((nft) => (
                        <NFTCard key={nft.id} nft={nft} isMobile />
                      ))}
                  </div>

                  {/* Column R (odd indices: 1, 3, 5... staggered with 32px top offset) */}
                  <div className="flex flex-col items-start gap-6 w-[175px] pt-[32px]">
                    {data?.items
                      .filter((_, idx) => idx % 2 === 1)
                      .map((nft) => (
                        <NFTCard key={nft.id} nft={nft} isMobile />
                      ))}
                  </div>
                </div>

                {/* Pagination aligned right as in Figma - Desktop only */}
                <div className="hidden md:flex justify-end">
                  <Pagination
                    currentPage={data?.page || 1}
                    totalPages={data?.totalPages || 1}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Promo Banners (1200px wide) - Desktop only */}
        <div className="hidden md:block w-full max-w-[1200px] mx-auto">
          <PromoBanners />
        </div>

        {/* Mint Diary (1200px wide) - Desktop only */}
        <div id="aprenda" className="hidden md:block w-full max-w-[1200px] mx-auto">
          <MintDiary />
        </div>

        {/* Footer Unificado (1200px wide: Medallions + Newsletter + Brand + Links) - Desktop only */}
        <div className="hidden md:block w-full max-w-[1200px] mx-auto">
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onOpenChange={setIsMobileFiltersOpen}
        selectedCollection={filters.collection}
        onCollectionChange={handleCollectionChange}
        selectedNetwork={filters.network}
        onNetworkChange={handleNetworkChange}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onPriceChange={handlePriceChange}
        onClearFilters={handleClearFilters}
        counts={data?.counts}
      />
    </main>
  )
}
