import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { CartResponse } from '../../types/cart'
import { validateCoupon } from '../../services/api'
import { CartSkeleton } from './CartSkeleton'

import { useRealtime } from '../../context/RealtimeContext'

interface CartMobileProps {
  cart: CartResponse | undefined
  isLoading: boolean
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>
  onRemoveItem: (id: string) => Promise<void>
}

export const CartMobile: React.FC<CartMobileProps> = ({
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
    <div className="w-full max-w-[414px] mx-auto min-h-screen bg-[#140D0A] flex flex-col justify-between pt-[32px] font-mono text-[#F5F1EB]">
      {/* Top Content: Header + Items */}
      <div className="w-full flex flex-col px-[28px]">
        {/* Real-time price change alert banner (Section 7) */}
        {priceAlerts.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="w-full bg-[#241612] border border-[#E89B55] rounded-[8px] p-3 mb-3 flex flex-col gap-2 animate-in fade-in"
          >
            <div className="flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div className="flex flex-col text-[12px] leading-tight">
                <span className="text-[#E89B55] font-bold">
                  Preço alterado em tempo real
                </span>
                <span className="text-[#F5F1EB] mt-0.5">
                  {priceAlerts
                    .map((a) => `${a.title || a.nftId}: ${a.newPrice} ETH`)
                    .join(', ')}
                  . O total foi recalculado.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={acknowledgeNewQuote}
              className="self-end bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold px-2.5 py-1 rounded text-[11px] cursor-pointer"
            >
              Entendi
            </button>
          </div>
        )}

        {/* Screen Header (358x44px) */}
        <div className="w-full h-[44px] relative flex items-center justify-center mb-[12px]">
          {/* Back Circular Button (35x35px) */}
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Voltar"
            className="w-[35px] h-[35px] bg-[#2F1D15] border border-[#3F2319] rounded-full flex items-center justify-center absolute left-0 hover:border-[#D28A4C] active:scale-95 transition-all cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 9.5L4 6L7.5 2.5"
                stroke="#B39463"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Title: Carrinho de NFTs */}
          <h1 className="text-[20px] font-bold leading-[16px] text-[#F5F1EB] text-center">
            Carrinho de NFTs
          </h1>
        </div>

        {/* Cart Items List */}
        {isLoading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <p className="text-[15px] text-[#B39463]">Seu carrinho está vazio.</p>
            <a
              href="/#catalogo"
              className="px-6 py-2 bg-[#D28A4C] text-[#140D0A] font-bold text-[14px] rounded-[20px]"
            >
              Ver NFTs
            </a>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-[20px] pb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full h-[100px] bg-gradient-to-r from-[#241612] to-[#241612] rounded-[14px] shadow-[0px_6px_20px_rgba(10,6,4,0.45)] relative flex items-center overflow-hidden"
              >
                {/* Artwork Thumbnail (100x100px, rounded-l-14px) */}
                <img
                  src={item.nft.image}
                  alt={item.nft.title}
                  className="w-[100px] h-[100px] object-cover rounded-l-[14px] shrink-0"
                />

                {/* Info Text */}
                <div className="flex flex-col justify-center pl-[12px] pr-2 flex-1 h-full py-[10px]">
                  <a
                    href={`/detalhes/${item.nft.id.replace('nft-', '')}`}
                    className="text-[15px] font-bold leading-[16px] text-[#F5F1EB] truncate hover:text-[#E89B55]"
                  >
                    {item.nft.title}
                  </a>

                  <span className="text-[14px] font-normal leading-[16px] text-[#CFB28C] mt-[6px]">
                    Edição: {item.edition || '1/50'}
                  </span>

                  <span className="text-[18px] font-bold leading-[16px] text-[#E89B55] mt-[12px]">
                    {item.priceEth} ETH
                  </span>
                </div>

                {/* Quantity Controls (Group 81) */}
                <div className="flex items-center gap-[10px] pr-[16px] shrink-0">
                  {/* Minus button (24x24px, #2F1D15, border 1px #3F2319) */}
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
                    className="w-[24px] h-[24px] bg-[#2F1D15] border border-[#3F2319] rounded-full flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  >
                    <span className="w-[9px] h-[2px] bg-[#55321F] block rounded-full" />
                  </button>

                  {/* Quantity number */}
                  <span className="text-[16px] font-normal leading-[22px] text-[#F5F1EB] min-w-[12px] text-center">
                    {item.quantity}
                  </span>

                  {/* Plus button (24x24px, #2F1D15, border 1px #3F2319) */}
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Aumentar quantidade de ${item.nft.title}`}
                    className="w-[24px] h-[24px] bg-[#2F1D15] border border-[#3F2319] rounded-full flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                  >
                    <span className="text-[18px] font-normal leading-none text-[#F5F1EB] mb-[2px]">
                      +
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Summary Bottom Sheet (rounded-t-[40px], bg #241612) */}
      <div className="w-full bg-[#241612] rounded-t-[40px] px-[24px] pt-[24px] pb-[36px] shadow-2xl flex flex-col gap-[24px] mt-auto">
        {/* Frame 441: height 190px, gap 12px */}
        <div className="w-full flex flex-col gap-[12px]">
          {/* Promo Code Input (366x50px) */}
          <form
            onSubmit={handleApplyPromo}
            className="w-full h-[50px] bg-[#241612] border border-[#3F2319] rounded-[40px] shadow-[0px_6px_20px_rgba(10,6,4,0.45)] flex items-center pl-[16px] pr-0 overflow-hidden"
          >
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Digite o código promocional..."
              className="flex-1 h-full bg-transparent text-[13px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none font-mono"
            />
            <button
              type="submit"
              className="w-[97px] h-[50px] bg-gradient-to-r from-[rgba(210,138,76,0.54)] to-[#D28A4C] rounded-[40px] text-[15px] font-bold leading-[16px] text-[#F5F1EB] flex items-center justify-center hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              Aplicar
            </button>
          </form>
          {promoError && (
            <span className="text-[12px] text-red-400 font-mono -mt-1">{promoError}</span>
          )}
          {promoApplied && (
            <div className="flex items-center justify-between text-[12px] text-emerald-400 font-mono -mt-1">
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

          {/* Subtotal */}
          <div className="w-full flex justify-between items-center h-[20px]">
            <span className="text-[15px] font-normal leading-[20px] text-[#F5F1EB]">
              Subtotal
            </span>
            <span className="text-[16px] font-normal leading-[16px] text-[#F5F1EB]">
              {subtotal} ETH
            </span>
          </div>

          {/* Desconto */}
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
              <span className="text-[16px] font-normal leading-[16px] text-[#F5F1EB]">
                {networkFee} ETH
              </span>
            </div>
            <span className="text-[12px] font-normal leading-[16px] text-[#E89B55] mt-[2px]">
              Taxa estimada
            </span>
          </div>

          {/* Total Line with divider */}
          <div className="w-full border-t border-[#3F2319] pt-[12px] mt-[4px] flex justify-between items-center h-[30px]">
            <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
              Total
            </span>
            <span className="text-[18px] font-bold leading-[16px] text-[#E89B55]">
              {totalEth} ETH
            </span>
          </div>

        </div>

        {/* Conectar e finalizar Button (366x60px) */}
        <button
          type="button"
          onClick={() => navigate({ to: '/pagamento' })}
          className="w-full h-[60px] bg-gradient-to-r from-[#D28A4C] to-[rgba(210,138,76,0.8)] rounded-[40px] text-[16px] font-bold leading-[16px] text-[#140D0A] flex items-center justify-center hover:brightness-105 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
        >
          Conectar e finalizar
        </button>
      </div>

    </div>
  )
}
