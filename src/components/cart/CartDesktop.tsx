import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { CartResponse } from '../../types/cart'
import { INITIAL_NFTS } from '../../mocks/data/nfts'
import { validateCoupon } from '../../services/api'
import { CartSkeleton } from './CartSkeleton'

import { useRealtime } from '../../context/RealtimeContext'

interface CartDesktopProps {
  cart: CartResponse | undefined
  isLoading: boolean
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>
  onRemoveItem: (id: string) => Promise<void>
}

export const CartDesktop: React.FC<CartDesktopProps> = ({
  cart,
  isLoading,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const navigate = useNavigate()
  const { priceAlerts, acknowledgeNewQuote } = useRealtime()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [activeDot, setActiveDot] = useState(1)

  // 5 related NFTs matching Figma design
  const relatedNfts = [
    INITIAL_NFTS.find((n) => n.id === 'nft-4') || INITIAL_NFTS[3],
    INITIAL_NFTS.find((n) => n.id === 'nft-2') || INITIAL_NFTS[1],
    INITIAL_NFTS.find((n) => n.id === 'nft-6') || INITIAL_NFTS[5],
    INITIAL_NFTS.find((n) => n.id === 'nft-7') || INITIAL_NFTS[6],
    INITIAL_NFTS.find((n) => n.id === 'nft-9') || INITIAL_NFTS[8],
  ]

  const items = cart?.items || []
  const subtotal = cart?.subtotalEth || '0.00'
  const discount = promoApplied ? '2.00' : (cart?.discountEth || '00.00')
  const networkFee = cart?.networkFeeEth || '0.016'
  
  const totalEth = promoApplied
    ? Math.max(0, parseFloat(subtotal) - 2.0 + parseFloat(networkFee)).toFixed(3)
    : (cart?.totalEth || '0.016')

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    if (!promoCode.trim()) return

    try {
      const res = await validateCoupon(promoCode)
      if (res.valid) {
        setPromoApplied(true)
        setPromoError('')
      }
    } catch (err: any) {
      setPromoApplied(false)
      const msg = err?.response?.data?.error || 'Cupom inválido ou expirado.'
      setPromoError(msg)
    }
  }

  const handleRemovePromo = () => {
    setPromoApplied(false)
    setPromoCode('')
    setPromoError('')
  }

  return (
    <div className="w-full flex flex-col gap-[96px] font-mono text-[#F5F1EB]">
      {/* Top Section with Breadcrumb & Cart Body (1200px) */}
      <div className="w-full flex flex-col gap-[12px]">
        {/* Breadcrumb: Início / Mercado / Carrinho */}
        <div className="flex items-center text-[15px] font-bold leading-[16px]">
          <a href="/" className="hover:text-[#E89B55] transition-colors">
            Início
          </a>
          <span className="mx-2 text-[#CFB28C]">/</span>
          <a href="/#catalogo" className="hover:text-[#E89B55] transition-colors">
            Mercado
          </a>
          <span className="mx-2 text-[#CFB28C]">/</span>
          <span className="text-[#F5F1EB]">Carrinho</span>
        </div>

        {/* Real-time price change alert banner (Section 7) */}
        {priceAlerts.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="w-full bg-[#241612] border border-[#E89B55] rounded-[8px] p-4 flex items-center justify-between animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex flex-col">
                <span className="text-[#E89B55] font-bold text-[14px]">
                  Atualização em tempo real detectada
                </span>
                <span className="text-[#F5F1EB] text-[13px]">
                  {priceAlerts
                    .map((a) => `${a.title || a.nftId} teve o valor atualizado para ${a.newPrice} ETH`)
                    .join('. ')}
                  . O resumo do carrinho e os totais foram recalculados.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={acknowledgeNewQuote}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold px-3 py-1.5 rounded-[6px] text-[12px] cursor-pointer"
            >
              Entendi
            </button>
          </div>
        )}

        {/* Cart Body: Table (782px) + Summary (332px) */}
        {isLoading ? (
          <CartSkeleton />
        ) : (
          <div className="w-full flex justify-between items-start gap-[86px]">
            {/* Cart Table (782px wide) */}
            <div className="w-[782px] shrink-0 flex flex-col">
              {/* Table Header */}
              <div className="w-full flex items-center justify-between pr-[24px] text-[16px] leading-[16px] h-[16px]">
                <span className="w-[250px] font-bold text-left">NFTs</span>
                <span className="w-[77px] font-medium text-center">Preço</span>
                <span className="w-[75px] font-bold text-center">Edições</span>
                <span className="w-[87px] font-medium text-center">Total</span>
                <span className="w-[24px]"></span>
              </div>

              {/* Hairline Divider */}
              <div className="w-full border-t border-[#D28A4C] opacity-30 mt-[12px] mb-[12px]" />

              {/* Cart Items List */}
              {items.length === 0 ? (
                <div className="w-full py-12 flex flex-col items-center justify-center bg-[#241612] rounded-[6px] gap-4">
                  <p className="text-[16px] text-[#B39463]">Seu carrinho está vazio.</p>
                  <a
                    href="/#catalogo"
                    className="px-6 py-2 bg-[#D28A4C] text-[#140D0A] font-bold text-[14px] rounded-[3px] hover:brightness-105 transition-all"
                  >
                    Explorar NFTs
                  </a>
                </div>
              ) : (
              <div className="w-full flex flex-col gap-[12px]">
                {items.map((item) => {
                  const itemTotal = (parseFloat(item.priceEth) * item.quantity).toFixed(2)
                  return (
                    <div
                      key={item.id}
                      className="w-full h-[70px] bg-[#241612] flex items-center justify-between pr-[24px] transition-colors"
                    >
                      {/* Col 1: Artwork Thumbnail + Info (250px wide) */}
                      <div className="w-[250px] flex items-center gap-[16px]">
                        <img
                          src={item.nft.image}
                          alt={item.nft.title}
                          className="w-[70px] h-[70px] object-cover rounded-[6px] shrink-0"
                        />
                        <div className="flex flex-col gap-[6px] truncate">
                          <a
                            href={`/detalhes/${item.nft.id.replace('nft-', '')}`}
                            className="text-[16px] font-bold leading-[16px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors truncate"
                          >
                            {item.nft.title}
                          </a>
                          <span className="text-[14px] font-normal leading-[16px] text-[#B39463]">
                            ID do token: {item.tokenId || '#0042'}
                          </span>
                        </div>
                      </div>

                      {/* Col 2: Preço Unitário (77px wide) */}
                      <div className="w-[77px] text-center text-[16px] font-bold leading-[16px] text-[#CFB28C]">
                        {item.priceEth} ETH
                      </div>

                      {/* Col 3: Seletor de Quantidade (75px wide) */}
                      <div className="w-[75px] flex items-center justify-center gap-[12px]">
                        {/* Minus Button: 20x30px #D28A4C, border 1px solid #140D0A, rounded-20px */}
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 1) {
                              onUpdateQuantity(item.id, item.quantity - 1)
                            } else {
                              onRemoveItem(item.id)
                            }
                          }}
                          aria-label={`Diminuir quantidade de ${item.nft.title}`}
                          className="w-[20px] h-[30px] bg-[#D28A4C] border border-[#140D0A] rounded-[20px] shadow flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="w-[9px] h-[2px] bg-black block rounded-full" />
                        </button>

                        {/* Quantity Number */}
                        <span className="w-[11px] text-center text-[17px] font-normal leading-[24px] text-[#F5F1EB]">
                          {item.quantity}
                        </span>

                        {/* Plus Button: 20x30px #D28A4C, border 1px solid #140D0A, rounded-20px */}
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Aumentar quantidade de ${item.nft.title}`}
                          className="w-[20px] h-[30px] bg-[#D28A4C] border border-[#140D0A] rounded-[20px] shadow flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="relative w-[9px] h-[9px] flex items-center justify-center">
                            <span className="w-[9px] h-[2px] bg-black absolute rounded-full" />
                            <span className="w-[2px] h-[9px] bg-black absolute rounded-full" />
                          </span>
                        </button>
                      </div>

                      {/* Col 4: Preço Total (87px wide) */}
                      <div className="w-[87px] text-center text-[16px] font-bold leading-[16px] text-[#E89B55]">
                        {itemTotal} ETH
                      </div>

                      {/* Col 5: Botão Excluir (24px wide) */}
                      <div className="w-[24px] flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remover ${item.nft.title} do carrinho`}
                          className="p-1 hover:opacity-80 transition-opacity cursor-pointer group"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:stroke-[#E89B55] transition-colors"
                          >
                            <path
                              d="M19.3248 9.4682C19.3248 9.4682 18.7818 16.2032 18.4668 19.0402C18.3168 20.3952 17.4798 21.1892 16.1088 21.2142C13.4998 21.2612 10.8878 21.2642 8.27979 21.2092C6.96079 21.1822 6.13779 20.3782 5.99079 19.0472C5.67379 16.1852 5.13379 9.4682 5.13379 9.4682"
                              stroke="#B39463"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20.708 6.2397H3.75"
                              stroke="#B39463"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M17.4406 6.2397C16.6556 6.2397 15.9796 5.6847 15.8256 4.9157L15.5826 3.6997C15.4326 3.1387 14.9246 2.7507 14.3456 2.7507H10.1126C9.53361 2.7507 9.02561 3.1387 8.87561 3.6997L8.63261 4.9157C8.47861 5.6847 7.80261 6.2397 7.01761 6.2397"
                              stroke="#B39463"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Wallet Summary (332px wide) */}
          <div className="w-[332px] shrink-0 flex flex-col">
            {/* Heading (Resumo da carteira + hairline divider) */}
            <div className="w-full flex flex-col">
              <h2 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
                Resumo da carteira
              </h2>
              <div className="w-full border-t border-[#D28A4C]/40 mt-[12px]" />
            </div>

            {/* Promo Code Section */}
            <div className="w-full flex flex-col gap-[8px] mt-[24px]">
              <label htmlFor="promo-input" className="text-[14px] font-bold leading-[16px] text-[#F5F1EB]">
                Código promocional
              </label>
              <form onSubmit={handleApplyPromo} className="w-[332px] h-[40px] flex items-center border border-[#D28A4C] rounded-[3px] overflow-hidden bg-[#241612]">
                <input
                  id="promo-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Digite o código promocional..."
                  className="flex-1 h-full bg-transparent pl-3 text-[12px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
                />
                <button
                  type="submit"
                  className="w-[102px] h-[40px] bg-[#D28A4C] text-[15px] font-bold leading-[16px] text-[#140D0A] hover:brightness-105 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  Aplicar
                </button>
              </form>
              {promoError && (
                <span className="text-[12px] text-red-400 font-mono">{promoError}</span>
              )}
              {promoApplied && (
                <div className="flex items-center justify-between text-[12px] text-emerald-400 font-mono">
                  <span>Cupom KURIO aplicado (-2.00 ETH)</span>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[#CFB28C] hover:text-red-400 underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            {/* Fees Breakdown Section */}
            <div className="w-full flex flex-col gap-[14px] mt-[24px]">
              {/* Subtotal */}
              <div className="w-full flex justify-between items-center h-[20px]">
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  Subtotal
                </span>
                <span className="text-[18px] font-normal leading-[16px] text-[#F5F1EB]">
                  {subtotal} ETH
                </span>
              </div>

              {/* Desconto do lançamento */}
              <div className="w-full flex justify-between items-center h-[20px]">
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  Desconto do lançamento
                </span>
                <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                  (-) {discount}
                </span>
              </div>

              {/* Taxa de rede */}
              <div className="w-full flex flex-col items-end">
                <div className="w-full flex justify-between items-center h-[20px]">
                  <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
                    Taxa de rede
                  </span>
                  <span className="text-[18px] font-normal leading-[16px] text-[#F5F1EB]">
                    {networkFee} ETH
                  </span>
                </div>
                <span className="text-[12px] font-normal leading-[16px] text-[#E89B55] mt-[2px]">
                  Taxa estimada
                </span>
              </div>

              {/* Total Line */}
              <div className="w-full border-t border-[#D28A4C]/30 pt-[14px] mt-[2px] flex justify-between items-center h-[34px]">
                <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
                  Total
                </span>
                <span className="text-[18px] font-bold leading-[16px] text-[#E89B55]">
                  {totalEth} ETH
                </span>
              </div>
            </div>

            {/* Checkout CTA Buttons */}
            <div className="w-full flex flex-col items-center gap-[14px] mt-[28px]">
              <button
                type="button"
                onClick={() => navigate({ to: '/pagamento' })}
                className="w-[332px] h-[40px] bg-[#D28A4C] rounded-[3px] text-[15px] font-bold leading-[16px] text-[#140D0A] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
              >
                Conectar e finalizar
              </button>

              <a
                href="/#catalogo"
                className="text-[15px] font-normal leading-[20px] text-[#E89B55] hover:underline cursor-pointer text-center"
              >
                Continuar explorando
              </a>
            </div>
          </div>
        </div>
      )}
    </div>

      {/* Section: Colecionadores também viram (1200px wide) */}
      <div className="w-full flex flex-col gap-[32px]">
        {/* Section Heading: Title + Line 7 */}
        <div className="w-full flex flex-col gap-[12px]">
          <h3 className="text-[17px] font-bold leading-[16px] text-[#E89B55]">
            Colecionadores também viram
          </h3>
          <div className="w-full border-t border-[#D28A4C] opacity-30" />
        </div>

        {/* 5 Product Cards: 1200px wide, justify-between */}
        <div className="w-full flex justify-between items-start">
          {relatedNfts.map((nft) => (
            <a
              key={nft.id}
              href={`/detalhes/${nft.id.replace('nft-', '')}`}
              className="w-[219px] shrink-0 flex flex-col gap-[8px] group cursor-pointer"
            >
              <div className="w-[219px] h-[255px] bg-[#241612] flex items-center justify-center rounded-[6px] group-hover:border group-hover:border-[#D28A4C]/40 transition-all">
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="w-[190px] h-[243px] object-cover rounded-[15px] group-hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[15px] font-normal leading-[16px] text-[#F5F1EB] group-hover:text-[#E89B55] transition-colors truncate">
                  {nft.title}
                </span>
                <span className="text-[16px] font-bold leading-[16px] text-[#E89B55]">
                  {nft.priceEth} ETH
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="w-full flex items-center justify-center gap-[8px]">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveDot(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`w-[12px] h-[12px] rounded-full transition-all cursor-pointer ${
                activeDot === idx
                  ? 'bg-[#D28A4C]'
                  : 'border-[1.3px] border-[#D28A4C] bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
