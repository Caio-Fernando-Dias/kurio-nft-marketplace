import React from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono flex flex-col justify-between">
      <div className="w-full max-w-[1200px] mx-auto pt-6 px-4">
        <Header initialActiveSection="inicio" />
      </div>

      <main className="w-full max-w-[600px] mx-auto my-24 p-8 bg-[#241612] border border-[#3F2319] rounded-2xl flex flex-col items-center text-center gap-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#140D0A] border border-[#D28A4C]/40 flex items-center justify-center text-[#E89B55]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold text-[#D28A4C]">404</span>
        <h1 className="text-xl font-bold text-[#F5F1EB]">Página não encontrada</h1>
        <p className="text-sm text-[#CFB28C] leading-relaxed">
          O caminho solicitado não existe ou foi movido. Verifique o endereço digitado ou retorne ao catálogo.
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          className="px-8 py-3 bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Voltar para o Início
        </button>
      </main>

      <div className="w-full max-w-[1200px] mx-auto px-4">
        <Footer />
      </div>
    </div>
  )
}
