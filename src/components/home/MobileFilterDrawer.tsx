import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { X, SlidersHorizontal } from 'lucide-react'
import type { NFTCollection, NFTNetwork } from '../../types/nft'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedCollection?: string
  onCollectionChange: (collection?: string) => void
  selectedNetwork?: string
  onNetworkChange: (network?: string) => void
  minPrice?: number
  maxPrice?: number
  onPriceChange: (min?: number, max?: number) => void
  onClearFilters: () => void
  counts?: {
    collections: Record<string, number>
    networks: Record<string, number>
  }
}

const COLLECTIONS: NFTCollection[] = [
  'Arte digital',
  'Fotografia',
  'Música',
  'Arte 3D',
  'Colecionáveis',
  'Generativa',
  'Jogos',
  'Assinaturas',
  'Utilidade',
]

const NETWORKS: NFTNetwork[] = ['Ethereum', 'Polygon', 'Solana']

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onOpenChange,
  selectedCollection,
  onCollectionChange,
  selectedNetwork,
  onNetworkChange,
  maxPrice,
  onPriceChange,
  onClearFilters,
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

  const handleApply = () => {
    onPriceChange(0.02, sliderMax)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
        <DialogContent className="fixed inset-y-0 right-0 left-auto top-0 translate-x-0 translate-y-0 h-full w-full max-w-sm bg-[#241612] border-l border-[#3F2319] z-50 p-6 flex flex-col justify-between overflow-y-auto font-mono text-[#F5F1EB] rounded-none sm:rounded-none">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3F2319]">
              <DialogTitle className="flex items-center gap-2 text-[#F5F1EB] font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5 text-[#E89B55]" />
                <span>Filtros do Catálogo</span>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Selecione coleções, redes blockchain e faixa de preço para filtrar os NFTs do catálogo.
              </DialogDescription>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Fechar filtros"
                  className="p-1 rounded-full text-[#CFB28C] hover:text-[#F5F1EB] hover:bg-[#38220F] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </DialogClose>
            </div>

            {/* Coleções */}
            <div>
              <h4 className="text-sm font-bold tracking-wider text-[#F5F1EB] mb-3 uppercase">
                Coleções
              </h4>
              <div className="flex flex-wrap gap-2">
                {COLLECTIONS.map((c) => {
                  const isSelected = selectedCollection === c
                  const count = counts?.collections?.[c]
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        onCollectionChange(isSelected ? undefined : c)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#D28A4C] text-[#140D0A] font-bold'
                          : 'bg-[#140D0A] text-[#CFB28C] hover:text-[#F5F1EB] border border-[#3F2319]'
                      }`}
                    >
                      {c} {count ? `(${count})` : ''}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div className="border-t border-[#3F2319] pt-5">
              <h4 className="text-sm font-bold tracking-wider text-[#F5F1EB] mb-3 uppercase">
                Faixa de preço em ETH
              </h4>
              <Slider
                min={0.1}
                max={15.0}
                step={0.1}
                value={[sliderMax]}
                onValueChange={([val]) => setSliderMax(val)}
                className="my-3"
              />
              <div className="text-xs text-[#CFB28C] font-mono mt-2">
                Preço: 0,02 - {sliderMax.toFixed(2).replace('.', ',')} ETH
              </div>
            </div>

            {/* Rede */}
            <div className="border-t border-[#3F2319] pt-5">
              <h4 className="text-sm font-bold tracking-wider text-[#F5F1EB] mb-3 uppercase">
                Rede Blockchain
              </h4>
              <div className="flex gap-2">
                {NETWORKS.map((n) => {
                  const isSelected = selectedNetwork === n
                  const count = counts?.networks?.[n]
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onNetworkChange(isSelected ? undefined : n)}
                      className={`flex-1 py-2 text-center text-xs font-medium rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#D28A4C] text-[#140D0A] font-bold border-[#D28A4C]'
                          : 'bg-[#140D0A] text-[#CFB28C] border-[#3F2319] hover:text-[#F5F1EB]'
                      }`}
                    >
                      {n} {count ? `(${count})` : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-[#3F2319] flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              className="flex-1 py-3 h-auto uppercase tracking-wider text-xs border-[#3F2319] text-[#CFB28C] hover:text-[#F5F1EB]"
            >
              Limpar
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleApply}
              className="flex-1 py-3 h-auto uppercase tracking-wider text-xs shadow-lg"
            >
              Ver resultados
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
