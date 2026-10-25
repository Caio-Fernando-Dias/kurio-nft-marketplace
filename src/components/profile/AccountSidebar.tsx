import React from 'react'
import {
  User,
  Wallet,
  ShoppingBag,
  Heart,
  Activity,
  Download,
  AlertTriangle,
  LogOut,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../../hooks/useAuth'

export type SidebarTab =
  | 'perfil'
  | 'carteiras'
  | 'atividade'
  | 'watchlist'
  | 'ofertas'
  | 'downloads'
  | 'suporte'

interface AccountSidebarProps {
  activeTab: SidebarTab
  onTabChange?: (tab: SidebarTab) => void
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleTabClick = (tabId: SidebarTab) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
    if (tabId === 'perfil') {
      navigate({ to: '/perfil' })
    } else if (tabId === 'carteiras') {
      navigate({ to: '/carteiras' })
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const sidebarItems: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'perfil',
      label: 'Detalhes do perfil',
      icon: <User className="w-[18px] h-[18px]" />,
    },
    {
      id: 'carteiras',
      label: 'Carteiras',
      icon: <Wallet className="w-[18px] h-[18px]" />,
    },
    {
      id: 'atividade',
      label: 'Atividade',
      icon: <ShoppingBag className="w-[18px] h-[18px]" />,
    },
    {
      id: 'watchlist',
      label: 'Lista de observação',
      icon: <Heart className="w-[16px] h-[16px]" />,
    },
    {
      id: 'ofertas',
      label: 'Ofertas',
      icon: <Activity className="w-[18px] h-[18px]" />,
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: <Download className="w-[18px] h-[18px]" />,
    },
    {
      id: 'suporte',
      label: 'Suporte',
      icon: <AlertTriangle className="w-[18px] h-[18px]" />,
    },
  ]

  return (
    <aside className="w-full md:w-[310px] bg-[#241612] py-[8px] rounded-[6px] shrink-0 border border-[#3F2319]/40 flex flex-col font-mono">
      {/* Título da Sidebar: Meu perfil */}
      <div className="px-[16px] py-[10px]">
        <h2 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
          Meu perfil
        </h2>
      </div>

      {/* Lista de Navegação da Conta */}
      <nav aria-label="Navegação da conta" className="flex flex-col">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`h-[45px] px-[16px] flex items-center gap-[12px] text-left transition-colors cursor-pointer ${
                isActive
                  ? 'border-l-[6px] border-[#D28A4C] bg-[#2F1D15]/40 text-[#E89B55]'
                  : 'text-[#CFB28C] hover:text-[#E89B55] hover:bg-[#2F1D15]/20'
              }`}
            >
              <span className={isActive ? 'text-[#D28A4C]' : 'text-[#B39463]'}>
                {item.icon}
              </span>
              <span className="text-[15px] leading-[45px] font-normal truncate">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Linha Divisória interna */}
      <div className="w-full border-t border-[#D28A4C]/30 my-[8px]" />

      {/* Ação Sair */}
      <button
        type="button"
        onClick={handleLogout}
        className="h-[40px] px-[16px] flex items-center gap-[8px] text-[#E89B55] hover:text-[#D28A4C] cursor-pointer transition-colors"
      >
        <LogOut className="w-[18px] h-[18px] text-[#D28A4C]" />
        <span className="text-[15px] font-bold leading-[15px]">Sair</span>
      </button>
    </aside>
  )
}
