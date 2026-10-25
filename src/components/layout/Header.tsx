import React, { useState } from 'react'
import { Search, ShoppingCart, LogIn, LogOut, SlidersHorizontal, User, Wallet } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onOpenMobileFilters?: () => void
  initialActiveSection?: NavSection
}

type NavSection = 'inicio' | 'mercado' | 'criadores' | 'aprenda'

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  onOpenMobileFilters,
  initialActiveSection = 'inicio',
}) => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { count: cartCount } = useCart()
  const [activeSection, setActiveSection] = useState<NavSection>(initialActiveSection)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks: { id: NavSection; label: string; href: string }[] = [
    { id: 'inicio', label: 'Início', href: '/' },
    { id: 'mercado', label: 'Mercado', href: '#catalogo' },
    { id: 'criadores', label: 'Criadores', href: '#criadores' },
    { id: 'aprenda', label: 'Aprenda', href: '#aprenda' },
  ]

  return (
    <header className="w-full flex flex-col font-mono">
      {/* 
        DESKTOP HEADER (>= 768px):
        - Height: 45px with hairline baseline: border: 0.3px solid #D28A4C
        - 32px spacing down to the hairline divider
        - Active underline: 3px solid #D28A4C, sits flush on baseline with zero gap
        - Active link text: #E89B55 (weight 700)
        - Inactive link text: #F5F1EB (weight 400)
        - Action buttons gap: 28px
      */}
      <div className="hidden md:flex relative w-full items-end justify-between border-b border-[#D28A4C]/30">
        {/* Logo: KURIO (14px Bold, letter-spacing 0.1em, #F5F1EB) */}
        <a
          href="/"
          className="pb-[32px] text-[14px] font-bold leading-[18px] tracking-[0.1em] uppercase text-[#F5F1EB] hover:text-[#E89B55] transition-colors"
        >
          KURIO
        </a>

        {/* Central Nav Links: gap 40px */}
        <nav aria-label="Navegação principal" className="flex items-center gap-[40px] text-[16px] leading-[21px]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={`relative pb-[32px] transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'font-bold text-[#E89B55]'
                    : 'font-normal text-[#F5F1EB] hover:text-[#E89B55]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-1.5px] left-0 right-0 h-[3px] bg-[#D28A4C] z-10" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right Actions: gap 28px */}
        <div className="pb-[32px] flex items-center gap-[28px]">
          {/* Search Trigger */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#241612] border border-[#D28A4C] rounded-md px-3 py-1 transition-all">
                <Search className="w-4 h-4 text-[#E89B55] mr-2 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-transparent text-xs text-[#F5F1EB] outline-none w-32 font-mono placeholder:text-[#CFB28C]"
                  onBlur={() => {
                    if (!searchQuery) setIsSearchOpen(false)
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Buscar"
                className="text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer p-0.5"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart Icon with badge count */}
          <a
            href="/carrinho"
            aria-label={`Carrinho com ${cartCount || 6} itens`}
            className="relative text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer p-0.5 flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#D28A4C] border-2 border-[#140D0A] text-[#140D0A] font-medium text-[10px] rounded-full flex items-center justify-center font-mono leading-none">
              {cartCount > 0 ? cartCount : 6}
            </span>
          </a>

          {/* Login / User button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-0.5 rounded-full border border-[#3F2319] hover:border-[#D28A4C] transition-all cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#241612] border border-[#3F2319] rounded-lg shadow-2xl p-2 z-50 flex flex-col gap-1 font-mono">
                  <div className="px-3 py-2 border-b border-[#3F2319]">
                    <div className="text-xs font-semibold text-[#F5F1EB] truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-[#CFB28C] truncate">
                      {user.walletAddress || user.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false)
                      navigate({ to: '/perfil' })
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F5F1EB] hover:text-[#E89B55] hover:bg-[#38220F] rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#D28A4C]" />
                    <span>Meu perfil</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false)
                      navigate({ to: '/carteiras' })
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F5F1EB] hover:text-[#E89B55] hover:bg-[#38220F] rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5 text-[#D28A4C]" />
                    <span>Carteiras</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowUserMenu(false)
                      await logout()
                      navigate({ to: '/' })
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#E89B55] hover:bg-[#38220F] rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="w-[100px] h-[35px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-95 text-[#140D0A] font-medium text-[16px] leading-[21px] rounded-[6px] transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              <LogIn className="w-5 h-5 stroke-[1.8]" />
              <span>Entrar</span>
            </a>
          )}
        </div>
      </div>

      {/* 
        MOBILE TOP BAR (< 768px) matching Mobile_Inicio.css:
        - Search box: 313px height 45px bg #241612 rounded-[10px] with "Explorar coleções" in #B39463
        - Filter button: 45x45px gradient rounded-[14px] with filter icon
      */}
      <div className="flex md:hidden items-center justify-between gap-3 w-full max-w-[366px] mx-auto h-[45px]">
        {/* Search Input Box */}
        <div className="flex-1 h-[45px] bg-[#241612] rounded-[10px] px-3 flex items-center gap-2 border border-[#3F2319]/40">
          <Search className="w-5 h-5 text-[#B39463] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Explorar coleções"
            className="w-full bg-transparent text-[14px] font-bold text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
          />
        </div>

        {/* Filter Drawer Trigger Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          aria-label="Filtrar NFTs"
          className="w-[45px] h-[45px] rounded-[14px] flex items-center justify-center shrink-0 cursor-pointer shadow-md active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(137.05deg, rgba(210, 138, 76, 0.45) -24.6%, #D28A4C 100%)',
          }}
        >
          <SlidersHorizontal className="w-5 h-5 text-[#140D0A]" />
        </button>
      </div>
    </header>
  )
}
