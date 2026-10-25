import React from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { CartDesktop } from '../components/cart/CartDesktop'
import { CartMobile } from '../components/cart/CartMobile'
import { useCart } from '../hooks/useCart'

export const CartPage: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeItem } = useCart()

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono selection:bg-[#E89B55] selection:text-[#140D0A]">
      {/* MOBILE VIEW (< md) */}
      <div className="block md:hidden">
        <CartMobile
          cart={cart}
          isLoading={isLoading}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      </div>

      {/* DESKTOP VIEW (>= md) */}
      <div className="hidden md:flex flex-col items-center w-full">
        {/* Main 1200px Content Container */}
        <div className="w-full max-w-[1200px] mx-auto pt-[24px]">
          {/* Header with 'mercado' active as specified in Figma */}
          <Header initialActiveSection="mercado" />

          {/* Cart Desktop Body & Related Items (separated from Navbar by exactly 32px) */}
          <main className="w-full mt-[32px]">
            <CartDesktop
              cart={cart}
              isLoading={isLoading}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </main>
        </div>

        {/* Reusable Footer (1200px wide, separated by 96px) */}
        <div className="w-full max-w-[1200px] mx-auto mt-[96px]">
          <Footer />
        </div>
      </div>
    </div>
  )
}
