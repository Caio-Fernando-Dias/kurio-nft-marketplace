import React, { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PaymentDesktop } from '../components/payment/PaymentDesktop'
import { OrderConfirmationModal } from '../components/payment/OrderConfirmationModal'
import { useCart } from '../hooks/useCart'
import { useNavigate } from '@tanstack/react-router'

export const OrderConfirmationPage: React.FC = () => {
  const { cart, isLoading } = useCart()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono selection:bg-[#E89B55] selection:text-[#140D0A] relative">
      {/* DESKTOP VIEW (Order Confirmation screen from Desktop_Confirmacao_De_Pedido.css) */}
      <div className="hidden md:flex flex-col items-center w-full">
        {/* Main 1200px Content Container */}
        <div className="w-full max-w-[1200px] mx-auto pt-[24px]">
          {/* Header Row with 'mercado' active */}
          <Header initialActiveSection="mercado" />

          {/* Payment Form & NFTs Summary background behind the modal */}
          <main className="w-full mt-[32px] opacity-40 pointer-events-none select-none filter blur-[1px]">
            <PaymentDesktop
              cart={cart}
              isLoading={isLoading}
              onConfirmPurchase={() => setIsOpen(true)}
            />
          </main>
        </div>

        {/* Footer staying below scrim */}
        <div className="w-full max-w-[1200px] mx-auto mt-[96px] opacity-40 pointer-events-none select-none">
          <Footer />
        </div>
      </div>

      {/* MOBILE FALLBACK: redirect or simple confirmation */}
      <div className="block md:hidden p-6 text-center">
        <OrderConfirmationModal
          isOpen={isOpen}
          onClose={handleClose}
          cart={cart}
        />
      </div>

      {/* The Desktop Modal (matches Desktop_Confirmacao_De_Pedido.css lines 5693-7674) */}
      <div className="hidden md:block">
        <OrderConfirmationModal
          isOpen={isOpen}
          onClose={handleClose}
          cart={cart}
        />
      </div>
    </div>
  )
}
