import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PaymentDesktop } from '../components/payment/PaymentDesktop'
import { PaymentMobile } from '../components/payment/PaymentMobile'
import { OrderConfirmationModal } from '../components/payment/OrderConfirmationModal'
import { useCart } from '../hooks/useCart'
import { useNavigate } from '@tanstack/react-router'

import { createOrder, fetchOrderById, type OrderResponse } from '../services/api'
import { useQueryClient } from '@tanstack/react-query'
import { useRealtime } from '../context/RealtimeContext'

export const PaymentPage: React.FC = () => {
  const { cart, isLoading } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isOutdatedQuote, acknowledgeNewQuote, lastOrderEvent } = useRealtime()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [idempotencyKey] = useState(() => {
    const existing = typeof window !== 'undefined' ? sessionStorage.getItem('kurio_pending_order_key') : null
    return existing || `idem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  })

  // Recover state if connection was interrupted while order was in-flight (Section 7)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = sessionStorage.getItem('kurio_pending_order_key')
      if (savedKey) {
        fetchOrderById(savedKey)
          .then((order) => {
            if (order && (order.status === 'confirmed' || order.status === 'rejected')) {
              setConfirmedOrder(order)
              setShowConfirmationModal(true)
              sessionStorage.removeItem('kurio_pending_order_key')
            }
          })
          .catch(() => {})
      }
    }
  }, [])

  // Listen for real-time order status updates (order.updated) via Socket.IO
  useEffect(() => {
    if (lastOrderEvent) {
      if (lastOrderEvent.status === 'confirmed') {
        fetchOrderById(lastOrderEvent.orderId)
          .then((order) => {
            setConfirmedOrder(order)
            setShowConfirmationModal(true)
            setIsProcessing(false)
            setPaymentError(null)
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('kurio_pending_order_key')
            }
          })
          .catch(() => {
            setConfirmedOrder({
              orderId: lastOrderEvent.orderId,
              transactionId: `0x${lastOrderEvent.orderId.slice(-4).toUpperCase()}…A1`,
              status: 'confirmed',
              items: [],
              subtotalEth: cart?.subtotalEth || '26.83',
              discountEth: cart?.discountEth || '00.00',
              networkFeeEth: cart?.networkFeeEth || '0.016',
              totalEth: cart?.totalEth || '26.846',
              date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
              walletName: 'Coinbase Wallet',
              createdAt: new Date().toISOString(),
            })
            setShowConfirmationModal(true)
            setIsProcessing(false)
            setPaymentError(null)
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('kurio_pending_order_key')
            }
          })
      } else if (lastOrderEvent.status === 'rejected') {
        setPaymentError('Transação recusada pela rede simulada (order.updated: rejected).')
        setIsProcessing(false)
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('kurio_pending_order_key')
        }
      }
    }
  }, [lastOrderEvent, cart])

  const handleConfirmPurchase = async () => {
    if (isProcessing) return
    if (isOutdatedQuote) {
      setPaymentError(
        'A cotação foi alterada em tempo real devido a uma mudança de preço. Por favor, confirme a nova cotação acima antes de finalizar a compra.'
      )
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kurio_pending_order_key', idempotencyKey)
    }

    try {
      const order = await createOrder(
        {
          subtotalEth: cart?.subtotalEth || '26.83',
          discountEth: cart?.discountEth || '00.00',
          networkFeeEth: cart?.networkFeeEth || '0.016',
          totalEth: cart?.totalEth || '26.846',
          walletName: 'Coinbase Wallet',
        },
        idempotencyKey
      )
      setConfirmedOrder(order)
      setShowConfirmationModal(true)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('kurio_pending_order_key')
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    } catch (err: any) {
      setPaymentError(err?.response?.data?.error || 'Erro ao processar transação na rede.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono selection:bg-[#E89B55] selection:text-[#140D0A] relative">
      {/* Outdated Quote Banner (Section 7 requirement: checkout blocks with outdated quote) */}
      {isOutdatedQuote && (
        <div role="alert" aria-live="polite" className="w-full bg-[#241612] border-b-2 border-[#E89B55] px-4 py-3 sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <div className="flex flex-col text-[13px]">
              <span className="text-[#E89B55] font-bold">Cotação Atualizada em Tempo Real</span>
              <span className="text-[#F5F1EB]">
                O preço de itens no carrinho mudou. O novo total é <strong>{cart?.totalEth} ETH</strong>. Confirme a nova cotação para prosseguir.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={acknowledgeNewQuote}
            className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold px-4 py-1.5 rounded-[6px] text-[12px] cursor-pointer shrink-0 transition-colors"
          >
            Confirmar nova cotação
          </button>
        </div>
      )}

      {/* MOBILE VIEW (< md) */}
      <div className="block md:hidden">
        <PaymentMobile
          cart={cart}
          isLoading={isLoading}
          isProcessing={isProcessing}
          isOutdatedQuote={isOutdatedQuote}
          paymentError={paymentError}
          onConfirmPurchase={handleConfirmPurchase}
        />
      </div>

      {/* DESKTOP VIEW (>= md) */}
      <div className="hidden md:flex flex-col items-center w-full">
        {/* Main 1200px Content Container matching Desktop_Pagamento.css */}
        <div className="w-full max-w-[1200px] mx-auto pt-[24px]">
          {/* Header Row with 'mercado' active */}
          <Header initialActiveSection="mercado" />

          {/* Payment Form & NFTs Summary (separated by 32px from Navbar) */}
          <main className="w-full mt-[32px]">
            <PaymentDesktop
              cart={cart}
              isLoading={isLoading}
              isProcessing={isProcessing}
              isOutdatedQuote={isOutdatedQuote}
              paymentError={paymentError}
              onConfirmPurchase={handleConfirmPurchase}
            />
          </main>
        </div>

        {/* Reusable Footer (1200px wide, separated by 96px) */}
        <div className="w-full max-w-[1200px] mx-auto mt-[96px]">
          <Footer />
        </div>
      </div>

      {/* Order Confirmation Modal (from Desktop_Confirmacao_De_Pedido.css) */}
      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false)
          navigate({ to: '/' })
        }}
        transactionId={confirmedOrder?.transactionId}
        date={confirmedOrder?.date}
        totalEth={confirmedOrder?.totalEth}
        walletName={confirmedOrder?.walletName}
        cart={cart}
      />
    </div>
  )
}
