import React, { useState } from 'react'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer aria-label="Rodapé do site" className="w-full max-w-[1200px] mx-auto flex flex-col font-mono pb-24 md:pb-12 text-[#F5F1EB]">
      {/* 
        Container Unificado do Footer (Figma Desktop_Inicio: 1200x610px)
        Os três blocos são totalmente juntos/conectados sem gap:
        1. Topo (#241612): Diferenciais (W, C, D) + Newsletter (4 colunas com divisores)
        2. Meio (#38220F): Marca Kurio, slogan e canais de contato
        3. Base (#241612): 4 colunas de links, redes sociais oficiais e carteiras compatíveis
      */}
      <div className="w-full flex flex-col rounded-none border border-[#3F2319]/40 shadow-2xl overflow-hidden">
        {/* ============================================================== */}
        {/* PARTE 1: Frame 122 - Diferenciais e Newsletter (4 Colunas)    */}
        {/* ============================================================== */}
        <div className="w-full bg-[#241612] p-6 lg:p-[32px] border-b border-[#3F2319]/60">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
            {/* Coluna 1: W - Segurança da carteira */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-[12px] lg:pr-6">
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
            <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0 self-center" />

            {/* Coluna 2: C - Criadores em destaque */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-[12px] lg:px-6">
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
            <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0 self-center" />

            {/* Coluna 3: D - Alertas de lançamentos */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-[12px] lg:px-6">
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
            <div className="hidden lg:block w-[1px] h-[202px] bg-[#D28A4C] shrink-0 self-center" />

            {/* Coluna 4: Newsletter */}
            <div className="w-full lg:flex-[1.25] min-w-0 flex flex-col gap-[12px] lg:pl-6">
              <h3 className="text-[18px] font-bold leading-[32px] text-[#F5F1EB]">
                Antecipe-se ao próximo lançamento
              </h3>

              <form
                onSubmit={handleSubmit}
                className="w-full max-w-[325px] h-[40px] bg-[#38220F] rounded-[6px] flex items-center shadow-[0px_0px_20px_rgba(10,6,4,0.45)] overflow-hidden border border-[#55321F]/50"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="digite seu e-mail..."
                  required
                  className="flex-1 min-w-0 bg-transparent text-[13px] font-normal text-[#F5F1EB] placeholder:text-[#B39463] px-3 outline-none"
                />
                <button
                  type="submit"
                  className="w-[85px] h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[18px] flex items-center justify-center cursor-pointer transition-colors shrink-0 whitespace-nowrap rounded-r-[6px]"
                >
                  Enviar
                </button>
              </form>

              {subscribed && (
                <p className="text-[12px] text-[#D28A4C] font-semibold">
                  ✓ Obrigado por se inscrever!
                </p>
              )}

              <p className="text-[13px] font-normal leading-[22px] text-[#CFB28C]">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PARTE 2: Frame 120 - Faixa de Contato Kurio (#38220F)         */}
        {/* ============================================================== */}
        <div className="w-full bg-[#38220F] px-6 py-6 lg:p-[32px] border-b border-[#55321F]/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[64px] items-center">
            {/* Coluna 1: KURIO (alinhado com Meu perfil) */}
            <div className="flex items-center">
              <span className="text-[14px] font-bold leading-[18px] tracking-[0.1em] uppercase text-[#F5F1EB]">
                KURIO
              </span>
            </div>

            {/* Coluna 2: Feito para colecionadores... (alinhado com Central de ajuda) */}
            <div className="flex items-center">
              <span className="text-[14px] font-normal leading-[22px] text-[#F5F1EB] text-left">
                Feito para colecionadores,<br />criadores e cultura
              </span>
            </div>

            {/* Coluna 3: contato@email.com (alinhado com Coleções) */}
            <div className="flex items-center">
              <a
                href="mailto:contato@email.com"
                className="text-[14px] font-normal leading-[22px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors"
              >
                contato@email.com
              </a>
            </div>

            {/* Coluna 4: +55 11 4002 8922 (alinhado com Redes sociais) */}
            <div className="flex items-center">
              <span className="text-[14px] font-normal leading-[22px] text-[#F5F1EB]">
                +55 11 4002 8922
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PARTE 3: Frame 117 - Grade de Navegação e Links (#241612)      */}
        {/* ============================================================== */}
        <div className="w-full bg-[#241612] px-6 py-8 lg:p-[32px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-[64px]">
          {/* Coluna 1: Meu perfil (em português) */}
          <div className="flex flex-col gap-[8px]">
            <h4 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB] mb-1">
              Meu perfil
            </h4>
            <ul className="flex flex-col text-[14px] leading-[30px] text-[#F5F1EB]">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Meu perfil</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Minha coleção</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Atividade</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Estúdio do criador</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Lista de interesse</a></li>
            </ul>
          </div>

          {/* Coluna 2: Central de ajuda (em português) */}
          <div className="flex flex-col gap-[8px]">
            <h4 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB] mb-1">
              Central de ajuda
            </h4>
            <ul className="flex flex-col text-[14px] leading-[30px] text-[#F5F1EB]">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Como comprar NFTs</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Carteira e segurança</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Política do mercado</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Denunciar item</a></li>
            </ul>
          </div>

          {/* Coluna 3: Coleções (em português) */}
          <div className="flex flex-col gap-[8px]">
            <h4 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB] mb-1">
              Coleções
            </h4>
            <ul className="flex flex-col text-[14px] leading-[30px] text-[#F5F1EB]">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Arte digital</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Fotografia</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Música</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Arte 3D</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Utilidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Redes sociais e Carteiras compatíveis */}
          <div className="flex flex-col gap-[28px]">
            {/* Redes sociais com ícones oficiais */}
            <div className="flex flex-col gap-[16px]">
              <h4 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
                Redes sociais
              </h4>
              <div className="flex items-center gap-[10px]">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-[30px] h-[30px] rounded-[4px] border border-[#D28A4C] hover:bg-[#D28A4C] text-[#D28A4C] hover:text-[#140D0A] flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* 2. Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-[30px] h-[30px] rounded-[4px] border border-[#D28A4C] hover:bg-[#D28A4C] text-[#D28A4C] hover:text-[#140D0A] flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* 3. Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="w-[30px] h-[30px] rounded-[4px] border border-[#D28A4C] hover:bg-[#D28A4C] text-[#D28A4C] hover:text-[#140D0A] flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 4. LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-[30px] h-[30px] rounded-[4px] border border-[#D28A4C] hover:bg-[#D28A4C] text-[#D28A4C] hover:text-[#140D0A] flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* 5. YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-[30px] h-[30px] rounded-[4px] border border-[#D28A4C] hover:bg-[#D28A4C] text-[#D28A4C] hover:text-[#140D0A] flex items-center justify-center transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Carteiras compatíveis separadas por bullet points */}
            <div className="flex flex-col gap-[10px]">
              <h4 className="text-[18px] font-bold leading-[16px] text-[#F5F1EB]">
                Carteiras compatíveis
              </h4>
              <div className="w-full max-w-[228px] h-[26px] bg-[#38220F] border border-[#55321F] rounded-[6px] flex items-center justify-center px-2">
                <span className="text-[9px] font-bold leading-none tracking-[0.1px] text-[#E89B55] uppercase whitespace-nowrap">
                  METAMASK • WALLETCONNECT • COINBASE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full text-center py-6 text-[14px] leading-[30px] text-[#F5F1EB]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  )
}
