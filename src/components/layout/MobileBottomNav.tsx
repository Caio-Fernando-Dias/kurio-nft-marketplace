import React from 'react'
import { Home, Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

export const MobileBottomNav: React.FC = () => {
  const { count: cartCount } = useCart()
  const { isAuthenticated } = useAuth()

  return (
    <nav
      aria-label="Navegação inferior mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#241612] px-6 h-[72px] flex items-center justify-between border-t border-[#3F2319]/50 shadow-[0px_-10px_30px_rgba(10,6,4,0.45)]"
    >
      {/* Home (Active in #E89B55) */}
      <a
        href="/"
        aria-label="Início"
        className="flex flex-col items-center justify-center text-[#E89B55] transition-colors p-2"
      >
        <Home className="w-6 h-6 fill-current" />
      </a>

      {/* Favorites / Heart (Vector in #CFB28C) */}
      <a
        href="#favoritos"
        aria-label="Favoritos"
        className="flex flex-col items-center justify-center text-[#CFB28C] hover:text-[#E89B55] transition-colors p-2"
      >
        <Heart className="w-6 h-6 fill-current" />
      </a>

      {/* Center Action Button (Ellipse 39: 65x65px) */}
      <div className="-mt-7">
        <button
          type="button"
          aria-label="Ação rápida de cunhagem e exploração"
          className="w-[65px] h-[65px] rounded-full text-[#F5F1EB] flex items-center justify-center shadow-2xl border-4 border-[#140D0A] active:scale-95 transition-transform cursor-pointer"
          style={{
            background: 'linear-gradient(180deg, rgba(210, 138, 76, 0.4) -16.92%, #D28A4C 109.23%)',
          }}
        >
          {/* Custom scan / aperture icon matching Figma lines 1845-1919 */}
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9V6C4 4.89543 4.89543 4 6 4H9" stroke="#F5F1EB" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M17 4H20C21.1046 4 22 4.89543 22 6V9" stroke="#F5F1EB" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M22 17V20C22 21.1046 21.1046 22 20 22H17" stroke="#F5F1EB" strokeWidth="2.4" strokeLinecap="round"/>
            <path d="M9 22H6C4.89543 22 4 21.1046 4 20V17" stroke="#F5F1EB" strokeWidth="2.4" strokeLinecap="round"/>
            <line x1="6.5" y1="13" x2="19.5" y2="13" stroke="#F5F1EB" strokeWidth="2.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Cart / Shop */}
      <a
        href="/carrinho"
        aria-label={`Carrinho com ${cartCount} itens`}
        className="relative flex flex-col items-center justify-center text-[#CFB28C] hover:text-[#E89B55] transition-colors p-2"
      >
        <ShoppingCart className="w-6 h-6 fill-current" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-0 min-w-[16px] h-[16px] px-1 bg-[#D28A4C] border border-[#140D0A] text-[#140D0A] font-bold text-[9px] rounded-full flex items-center justify-center font-mono">
            {cartCount}
          </span>
        )}
      </a>

      {/* Profile */}
      <a
        href={isAuthenticated ? "/perfil" : "/login"}
        aria-label={isAuthenticated ? "Meu Perfil" : "Entrar na conta"}
        className="flex flex-col items-center justify-center text-[#CFB28C] hover:text-[#E89B55] transition-colors p-2"
      >
        <User className="w-6 h-6 fill-current" />
      </a>
    </nav>
  )
}
