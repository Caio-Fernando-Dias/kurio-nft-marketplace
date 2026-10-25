import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { HomePage } from './HomePage'
import { LoginModalDesktop } from '../components/auth/LoginModalDesktop'
import { LoginMobile } from '../components/auth/LoginMobile'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate({ to: '/' })
  }

  const handleSuccess = () => {
    navigate({ to: '/' })
  }

  return (
    <main className="w-full min-h-screen bg-[#140D0A] font-mono">
      {/* Visualização Mobile (< 768px): Tela dedicada de login conforme Mobile_Login.css */}
      <div className="block md:hidden">
        <LoginMobile onSuccess={handleSuccess} />
      </div>

      {/* Visualização Desktop (>= 768px): Modal sobreposto ao Marketplace conforme Desktop_Login.css */}
      <div className="hidden md:block relative w-full min-h-screen overflow-x-hidden">
        {/* Fundo do Marketplace (desabilitando interatividade direta enquanto modal está aberto) */}
        <div className="pointer-events-none select-none opacity-90 filter blur-[0.5px]">
          <HomePage filters={{ category: 'all', sort: 'recent', page: 1 }} onFilterChange={() => {}} />
        </div>

        {/* Backdrop Scrim escurecido com blur suave */}
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-[#0A0503]/80 backdrop-blur-[2px] z-50 flex items-center justify-center p-6 animate-in fade-in duration-200"
        >
          {/* Container do Modal com stopPropagation para não fechar ao clicar dentro */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <LoginModalDesktop onClose={handleClose} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </main>
  )
}
