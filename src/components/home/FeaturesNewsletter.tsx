import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

export const FeaturesNewsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <section
      aria-label="Diferenciais e Newsletter"
      className="w-full max-w-[1200px] bg-[#241612] rounded-none p-[24px] lg:p-[32px] border border-[#3F2319]/40 shadow-xl font-mono"
    >
      {/* 
        Desktop: Frame 122 -> Frame 100
        4 columns separated by 3 vertical dividers (#D28A4C)
      */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
        {/* Feature 1 - W: Segurança da carteira */}
        <div className="w-full lg:w-[264px] flex flex-col gap-[12px] lg:pr-6 shrink-0">
          <div className="w-[74px] h-[74px] rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-[24px] leading-[32px] shrink-0">
            W
          </div>
          <h3 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB] mt-1 whitespace-nowrap">
            Segurança da carteira
          </h3>
          <p className="w-full max-w-[204px] text-[14px] font-normal leading-[22px] text-[#CFB28C]">
            Proteja sua carteira e colecione arte digital verificada com confiança.
          </p>
        </div>

        {/* Divisor 1 - Barra vertical fixa idêntica (202px de altura) */}
        <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0" />

        {/* Feature 2 - C: Criadores em destaque */}
        <div className="w-full lg:w-[264px] flex flex-col gap-[12px] lg:px-6 shrink-0">
          <div className="w-[74px] h-[74px] rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-[24px] leading-[32px] shrink-0">
            C
          </div>
          <h3 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB] mt-1 whitespace-nowrap">
            Criadores em destaque
          </h3>
          <p className="w-full max-w-[204px] text-[14px] font-normal leading-[22px] text-[#CFB28C]">
            Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
          </p>
        </div>

        {/* Divisor 2 - Barra vertical fixa idêntica (202px de altura) */}
        <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0" />

        {/* Feature 3 - D: Alertas de lançamentos */}
        <div className="w-full lg:w-[264px] flex flex-col gap-[12px] lg:px-6 shrink-0">
          <div className="w-[74px] h-[74px] rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-[24px] leading-[32px] shrink-0">
            D
          </div>
          <h3 className="text-[17px] font-bold leading-[16px] text-[#F5F1EB] mt-1 whitespace-nowrap">
            Alertas de lançamentos
          </h3>
          <p className="w-full max-w-[204px] text-[14px] font-normal leading-[22px] text-[#CFB28C]">
            Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
          </p>
        </div>

        {/* Divisor 3 - Barra vertical fixa idêntica (202px de altura) */}
        <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0" />

        {/* Feature 4: Newsletter */}
        <div className="w-full lg:w-[357px] flex flex-col gap-[12px] lg:pl-6 shrink-0">
          <h3 className="text-[18px] font-bold leading-[32px] text-[#F5F1EB]">
            Antecipe-se ao próximo lançamento
          </h3>

          {subscribed ? (
            <div className="h-[40px] px-3 bg-[#38220F] rounded-[6px] flex items-center gap-2 text-[#E89B55] text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Inscrição realizada com sucesso!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full h-[40px] bg-[#38220F] rounded-[6px] flex items-center shadow-[0px_0px_20px_rgba(10,6,4,0.45)] overflow-hidden border border-[#55321F]/50"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="digite seu e-mail..."
                required
                className="flex-1 min-w-0 bg-transparent text-[13px] md:text-[14px] font-normal text-[#F5F1EB] placeholder:text-[#B39463] px-3 outline-none"
              />
              <button
                type="submit"
                className="px-4 h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[16px] flex items-center justify-center cursor-pointer transition-colors shrink-0 whitespace-nowrap"
              >
                Enviar
              </button>
            </form>
          )}

          <p className="text-[13px] font-normal leading-[22px] text-[#CFB28C]">
            Receba drops selecionados, histórias de criadores e recompensas para colecionadores na sua caixa de entrada.
          </p>
        </div>
      </div>
    </section>
  )
}
