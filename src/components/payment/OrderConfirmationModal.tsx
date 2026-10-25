import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import type { CartResponse } from '../../types/cart'

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  cart?: CartResponse
  transactionId?: string
  date?: string
  walletName?: string
  totalEth?: string
  networkFee?: string
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  cart,
  transactionId = '0xA91F…E82C',
  date = '29 Jul, 2026',
  walletName = 'MetaMask',
  totalEth = '26.846',
  networkFee = '0.016',
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Focus first focusable element on open
    const timer = setTimeout(() => {
      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables && focusables.length > 0) {
        focusables[0].focus()
      }
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab') {
        if (!modalRef.current) return
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Fallback items matching Desktop_Confirmacao_De_Pedido.css (lines 6696-7315)
  const fallbackItems = [
    {
      id: 'item-1',
      title: 'Emerald Ape #042',
      tokenId: '#0042',
      quantity: 2,
      totalEth: '2.38',
      image: '/assets/image.png',
    },
    {
      id: 'item-2',
      title: 'Violet Nomad #314',
      tokenId: '#0314',
      quantity: 6,
      totalEth: '8.34',
      image: '/assets/image2.png',
    },
    {
      id: 'item-3',
      title: 'Ivory Baron #088',
      tokenId: '#0088',
      quantity: 9,
      totalEth: '16.11',
      image: '/assets/image3.png',
    },
  ]

  const items = cart?.items && cart.items.length > 0
    ? cart.items.map((it) => ({
        id: it.id,
        title: it.nft.title,
        tokenId: it.tokenId || `#00${it.nft.id.replace('nft-', '')}`,
        quantity: it.quantity,
        totalEth: (parseFloat(it.priceEth) * it.quantity).toFixed(2),
        image: it.nft.image,
      }))
    : fallbackItems

  const displayTotal = cart?.totalEth || totalEth

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#140D0A]/85 backdrop-blur-[2px] overflow-y-auto animate-in fade-in duration-200">
      {/* 
        Order Confirmation Modal (578px wide, max 90vh, scrollable interior)
      */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-confirmed-heading"
        className="w-full max-w-[578px] max-h-[90vh] bg-[#241612] border border-[#3F2319] rounded-[8px] flex flex-col shadow-[0px_20px_50px_rgba(0,0,0,0.7)] relative my-auto font-mono text-[#F5F1EB] overflow-hidden"
      >
        {/* Close Button X (Line 7645) - Permanently accessible in top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar confirmação"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#D28A4C] hover:brightness-125 transition-all p-1.5 z-30 cursor-pointer bg-[#241612]/90 hover:bg-[#38220F] rounded-full border border-[#3F2319]/60 shadow-md"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Scrollable Container so the modal never overflows the viewport */}
        <div className="w-full overflow-y-auto flex-1">
          {/* ============================================================== */}
          {/* 1. Modal Header (Height 156px, Desktop_Confirmacao_De_Pedido.css line 5721) */}
          {/* ============================================================== */}
          <div className="w-full pt-[24px] pb-[16px] flex flex-col items-center justify-center gap-[12px] sm:gap-[16px]">
            {/* thank-you 1 Open Envelope Icon (Line 5743) */}
            <div className="w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] flex items-center justify-center">
            <svg
              width="110"
              height="110"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[110px] h-[110px]"
            >
              {/* Envelope flap open in the back */}
              <path
                d="M 15 36 L 40 14 L 65 36"
                stroke="#D28A4C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Card / Letter sliding out with 'THANK' / 'YOU' uppercase text */}
              <rect
                x="18"
                y="11"
                width="44"
                height="36"
                rx="3"
                fill="#2E1B15"
                stroke="#D28A4C"
                strokeWidth="1.8"
              />
              {/* Two lines uppercase: 'THANK' and 'YOU' */}
              <text
                x="40"
                y="24"
                textAnchor="middle"
                fill="#D28A4C"
                fontFamily="'Roboto Mono', monospace"
                fontSize="8.5"
                fontWeight="bold"
                letterSpacing="1.2"
              >
                THANK
              </text>
              <text
                x="40"
                y="36"
                textAnchor="middle"
                fill="#D28A4C"
                fontFamily="'Roboto Mono', monospace"
                fontSize="8.5"
                fontWeight="bold"
                letterSpacing="1.2"
              >
                YOU
              </text>

              {/* Envelope Body (front pocket) */}
              <path
                d="M 14 36 L 14 64 C 14 65.5 15.2 66.5 16.8 66.5 L 63.2 66.5 C 64.8 66.5 66 65.5 66 64 L 66 36 Z"
                fill="#241612"
                stroke="#D28A4C"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Front crease lines */}
              <path
                d="M 14 66 L 36 47"
                stroke="#D28A4C"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M 66 66 L 44 47"
                stroke="#D28A4C"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M 14 37 L 37.5 53 C 39 54 41 54 42.5 53 L 66 37"
                stroke="#D28A4C"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#2A1711"
              />
            </svg>
          </div>

          {/* Title: Seus NFTs agora estão na sua carteira (Line 5900) */}
          <h2 id="order-confirmed-heading" className="text-[16px] font-bold leading-[16px] text-[#CFB28C] text-center">
            Seus NFTs agora estão na sua carteira
          </h2>
        </div>

        {/* Rectangle 92: Divider 1px #D28A4C (Line 5927) */}
        <div className="w-full h-[1px] bg-[#D28A4C]" />

        {/* ============================================================== */}
        {/* 2. Transaction Meta (Line 5946: 4 columns separated by lines) */}
        {/* ============================================================== */}
        <div className="w-full h-[65px] px-[36px] flex items-center justify-between">
          {/* Col 1: ID da transação */}
          <div className="flex flex-col items-start gap-[2px]">
            <span className="text-[14px] font-bold leading-[16px] text-[#CFB28C]">
              ID da transação
            </span>
            <span className="text-[15px] font-normal leading-[20px] text-[#CFB28C] font-mono">
              {transactionId}
            </span>
          </div>

          {/* Line 10 Divider */}
          <div className="w-[1px] h-[31px] bg-[#D28A4C]" />

          {/* Col 2: Data */}
          <div className="flex flex-col items-start gap-[2px]">
            <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C]">
              Data
            </span>
            <span className="text-[15px] font-normal leading-[20px] text-[#CFB28C]">
              {date}
            </span>
          </div>

          {/* Line 11 Divider */}
          <div className="w-[1px] h-[31px] bg-[#D28A4C]" />

          {/* Col 3: Total */}
          <div className="flex flex-col items-start gap-[2px]">
            <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C]">
              Total
            </span>
            <span className="text-[15px] font-normal leading-[20px] text-[#CFB28C]">
              {displayTotal} ETH
            </span>
          </div>

          {/* Line 12 Divider */}
          <div className="w-[1px] h-[31px] bg-[#D28A4C]" />

          {/* Col 4: Carteira */}
          <div className="flex flex-col items-start gap-[2px]">
            <span className="text-[14px] font-bold leading-[16px] text-[#CFB28C]">
              Carteira
            </span>
            <span className="text-[15px] font-normal leading-[20px] text-[#CFB28C]">
              {walletName}
            </span>
          </div>
        </div>

        {/* Rectangle 93: Divider 1px #D28A4C (Line 6337) */}
        <div className="w-full h-[1px] bg-[#D28A4C]" />

        {/* ============================================================== */}
        {/* 3. Transaction Details (Line 6376: padding 20px 44px 32px)     */}
        {/* ============================================================== */}
        <div className="w-full px-[44px] pt-[20px] pb-[32px] flex flex-col gap-[12px]">
          {/* Section Header: Detalhes da transação (Line 6416) */}
          <h3 className="text-[15px] font-bold leading-[16px] text-[#F5F1EB]">
            Detalhes da transação
          </h3>

          {/* Table Header: NFTs / Edições / Subtotal (Line 6522) */}
          <div className="w-full flex justify-between items-center text-[16px] leading-[16px] pt-[4px]">
            <span className="font-bold text-[#F5F1EB]">NFTs</span>
            <div className="flex items-center gap-[48px]">
              <span className="font-bold text-[#F5F1EB]">Edições</span>
              <span className="font-medium text-[#F5F1EB]">Subtotal</span>
            </div>
          </div>

          {/* Hairline Divider Line 2 (0.3px solid #D28A4C) */}
          <div className="w-full border-t border-[#D28A4C] opacity-30 my-[2px]" />

          {/* Items List (Line 6677) */}
          <div className="w-full flex flex-col gap-[12px]">
            {items.map((it) => (
              <div
                key={it.id}
                className="w-full h-[70px] bg-[#241612] flex items-center justify-between rounded-[6px]"
              >
                {/* Artwork + Title & Token ID */}
                <div className="flex items-center gap-[12px]">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="w-[70px] h-[70px] object-cover rounded-[8px] shrink-0"
                  />
                  <div className="w-[154px] flex flex-col gap-[6px] shrink-0">
                    <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB] truncate">
                      {it.title}
                    </span>
                    <span className="text-[14px] font-normal leading-[16px] text-[#B39463] truncate">
                      ID do token: {it.tokenId}
                    </span>
                  </div>
                </div>

                {/* Edições + Subtotal */}
                <div className="flex items-center gap-[48px] pr-2 shrink-0">
                  <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C] min-w-[43px] text-right">
                    (x {it.quantity})
                  </span>
                  <span className="text-[18px] font-bold leading-[16px] text-[#E89B55] min-w-[87px] text-right">
                    {it.totalEth} ETH
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown (Line 7318: 321px wide, aligned to the right) */}
          <div className="w-[321px] ml-auto flex flex-col gap-[12px] pt-[12px]">
            {/* Taxa de rede */}
            <div className="w-full flex justify-between items-center text-[#F5F1EB]">
              <span className="text-[15px] font-normal leading-[20px]">
                Taxa de rede
              </span>
              <span className="text-[18px] font-normal leading-[16px]">
                {networkFee} ETH
              </span>
            </div>

            {/* Total */}
            <div className="w-full flex justify-between items-center">
              <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
                Total
              </span>
              <span className="text-[18px] font-bold leading-[16px] text-[#E89B55]">
                {displayTotal} ETH
              </span>
            </div>
          </div>

          {/* Line 13 Divider (0.3px solid #D28A4C) */}
          <div className="w-full border-t border-[#D28A4C] opacity-30 mt-[4px] mb-[4px]" />

          {/* Footer Note & Actions */}
          <div className="w-full flex flex-col items-center gap-[20px] pt-[8px]">
            <p className="text-[14px] font-normal leading-[22px] text-[#CFB28C] text-center max-w-[490px]">
              Transação confirmada na rede Ethereum. A posse foi transferida com sucesso para a sua carteira conectada.
            </p>

            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[186px] h-[46px] bg-[#D28A4C] rounded-[5px] text-[15px] font-bold leading-[16px] text-[#140D0A] flex items-center justify-center hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Ver no Etherscan
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-[120px] h-[46px] border border-[#D28A4C] hover:bg-[#D28A4C]/15 text-[#D28A4C] rounded-[5px] text-[15px] font-bold leading-[16px] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Rectangle 90: Bottom orange accent bar (Line 7627) */}
        <div className="w-full h-[8px] sm:h-[10px] bg-[#D28A4C] shrink-0" />
      </div>
    </div>
  )
}
