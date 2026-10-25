import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { LoginModalDesktop } from './LoginModalDesktop'
import { LoginMobile } from './LoginMobile'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'
import { Lock } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackTitle?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackTitle = 'Acesso Restrito',
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [showLoginModal, setShowLoginModal] = React.useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#140D0A] flex items-center justify-center font-mono text-[#F5F1EB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D28A4C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#CFB28C]">Verificando autenticação...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col justify-between">
        {/* Desktop View */}
        <div className="hidden md:flex flex-col items-center w-full">
          <div className="w-full max-w-[1200px] mx-auto pt-6">
            <Header initialActiveSection="inicio" />
          </div>

          <main className="w-full max-w-[600px] mx-auto my-24 p-8 bg-[#241612] border border-[#3F2319] rounded-2xl flex flex-col items-center text-center gap-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#140D0A] border border-[#D28A4C]/40 flex items-center justify-center text-[#E89B55]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#F5F1EB]">{fallbackTitle}</h2>
            <p className="text-sm text-[#CFB28C] leading-relaxed">
              Esta seção exige autenticação ativa na Kurio. Faça login com suas credenciais para continuar sua sessão com segurança.
            </p>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="px-8 py-3 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-sm uppercase tracking-wider rounded-md transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Fazer Login / Cadastrar
            </button>
          </main>

          <div className="w-full max-w-[1200px] mx-auto">
            <Footer />
          </div>

          {showLoginModal && (
            <div
              onClick={() => setShowLoginModal(false)}
              className="fixed inset-0 bg-[#0A0503]/80 backdrop-blur-[2px] z-50 flex items-center justify-center p-6 animate-in fade-in duration-200"
            >
              <div onClick={(e) => e.stopPropagation()} className="relative">
                <LoginModalDesktop
                  onClose={() => setShowLoginModal(false)}
                  onSuccess={() => setShowLoginModal(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="block md:hidden w-full p-6">
          <div className="w-full py-16 flex flex-col items-center text-center gap-5 bg-[#241612] border border-[#3F2319] rounded-2xl p-6 my-10">
            <div className="w-12 h-12 rounded-full bg-[#140D0A] border border-[#D28A4C]/40 flex items-center justify-center text-[#E89B55]">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#F5F1EB]">{fallbackTitle}</h2>
            <p className="text-xs text-[#CFB28C] leading-relaxed">
              Autenticação obrigatória para acessar sua carteira e perfil.
            </p>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3 bg-[#D28A4C] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md"
            >
              Entrar na conta
            </button>
          </div>

          {showLoginModal && (
            <div className="fixed inset-0 bg-[#140D0A] z-50 overflow-y-auto">
              <LoginMobile onSuccess={() => setShowLoginModal(false)} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
