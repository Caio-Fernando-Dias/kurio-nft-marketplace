import React, { useState } from 'react'
import { ChevronLeft, Heart, Star, Minus, Plus, ShoppingBag, Check } from 'lucide-react'
import type { NFT } from '../../types/nft'
import { useCart } from '../../hooks/useCart'
import { toggleFavoriteNft } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

interface NFTDetailMobileProps {
  nft: NFT
}

export const NFTDetailMobile: React.FC<NFTDetailMobileProps> = ({ nft }) => {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const queryClient = useQueryClient()

  const [selectedEdition, setSelectedEdition] = useState<string>('1/50')
  const [quantity, setQuantity] = useState<number>(1)
  const [activeDot, setActiveDot] = useState<number>(0)
  const [isAdded, setIsAdded] = useState(false)

  // Favorite toggle
  const [isFav, setIsFav] = useState(Boolean(nft.isFavorite))
  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavoriteNft(nft.id),
    onMutate: () => {
      setIsFav((prev) => !prev)
    },
    onSuccess: (data) => {
      setIsFav(data.isFavorite)
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
    onError: () => {
      setIsFav(Boolean(nft.isFavorite))
    },
  })

  const handleBuy = async () => {
    try {
      await addItem(nft.id, quantity)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  const editions = ['1/1', '1/10', '1/50', 'ABERTA']

  return (
    <div className="w-full min-h-screen bg-[#140D0A] font-mono text-[#F5F1EB] flex flex-col relative pb-[200px]">
      {/* 
        Hero Section (414 x 460 px)
        Gradient: linear-gradient(143.28deg, #241612 -12%, #2F1D15 106.59%)
      */}
      <section className="relative w-full h-[460px] bg-[linear-gradient(143.28deg,#241612_-12%,#2F1D15_106.59%)] flex flex-col items-center justify-between p-[20px] pt-[24px] overflow-hidden">
        {/* Top Floating Action Bar: Back button (left) and Heart button (right) */}
        <div className="w-full max-w-[361px] flex items-center justify-between z-10">
          {/* Back button: 35x35px #2F1D15 border #3F2319 */}
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            aria-label="Voltar para a página inicial"
            className="w-[35px] h-[35px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] transition-colors cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-[20px] h-[20px]" />
          </button>

          {/* Heart button: 35x35px #2F1D15 border #3F2319 */}
          <button
            type="button"
            onClick={() => favoriteMutation.mutate()}
            aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar este NFT'}
            className="w-[35px] h-[35px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center hover:border-[#D28A4C] transition-colors cursor-pointer shadow-md"
          >
            <Heart
              className={`w-[16px] h-[16px] transition-colors ${
                isFav ? 'text-[#E89B55] fill-[#E89B55]' : 'text-[#E89B55]'
              }`}
            />
          </button>
        </div>

        {/* Hero Artwork (320x320 px up to 361x356 px, border-radius 24px) */}
        <div className="w-[320px] h-[320px] rounded-[24px] overflow-hidden bg-[#140D0A] shadow-2xl relative my-auto">
          <img
            src={nft.image || '/assets/image.png'}
            alt={nft.title}
            width={320}
            height={320}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Indicator dots/pill: 28x7px pill + two 7x7px circles */}
        <div className="flex items-center gap-[7px] pb-2 z-10">
          {[0, 1, 2].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveDot(dot)}
              aria-label={`Slide ${dot + 1}`}
              className={`transition-all cursor-pointer ${
                activeDot === dot
                  ? 'w-[28px] h-[7px] bg-[#D28A4C] rounded-[25px]'
                  : 'w-[7px] h-[7px] bg-[#D28A4C] rounded-full opacity-60 hover:opacity-90'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 
        Details Sheet (background #241612, border-radius: 31px 31px 0px 0px)
        Padding: 32px 24px 24px
      */}
      <section className="relative -mt-[16px] w-full bg-[#241612] rounded-t-[31px] px-[24px] pt-[28px] pb-[40px] flex flex-col gap-[16px] z-10 shadow-2xl">
        {/* Title Row: Emerald Ape #042 (20px bold) + Review Pill (4.8, 19) */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-[20px] font-bold leading-[16px] text-[#F5F1EB] tracking-tight">
            {nft.title}
          </h1>

          {/* Rating Pill: 80x27px border #D28A4C rounded-[32px] */}
          <div className="h-[27px] px-2.5 rounded-[32px] border border-[#D28A4C] flex items-center gap-[5px] shrink-0">
            <Star className="w-[12px] h-[12px] fill-[#E3A44E] text-[#E3A44E]" />
            <span className="text-[14px] font-medium leading-[16px] text-[#F5F1EB]">
              4.8
            </span>
            <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C]">
              (19)
            </span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-[14px] font-normal leading-[24px] text-[#CFB28C]">
          Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na Ethereum.
        </p>

        {/* Edição: */}
        <div className="flex flex-col gap-[8px] pt-1">
          <div className="flex items-center gap-[8px]">
            <span className="text-[15px] font-bold leading-[16px] text-[#F5F1EB]">
              Edição:
            </span>
            {selectedEdition === '1/1' && (
              <span className="text-[11px] text-red-400 font-mono tracking-wide">
                (Esgotada / indisponível)
              </span>
            )}
          </div>
          <div className="flex items-center gap-[12px]">
            {editions.map((ed) => {
              const isSelected = selectedEdition === ed
              const isSoldOut = ed === '1/1'
              const widthClass = ed === 'ABERTA' ? 'w-[66px]' : ed === '1/50' ? 'w-[46px]' : 'w-[42px]'
              return (
                <button
                  key={ed}
                  type="button"
                  onClick={() => setSelectedEdition(ed)}
                  className={`${widthClass} h-[28px] rounded-full flex items-center justify-center text-[14px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'border border-[#D28A4C] text-[#E89B55] font-medium'
                      : isSoldOut
                      ? 'border border-[#3F2319] text-[#A69485] line-through'
                      : 'border border-[#3F2319] text-[#F5F1EB] hover:border-[#D28A4C]/60 font-normal'
                  }`}
                >
                  {ed}
                </button>
              )
            })}
          </div>
        </div>

        {/* Token Info: Cores fiéis ao Figma (#B39463) */}
        <div className="flex flex-col gap-[6px] pt-2 text-[15px] font-normal leading-[20px] text-[#B39463]">
          <div>ID do token: #0042</div>
          <div>Coleção: Kurio Apes</div>
          <div>Atributos: Óculos, Esmeralda, Raro</div>
        </div>
      </section>

      {/* 
        Sticky Buy Bar (height: 164px, background #241612, border-radius 40px 40px 0px 0px)
        Fixed at bottom
      */}
      <div className="fixed bottom-0 left-0 right-0 h-[164px] bg-[#241612] rounded-t-[40px] px-[24px] py-[20px] flex flex-col justify-between shadow-[0px_0px_20px_rgba(10,6,4,0.45)] z-30">
        {/* Top Row: Qtd. [-] 1 [+] and Price (1.19 ETH) */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <span className="text-[15px] font-medium leading-[16px] text-[#CFB28C]">
              Qtd.
            </span>
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="w-[20px] h-[30px] rounded-[20px] bg-[#D28A4C] border border-[#140D0A] flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition-colors cursor-pointer shadow-sm"
              >
                <Minus className="w-[12px] h-[12px] stroke-[3]" />
              </button>

              <span className="text-[18px] font-medium leading-[25px] text-[#F5F1EB] min-w-[12px] text-center">
                {quantity}
              </span>

              <button
                type="button"
                disabled={quantity >= (nft.availableQuantity || 5)}
                onClick={() => setQuantity((q) => Math.min(nft.availableQuantity || 5, q + 1))}
                aria-label="Aumentar quantidade"
                className="w-[20px] h-[30px] rounded-[20px] bg-[#D28A4C] disabled:opacity-50 border border-[#140D0A] flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-[12px] h-[12px] stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Price: 20px Bold #E89B55 */}
          <span className="text-[20px] font-bold leading-[16px] text-[#E89B55]">
            {nft.priceEth} ETH
          </span>
        </div>

        {/* Bottom Row: Comprar NFT (196x60px) + Cart Button (60x60px) */}
        <div className="w-full flex items-center gap-[12px]">
          <button
            type="button"
            disabled={selectedEdition === '1/1'}
            onClick={handleBuy}
            className="flex-1 h-[60px] rounded-[40px] bg-[linear-gradient(93.21deg,#D28A4C_-3.96%,rgba(210,138,76,0.8)_121.97%)] disabled:bg-[#3F2319] disabled:opacity-50 hover:opacity-95 text-[#140D0A] font-bold text-[16px] leading-[20px] flex items-center justify-center uppercase tracking-wide transition-all cursor-pointer shadow-lg active:scale-[0.98]"
          >
            {selectedEdition === '1/1' ? (
              'ESGOTADO'
            ) : isAdded ? (
              <span className="flex items-center gap-2">
                <Check className="w-5 h-5" /> Adicionado!
              </span>
            ) : (
              'Comprar NFT'
            )}
          </button>

          <button
            type="button"
            disabled={selectedEdition === '1/1'}
            onClick={handleBuy}
            aria-label="Abrir carrinho"
            className="w-[60px] h-[60px] rounded-[40px] bg-[#2F1D15] disabled:opacity-50 border border-[#3F2319] flex items-center justify-center text-[#B39463] hover:text-[#E89B55] transition-colors cursor-pointer shadow-md shrink-0 active:scale-[0.98]"
          >
            <ShoppingBag className="w-[20px] h-[20px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
