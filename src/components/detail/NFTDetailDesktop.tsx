import React, { useState } from 'react'
import { Heart, Star, Minus, Plus, MessageSquare, Check } from 'lucide-react'
import type { NFT } from '../../types/nft'
import { useCart } from '../../hooks/useCart'
import { toggleFavoriteNft } from '../../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

interface NFTDetailDesktopProps {
  nft: NFT
  relatedNfts: NFT[]
}

export const NFTDetailDesktop: React.FC<NFTDetailDesktopProps> = ({ nft, relatedNfts }) => {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const queryClient = useQueryClient()

  // Conforme solicitado pelo usuário:
  // "As quatro imagens na lateral esquerda empilhados são diferentes tem que ser a mesma imagem que está aberta"
  const currentImage = nft.image || '/assets/image.png'
  const thumbnails = [currentImage, currentImage, currentImage, currentImage]

  const [selectedThumbIndex, setSelectedThumbIndex] = useState<number>(1) // No Figma a segunda miniatura vem selecionada
  const [selectedEdition, setSelectedEdition] = useState<string>('1/50')
  const [quantity, setQuantity] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [activeDot, setActiveDot] = useState<number>(0)
  const [isCopied, setIsCopied] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  // Optimistic Favorite Mutation
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

  const handleShare = (platform: string) => {
    const url = window.location.href
    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=Confira ${encodeURIComponent(nft.title)} na Kurio!&url=${encodeURIComponent(url)}`,
        '_blank'
      )
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank'
      )
    } else {
      navigator.clipboard?.writeText(url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const editions = [
    { label: '1/1', width: 'w-[42px]' },
    { label: '1/10', width: 'w-[42px]' },
    { label: '1/50', width: 'w-[46px]' },
    { label: 'ABERTA', width: 'w-[66px]' },
  ]

  return (
    <div className="w-[1200px] flex flex-col font-mono text-[#F5F1EB]">
      {/* Breadcrumb: Início / Mercado (alinhado a 1200px) */}
      <nav aria-label="Breadcrumb" className="w-[1200px] pt-8 pb-10">
        <div className="flex items-center gap-2 text-[15px] font-bold leading-[16px]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate({ to: '/' })
            }}
            className="text-[#F5F1EB] hover:text-[#E89B55] transition-colors"
          >
            Início
          </a>
          <span className="text-[#F5F1EB]">/</span>
          <span className="text-[#F5F1EB]">Mercado</span>
        </div>
      </nav>

      {/* Main Section: Product (1200 x 448 px) */}
      <section className="w-[1200px] flex flex-row justify-between items-start pb-[96px]">
        {/* Left Column: Product Images (573 x 448 px) */}
        <div className="w-[573px] h-[448px] flex flex-row items-center gap-[28px] shrink-0">
          {/* Thumbnails (100 x 448 px): 4 imagens idênticas à aberta */}
          <div className="w-[100px] h-[448px] flex flex-col justify-between shrink-0">
            {thumbnails.map((thumb, idx) => {
              const isSelected = selectedThumbIndex === idx
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedThumbIndex(idx)}
                  className={`w-[100px] h-[100px] rounded-[8px] overflow-hidden bg-[#241612] transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border border-[#D28A4C] shadow-lg'
                      : 'border border-transparent hover:border-[#3F2319]'
                  }`}
                  aria-label={`Visualizar miniatura ${idx + 1}`}
                >
                  <img
                    src={thumb}
                    alt={`${nft.title} miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            })}
          </div>

          {/* Main Artwork Card (444 x 444 px) */}
          <div className="relative w-[444px] h-[444px] bg-[#241612] rounded-[6px] p-[20px] flex items-center justify-center shrink-0 border border-[#3F2319]/40 shadow-xl">
            {/* Inner Artwork (404 x 404 px, border-radius 24px) */}
            <div className="w-[404px] h-[404px] rounded-[24px] overflow-hidden bg-[#140D0A]">
              <img
                src={currentImage}
                alt={nft.title}
                width={404}
                height={404}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Favorite Circle Button: Frame 399 (30 x 30 px, #2F1D15, border #3F2319) */}
            <button
              type="button"
              onClick={() => favoriteMutation.mutate()}
              aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar este NFT'}
              className="absolute top-[16px] right-[16px] w-[30px] h-[30px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center hover:border-[#D28A4C] transition-all cursor-pointer shadow-md"
            >
              <Heart
                className={`w-[16px] h-[16px] transition-colors ${
                  isFav ? 'text-[#D28A4C] fill-[#D28A4C]' : 'text-[#F5F1EB]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Details (595 x 448 px) */}
        <div className="w-[595px] h-[448px] flex flex-col justify-between items-start shrink-0">
          {/* Header Block: Title + Price & Rating */}
          <div className="w-full flex flex-col gap-[12px]">
            {/* Title: Heading/28 Bold */}
            <h1 className="text-[28px] font-bold leading-[37px] text-[#F5F1EB] tracking-tight">
              {nft.title}
            </h1>

            {/* Price & Rating Row */}
            <div className="w-full flex items-center justify-between">
              {/* Price: 22px Bold #E89B55 */}
              <span className="text-[22px] font-bold leading-[16px] text-[#E89B55]">
                {nft.priceEth} ETH
              </span>

              {/* Rating: 5 Stars + Review text */}
              <div className="flex items-center gap-[6px]">
                <div className="flex items-center gap-[3px]">
                  {[1, 2, 3, 4].map((star) => (
                    <Star
                      key={star}
                      className="w-[14px] h-[14px] fill-[#D28A4C] text-[#D28A4C]"
                    />
                  ))}
                  <Star className="w-[14px] h-[14px] fill-[#CFB28C] text-[#CFB28C]" />
                </div>
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  19 avaliações de colecionadores
                </span>
              </div>
            </div>

            {/* Hairline divider: 0.3px solid #D28A4C (width: 573px) */}
            <div className="w-[573px] h-[1px] bg-[#D28A4C]/30 my-1" />
          </div>

          {/* Description Block: Sobre este NFT (Texto exato do Figma) */}
          <div className="w-[574px] flex flex-col gap-[8px]">
            <h2 className="text-[15px] font-bold leading-[16px] text-[#F5F1EB]">
              Sobre este NFT:
            </h2>
            <p className="text-[14px] font-normal leading-[24px] text-[#CFB28C]">
              Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.
            </p>
          </div>

          {/* Edition Block: 1/1, 1/10, 1/50, ABERTA (Formato oval - rounded-full com dimensões exatas) */}
          <div className="w-full flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px]">
              <span className="text-[15px] font-bold leading-[16px] text-[#F5F1EB]">
                Edição:
              </span>
              {selectedEdition === '1/1' && (
                <span className="text-[11px] text-red-400 font-mono tracking-wide">
                  (Edição esgotada / indisponível)
                </span>
              )}
            </div>
            <div className="flex items-center gap-[12px]">
              {editions.map((ed) => {
                const isSelected = selectedEdition === ed.label
                const isSoldOut = ed.label === '1/1'
                return (
                  <button
                    key={ed.label}
                    type="button"
                    onClick={() => setSelectedEdition(ed.label)}
                    className={`${ed.width} h-[28px] rounded-full flex items-center justify-center text-[14px] font-mono transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border border-[#D28A4C] text-[#E89B55] font-medium'
                        : isSoldOut
                        ? 'border border-[#3F2319] text-[#A69485] line-through'
                        : 'border border-[#3F2319] text-[#F5F1EB] hover:border-[#D28A4C]/60 font-normal'
                    }`}
                  >
                    {ed.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity Selector + Action Buttons (COMPRAR / Favoritar) */}
          <div className="w-full flex items-center justify-between gap-[16px]">
            {/* Quantity Selector: [ - ] 1 [ + ] */}
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
                className="w-[33px] h-[49.5px] rounded-[33px] bg-[#D28A4C] border border-[#140D0A] flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition-colors cursor-pointer shadow-md"
              >
                <Minus className="w-[14px] h-[14px] stroke-[3]" />
              </button>

              <span className="w-[20px] text-center text-[20px] font-normal leading-[28px] text-[#F5F1EB]">
                {quantity}
              </span>

              <button
                type="button"
                disabled={quantity >= (nft.availableQuantity || 5)}
                onClick={() => setQuantity((q) => Math.min(nft.availableQuantity || 5, q + 1))}
                aria-label="Aumentar quantidade"
                className="w-[33px] h-[49.5px] rounded-[33px] bg-[#D28A4C] disabled:opacity-50 border border-[#140D0A] flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-[14px] h-[14px] stroke-[3]" />
              </button>
            </div>

            {/* Action Buttons: COMPRAR (130x40) & Favoritar (130x40) */}
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                disabled={selectedEdition === '1/1'}
                onClick={handleBuy}
                className="w-[130px] h-[40px] rounded-[6px] bg-[#D28A4C] disabled:bg-[#3F2319] disabled:text-[#CFB28C]/60 hover:bg-[#E89B55] text-[#140D0A] font-bold text-[14px] leading-[20px] flex items-center justify-center uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                {selectedEdition === '1/1' ? (
                  'ESGOTADO'
                ) : isAdded ? (
                  <span className="flex items-center gap-1.5 text-xs">
                    <Check className="w-4 h-4" /> No Carrinho
                  </span>
                ) : (
                  'COMPRAR'
                )}
              </button>

              <button
                type="button"
                onClick={() => favoriteMutation.mutate()}
                className="w-[130px] h-[40px] rounded-[6px] border border-[#D28A4C] hover:bg-[#D28A4C]/10 text-[#E89B55] font-medium text-[14px] leading-[20px] flex items-center justify-center gap-[8px] transition-all cursor-pointer"
              >
                <Heart
                  className={`w-[18px] h-[18px] ${
                    isFav ? 'text-[#D28A4C] fill-[#D28A4C]' : 'text-[#D28A4C]'
                  }`}
                />
                <span>Favoritar</span>
              </button>
            </div>
          </div>

          {/* Token Metadata & Share Row: Cores fiéis ao Figma (#B39463 para todo o texto) */}
          <div className="w-full flex flex-col gap-[12px] pt-1">
            <div className="flex flex-col gap-[4px] text-[15px] font-normal leading-[20px] text-[#B39463]">
              <div>ID do token: #0042</div>
              <div>Coleção: Kurio Apes</div>
              <div>Atributos: Óculos, Esmeralda, Raro</div>
            </div>

            {/* Share row */}
            <div className="flex items-center gap-[10px]">
              <span className="text-[15px] font-bold leading-[16px] text-[#F5F1EB]">
                Compartilhar este NFT:
              </span>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => handleShare('linkedin')}
                  aria-label="Compartilhar no LinkedIn"
                  className="text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleShare('copy')}
                  aria-label="Compartilhar link"
                  className="text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-[16px] h-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                  aria-label="Compartilhar no Twitter"
                  className="text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                {isCopied && (
                  <span className="text-xs text-[#E89B55] animate-fade-in">
                    Link copiado!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section with Tabs (1200 x 340 px) */}
      <section className="w-[1200px] flex flex-col pb-[96px]">
        {/* 
          Tabs Row:
          "Os títulos de detalhes do NFT e avaliações de colecionadores tem que ficar na mesma linha 
          e a linha horizontal em destaque está incorreta tem que ficar sobre a linha"
        */}
        <div className="relative w-[1200px] border-b border-[#D28A4C]/30 mb-[24px]">
          <div className="flex items-center gap-[32px] -mb-[1.5px]">
            {/* Tab 1: Detalhes do NFT */}
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-[12px] flex items-center cursor-pointer transition-colors ${
                activeTab === 'details'
                  ? 'text-[#E89B55] font-bold border-b-[3px] border-[#D28A4C]'
                  : 'text-[#F5F1EB] font-normal hover:text-[#E89B55] border-b-[3px] border-transparent'
              }`}
            >
              <span className="text-[17px] leading-[16px]">Detalhes do NFT</span>
            </button>

            {/* Tab 2: Avaliações de colecionadores (19) */}
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-[12px] flex items-center cursor-pointer transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#E89B55] font-bold border-b-[3px] border-[#D28A4C]'
                  : 'text-[#F5F1EB] font-normal hover:text-[#E89B55] border-b-[3px] border-transparent'
              }`}
            >
              <span className="text-[17px] leading-[16px]">Avaliações de colecionadores (19)</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <div className="w-[1200px] flex flex-col gap-[24px]">
            {/* Long paragraph text */}
            <p className="w-[1200px] text-[14px] font-normal leading-[24px] text-[#CFB28C]">
              Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras. A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.
            </p>

            {/* 
              Spec lines:
              "Rede, contrato e direitos autorais o texto tem que ficar abaixo do título"
            */}
            <div className="w-[1200px] flex flex-col gap-[16px]">
              {/* 1. Rede */}
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#F5F1EB] text-[14px] leading-[24px]">
                  Rede:
                </span>
                <span className="font-normal text-[#CFB28C] text-[14px] leading-[24px]">
                  Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.
                </span>
              </div>

              {/* 2. Contrato */}
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#F5F1EB] text-[14px] leading-[24px]">
                  Contrato:
                </span>
                <span className="font-normal text-[#CFB28C] text-[14px] leading-[24px]">
                  0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
                </span>
              </div>

              {/* 3. Direitos autorais */}
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#F5F1EB] text-[14px] leading-[24px]">
                  Direitos autorais:
                </span>
                <span className="font-normal text-[#CFB28C] text-[14px] leading-[24px]">
                  Creator royalty: 5% on secondary sales, paid automatically by supported marketplaces.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[1200px] flex flex-col gap-[16px] text-[#CFB28C]">
            <div className="p-4 bg-[#241612] rounded-lg border border-[#3F2319]/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F1EB] font-bold text-sm">0xCryptoWhale</span>
                <div className="flex text-[#D28A4C]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#CFB28C]">
                Arte incrível e acabamento impecável na rede Ethereum! Muito satisfeito com a aquisição.
              </p>
            </div>
            <div className="p-4 bg-[#241612] rounded-lg border border-[#3F2319]/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F1EB] font-bold text-sm">0xCollectorApe</span>
                <div className="flex text-[#D28A4C]">
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 fill-[#CFB28C] text-[#CFB28C]" />
                </div>
              </div>
              <p className="text-xs text-[#CFB28C]">
                Excelente resolução e suporte da comunidade Kurio. Recomendo para todos os entusiastas de arte digital.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Mais desta coleção (Related Products - Exatamente 1200px de largura sem vazar da linha) */}
      <section className="w-[1200px] flex flex-col gap-[32px] pb-[96px]">
        {/* Section Heading com linha de 1200px */}
        <div className="w-[1200px] flex flex-col gap-[12px]">
          <h2 className="text-[17px] font-bold leading-[16px] text-[#E89B55]">
            Mais desta coleção
          </h2>
          <div className="w-[1200px] h-[1px] bg-[#D28A4C]/30" />
        </div>

        {/* 5 Cards alinhados perfeitamente com a linha de 1200px (219px cada, justify-between) */}
        <div className="w-[1200px] flex flex-row justify-between items-start">
          {relatedNfts.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate({ to: `/nft/${item.id}` as any })
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="w-[219px] shrink-0 group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Card Container (219 x 255 px) */}
              <div className="w-[219px] h-[255px] bg-[#241612] rounded-none p-[3.5px] pt-[20px] pb-[24px] flex items-center justify-center border border-[#3F2319]/40 shadow-lg">
                <div className="w-[212px] h-[212px] rounded-[13px] overflow-hidden bg-[#140D0A]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Card Meta: Title (15px regular #F5F1EB) and Price (16px bold #E89B55) */}
              <div className="w-[219px] pt-[12px] flex flex-col gap-[2px]">
                <h3 className="text-[15px] font-normal leading-[20px] text-[#F5F1EB] truncate group-hover:text-[#E89B55] transition-colors">
                  {item.title}
                </h3>
                <span className="text-[16px] font-bold leading-[16px] text-[#E89B55]">
                  {item.priceEth} ETH
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="w-[1200px] flex items-center justify-center gap-[4px] pt-[8px]">
          {[0, 1, 2].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveDot(dot)}
              aria-label={`Página do carrossel ${dot + 1}`}
              className="p-2 -m-1 inline-flex items-center justify-center cursor-pointer min-w-[24px] min-h-[24px]"
            >
              <span
                className={`w-[12px] h-[12px] rounded-full transition-all block ${
                  activeDot === dot
                    ? 'border-[1.3px] border-[#D28A4C] bg-transparent'
                    : 'bg-[#D28A4C]'
                }`}
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
