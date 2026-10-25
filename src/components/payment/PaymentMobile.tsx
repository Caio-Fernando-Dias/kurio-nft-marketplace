import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { CartResponse } from '../../types/cart'

interface PaymentMobileProps {
  cart: CartResponse | undefined
  isLoading?: boolean
  isProcessing?: boolean
  isOutdatedQuote?: boolean
  paymentError?: string | null
  onConfirmPurchase: () => void
}

export const PaymentMobile: React.FC<PaymentMobileProps> = ({
  cart,
  isProcessing,
  isOutdatedQuote,
  paymentError,
  onConfirmPurchase,
}) => {
  const navigate = useNavigate()
  const [selectedWalletCard, setSelectedWalletCard] = useState<'reserva' | 'principal'>('reserva')
  const [selectedNetworkOption, setSelectedNetworkOption] = useState<'walletconnect' | 'metamask' | 'coinbase'>('coinbase')

  const totalEth = cart?.totalEth || '8.936'

  return (
    <div className="w-full min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col justify-between px-[28px] py-[32px] max-w-[414px] mx-auto">
      {/* Content Container (Frame 442: gap 16px) */}
      <div className="w-full flex flex-col gap-[16px]">
        {/* Screen Header (height 44px) */}
        <div className="w-full h-[44px] flex items-center relative">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate({ to: '/carrinho' })}
            aria-label="Voltar para o carrinho"
            className="w-[35px] h-[35px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#B39463]" />
          </button>

          {/* Title: Pagamento com carteira */}
          <h1 className="text-[20px] font-bold leading-[16px] text-[#F5F1EB] ml-[24px]">
            Pagamento com carteira
          </h1>
        </div>

        {/* Frame 2: Carteira conectada / Trocar carteira */}
        <div className="w-full flex justify-between items-center text-[16px] leading-[16px] pt-[8px]">
          <span className="font-bold text-[#F5F1EB]">Carteira conectada</span>
          <button
            type="button"
            onClick={() => {
              setSelectedWalletCard(selectedWalletCard === 'reserva' ? 'principal' : 'reserva')
            }}
            className="text-[14px] font-bold text-[#E89B55] hover:underline cursor-pointer"
          >
            Trocar carteira
          </button>
        </div>

        {/* Wallet Cards (height 206px, gap 20px) */}
        <div role="radiogroup" aria-label="Carteira conectada" className="w-full flex flex-col gap-[20px]">
          {/* Card 1: Reserva */}
          <div
            role="radio"
            tabIndex={0}
            aria-checked={selectedWalletCard === 'reserva'}
            onClick={() => setSelectedWalletCard('reserva')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                setSelectedWalletCard('reserva')
              }
            }}
            className={`w-full h-[93px] bg-[#241612] rounded-[14px] px-[19px] py-[15px] flex items-center justify-between cursor-pointer transition-all shadow-[0px_20px_20px_rgba(10,6,4,0.45)] border ${
              selectedWalletCard === 'reserva' ? 'border-[#D28A4C]' : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-[19px]">
              {/* Radio */}
              <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#D28A4C] flex items-center justify-center shrink-0">
                {selectedWalletCard === 'reserva' && (
                  <div className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
                  Reserva
                </span>
                <span className="text-[14px] font-normal leading-[22px] text-[#CFB28C] mt-[4px]">
                  nova.kurio.eth
                  <br />
                  Rede Polygon
                </span>
              </div>
            </div>

            {/* 3 dots */}
            <div className="flex flex-col gap-[3px]" aria-hidden="true">
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
            </div>
          </div>

          {/* Card 2: Principal */}
          <div
            role="radio"
            tabIndex={0}
            aria-checked={selectedWalletCard === 'principal'}
            onClick={() => setSelectedWalletCard('principal')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                setSelectedWalletCard('principal')
              }
            }}
            className={`w-full h-[93px] bg-[#241612] rounded-[14px] px-[19px] py-[15px] flex items-center justify-between cursor-pointer transition-all border ${
              selectedWalletCard === 'principal' ? 'border-[#D28A4C]' : 'border-transparent'
            }`}
          >
            <div className="flex items-center gap-[19px]">
              {/* Radio */}
              <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#55321F] flex items-center justify-center shrink-0">
                {selectedWalletCard === 'principal' && (
                  <div className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <span className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
                  Principal
                </span>
                <span className="text-[14px] font-normal leading-[22px] text-[#CFB28C] mt-[4px]">
                  0xA91F…E82C
                  <br />
                  Ethereum Mainnet
                </span>
              </div>
            </div>

            {/* 3 dots */}
            <div className="flex flex-col gap-[3px]" aria-hidden="true">
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
              <div className="w-[3px] h-[3px] rounded-full bg-[#B39463]" />
            </div>
          </div>
        </div>

        {/* Wallet Options: Carteira e rede */}
        <div className="w-full flex flex-col gap-[16px] pt-[8px]">
          <h2 className="text-[16px] font-bold leading-[16px] text-[#F5F1EB]">
            Carteira e rede
          </h2>

          <div role="radiogroup" aria-label="Opções de carteira e rede" className="w-full flex flex-col gap-[16px]">
            {/* Option 1: WalletConnect */}
            <div
              role="radio"
              tabIndex={0}
              aria-checked={selectedNetworkOption === 'walletconnect'}
              onClick={() => setSelectedNetworkOption('walletconnect')}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  setSelectedNetworkOption('walletconnect')
                }
              }}
              className={`w-full h-[65px] bg-[#241612] rounded-[15px] px-[14px] flex items-center justify-between cursor-pointer transition-all shadow-[0px_0px_20px_rgba(10,6,4,0.45)] border ${
                selectedNetworkOption === 'walletconnect' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
              }`}
            >
              <div className="flex items-center gap-[11px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center text-[#E89B55] text-xs font-bold" aria-hidden="true">
                  WC
                </div>
                <span className="text-[14px] font-normal leading-[16px] text-[#F5F1EB]">
                  WalletConnect
                </span>
              </div>
              <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#55321F] flex items-center justify-center">
                {selectedNetworkOption === 'walletconnect' && (
                  <div className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                )}
              </div>
            </div>

            {/* Option 2: MetaMask */}
            <div
              role="radio"
              tabIndex={0}
              aria-checked={selectedNetworkOption === 'metamask'}
              onClick={() => setSelectedNetworkOption('metamask')}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  setSelectedNetworkOption('metamask')
                }
              }}
              className={`w-full h-[65px] bg-[#241612] rounded-[15px] px-[14px] flex items-center justify-between cursor-pointer transition-all border ${
                selectedNetworkOption === 'metamask' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
              }`}
            >
              <div className="flex items-center gap-[11px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center text-[#E89B55] text-xs font-bold" aria-hidden="true">
                  MM
                </div>
                <span className="text-[14px] font-normal leading-[16px] text-[#F5F1EB]">
                  MetaMask
                </span>
              </div>
              <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#55321F] flex items-center justify-center">
                {selectedNetworkOption === 'metamask' && (
                  <div className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                )}
              </div>
            </div>

            {/* Option 3: Coinbase Wallet (Selected in Figma) */}
            <div
              role="radio"
              tabIndex={0}
              aria-checked={selectedNetworkOption === 'coinbase'}
              onClick={() => setSelectedNetworkOption('coinbase')}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  setSelectedNetworkOption('coinbase')
                }
              }}
              className={`w-full h-[65px] bg-[#241612] rounded-[15px] px-[14px] flex items-center justify-between cursor-pointer transition-all border ${
                selectedNetworkOption === 'coinbase' ? 'border-[#D28A4C]' : 'border-[#3F2319]'
              }`}
            >
              <div className="flex items-center gap-[11px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#2F1D15] border border-[#D28A4C] flex items-center justify-center text-[#E89B55] text-xs font-bold" aria-hidden="true">
                  CB
                </div>
                <span className="text-[14px] font-normal leading-[16px] text-[#F5F1EB]">
                  Coinbase Wallet
                </span>
              </div>
              <div className="w-[16px] h-[16px] rounded-full border-[1.2px] border-[#D28A4C] flex items-center justify-center">
                {selectedNetworkOption === 'coinbase' && (
                  <div className="w-[8px] h-[8px] rounded-full bg-[#D28A4C]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed-style Controls */}
      <div className="w-full flex flex-col gap-[16px] pt-[24px]">
        {/* Total Row */}
        <div className="w-full flex justify-end items-center gap-[28px] text-[16px] leading-[16px]">
          <span className="font-bold text-[#F5F1EB]">Total:</span>
          <span className="text-[18px] font-bold text-[#E89B55]">
            {totalEth} ETH
          </span>
        </div>

        {paymentError && (
          <div role="alert" aria-live="assertive" className="p-3 bg-red-950/40 border border-red-500/40 rounded-[6px] text-red-300 text-xs">
            {paymentError}
          </div>
        )}

        {/* Confirm Button */}
        <button
          id="mobile-confirm-purchase-btn"
          type="button"
          disabled={isProcessing || isOutdatedQuote}
          onClick={onConfirmPurchase}
          className="w-full h-[60px] bg-gradient-to-r from-[#D28A4C] to-[rgba(210,138,76,0.8)] disabled:opacity-60 rounded-[40px] text-[15px] font-bold text-[#140D0A] flex items-center justify-center hover:brightness-105 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
        >
          {isOutdatedQuote
            ? 'Cotação desatualizada (confirme acima)'
            : isProcessing
            ? 'Processando transação...'
            : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}
