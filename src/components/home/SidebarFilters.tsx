import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { NFTCollection, NFTNetwork } from '../../types/nft'

interface SidebarFiltersProps {
  selectedCollection?: string
  onCollectionChange: (collection?: string) => void
  selectedNetwork?: string
  onNetworkChange: (network?: string) => void
  minPrice?: number
  maxPrice?: number
  onPriceChange: (min?: number, max?: number) => void
  counts?: {
    collections: Record<string, number>
    networks: Record<string, number>
  }
}

const COLLECTIONS: { label: NFTCollection; defaultCount: number }[] = [
  { label: 'Arte digital', defaultCount: 33 },
  { label: 'Fotografia', defaultCount: 12 },
  { label: 'Música', defaultCount: 65 },
  { label: 'Arte 3D', defaultCount: 39 },
  { label: 'Colecionáveis', defaultCount: 23 },
  { label: 'Generativa', defaultCount: 17 },
  { label: 'Jogos', defaultCount: 19 },
  { label: 'Assinaturas', defaultCount: 13 },
  { label: 'Utilidade', defaultCount: 18 },
]

const NETWORKS: { label: NFTNetwork; defaultCount: number }[] = [
  { label: 'Ethereum', defaultCount: 119 },
  { label: 'Polygon', defaultCount: 78 },
  { label: 'Solana', defaultCount: 86 },
]

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedCollection,
  onCollectionChange,
  selectedNetwork,
  onNetworkChange,
  minPrice: _minPrice = 0.02,
  maxPrice,
  onPriceChange,
  counts,
}) => {
  const [sliderMax, setSliderMax] = useState<number>(maxPrice ?? 12.3)

  useEffect(() => {
    if (maxPrice !== undefined) {
      setSliderMax(maxPrice)
    } else {
      setSliderMax(12.3)
    }
  }, [maxPrice])

  const handleApplyPrice = () => {
    onPriceChange(0.02, sliderMax)
  }

  return (
    <aside
      aria-label="Filtros do catálogo"
      className="w-[310px] flex flex-col gap-[24px] font-mono shrink-0"
    >
      {/* 
        FILTERS PANEL:
        - Width: 310px, background: #241612, padding: 20px, rounded-none (sem bordas arredondadas)
        - Inner Frame: width 270px, gap: 40px
      */}
      <div className="w-[310px] bg-[#241612] p-[20px] rounded-none flex flex-col gap-[40px] border border-[#3F2319]/40 shadow-xl">
        {/* Section 1: Coleções */}
        <div className="w-[270px] flex flex-col gap-[12px]">
          <h2 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
            Coleções
          </h2>
          <div className="w-[270px] flex flex-col">
            {COLLECTIONS.map((c) => {
              const isSelected = selectedCollection === c.label
              const count = counts?.collections?.[c.label] ?? c.defaultCount
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() =>
                    onCollectionChange(isSelected ? undefined : c.label)
                  }
                  className="w-[246px] h-[40px] flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span
                    className={`text-[15px] leading-[40px] ${
                      isSelected ? 'text-[#E89B55] font-bold' : 'text-[#F5F1EB] hover:text-[#E89B55]'
                    }`}
                  >
                    {c.label}
                  </span>
                  <span
                    className={`text-[15px] leading-[40px] text-right ${
                      isSelected ? 'text-[#E89B55] font-bold' : 'text-[#CFB28C]'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Faixa de preço */}
        <div className="w-[270px] flex flex-col gap-[12px]">
          <h2 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
            Faixa de preço
          </h2>
          <div className="w-[270px] flex flex-col gap-[12px]">
            {/* Slider track representation with double circles */}
            <div className="relative w-[258px] h-[21px] flex items-center">
              {/* Left track line */}
              <div
                className="h-0 border-t-[4px] border-[#D28A4C] rounded-full"
                style={{ width: `${Math.min(95, Math.max(10, (sliderMax / 15) * 100))}%` }}
              />
              {/* Unfilled track line */}
              <div className="flex-1 h-0 border-t-[4px] border-[#3F2319] rounded-full" />

              {/* Left thumb handle */}
              <div className="absolute left-0 w-[15px] h-[15px] rounded-full bg-[#D28A4C] border-[3px] border-[#140D0A] z-10" />

              {/* Right thumb handle draggable */}
              <div
                className="absolute w-[15px] h-[15px] rounded-full bg-[#D28A4C] border-[3px] border-[#140D0A] -translate-x-1/2 z-10 pointer-events-none"
                style={{ left: `${Math.min(95, Math.max(10, (sliderMax / 15) * 100))}%` }}
              />

              <input
                type="range"
                min="0.1"
                max="15.0"
                step="0.1"
                value={sliderMax}
                onChange={(e) => setSliderMax(parseFloat(e.target.value))}
                onMouseUp={() => onPriceChange(0.02, sliderMax)}
                onTouchEnd={() => onPriceChange(0.02, sliderMax)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                aria-label="Faixa de preço em ETH"
              />
            </div>

            {/* Price label: Preço: 0,02 - 12,30 ETH */}
            <div className="w-[258px] text-[15px] leading-[20px] text-[#F5F1EB] flex items-center justify-between">
              <span>Preço: 0,02 - {sliderMax.toFixed(2).replace('.', ',')} ETH</span>
            </div>

            {/* Action buttons: Apply Button & Clear if active */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleApplyPrice}
                className="w-[92px] h-[36px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[16px] leading-[20px] rounded-[6px]"
              >
                Aplicar
              </Button>

              {maxPrice !== undefined && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onPriceChange(undefined, undefined)}
                  className="h-[36px] px-3 bg-[#38220F] hover:bg-[#3F2319] text-[#CFB28C] hover:text-[#F5F1EB] text-[13px] rounded-[6px] border border-[#55321F]/60"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Rede */}
        <div className="w-[270px] flex flex-col gap-[12px]">
          <h2 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
            Rede
          </h2>
          <div className="w-[270px] flex flex-col">
            {NETWORKS.map((n) => {
              const isSelected = selectedNetwork === n.label
              const count = counts?.networks?.[n.label] ?? n.defaultCount
              return (
                <button
                  key={n.label}
                  type="button"
                  onClick={() => onNetworkChange(isSelected ? undefined : n.label)}
                  className="w-[258px] h-[40px] flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span
                    className={`text-[15px] leading-[40px] ${
                      isSelected ? 'text-[#E89B55] font-bold' : 'text-[#CFB28C] hover:text-[#E89B55]'
                    }`}
                  >
                    {n.label}
                  </span>
                  <span
                    className={`text-[15px] leading-[40px] text-right ${
                      isSelected ? 'text-[#E89B55] font-bold' : 'text-[#CFB28C]'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 
        FEATURED NFT BANNER:
        - Width: 310px, height: 470px
        - Bordas arredondadas (rounded-[24px] no card e rounded-[22px] na imagem, Desktop_Inicio.css linha 2688)
        - Background: linear-gradient(180deg, rgba(210, 138, 76, 0.1) 0%, rgba(210, 138, 76, 0.03) 100%)
        - Title: "NFT EM DESTAQUE" (24px bold #E89B55)
        - Subtitle: "OFERTA LIMITADA" (22px bold #F5F1EB)
      */}
      <div
        className="w-[310px] rounded-[24px] pt-[24px] pb-[16px] px-[10px] flex flex-col items-center gap-[16px] border border-[#3F2319]/40 shadow-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(210, 138, 76, 0.1) 0%, rgba(210, 138, 76, 0.03) 100%)',
        }}
      >
        <div className="flex flex-col items-center text-center gap-[4px] w-full px-[10px]">
          <span className="text-[24px] font-bold leading-[32px] text-[#E89B55] tracking-wide">
            NFT EM DESTAQUE
          </span>
          <span className="text-[22px] font-bold leading-[16px] text-[#F5F1EB] tracking-wide mt-1">
            OFERTA LIMITADA
          </span>
        </div>

        <div className="w-[290px] h-[348px] rounded-[22px] overflow-hidden shadow-2xl relative group bg-[#241612]">
          <img
            src="/assets/image2.png"
            alt="NFT em Destaque - Oferta Limitada"
            className="w-full h-full object-cover rounded-[22px] transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </aside>
  )
}
