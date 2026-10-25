import React from 'react'
import { ArrowRight } from 'lucide-react'

export const PromoBanners: React.FC = () => {
  return (
    <section
      aria-label="Destaques especiais"
      className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-[28px] font-mono"
    >
      {/* 
        Card 1: Promo Card — Genesis Drops
        Figma Desktop_Inicio: 586x250px, background: #241612, border-radius: 8px
        Left: artwork 292x250px (rounded: 18px)
        Right: text right-aligned + EXPLORAR button (140x40px)
      */}
      <div className="w-full md:flex-1 min-w-0 max-w-full md:max-w-[586px] min-h-[250px] bg-[#241612] rounded-[8px] overflow-hidden border border-[#3F2319]/40 shadow-xl relative group flex flex-col sm:flex-row items-center">
        {/* Decorative Ellipses in background (Figma Ellipse 7 & 8) */}
        <div className="hidden md:block absolute -left-[191px] top-[142px] w-[256px] h-[256px] rounded-full border-2 border-[#D28A4C]/40 pointer-events-none z-0" />
        <div className="hidden md:block absolute -left-[199px] top-[134px] w-[256px] h-[256px] rounded-full border border-[#D28A4C]/25 pointer-events-none z-0" />

        {/* Artwork: left flex column */}
        <div className="w-full sm:w-[220px] md:w-[210px] lg:w-[250px] xl:w-[292px] h-[220px] sm:h-[250px] rounded-[14px] sm:rounded-[18px] overflow-hidden shrink-0 bg-[#140D0A] z-10">
          <img
            src="/assets/image.png"
            alt="Lançamentos gênesis de edição limitada"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content Right: right flex column with flex-1 min-w-0 to NEVER overlap image */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 flex flex-col items-end justify-between self-stretch text-right z-10 w-full">
          <div className="flex flex-col items-end w-full">
            <h3 className="text-[16px] lg:text-[18px] font-bold leading-[22px] lg:leading-[24px] text-[#F5F1EB] text-right">
              Lançamentos gênesis<br className="hidden sm:inline" /> de edição limitada
            </h3>
            <p className="text-[13px] lg:text-[14px] font-normal leading-[20px] lg:leading-[24px] text-[#CFB28C] text-right mt-2 line-clamp-3">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
          </div>

          <button
            type="button"
            className="w-[130px] lg:w-[140px] h-[38px] lg:h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-95 text-[#140D0A] font-medium text-[13px] lg:text-[14px] leading-[20px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 mt-3"
          >
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4 text-[#140D0A]" />
          </button>
        </div>
      </div>

      {/* 
        Card 2: Promo Card — Curated Art (Arte digital selecionada e muito mais)
        Figma Desktop_Inicio: 586x250px, background: #241612, border-radius: 8px
        Left: artwork 287x250px (rounded: 17px)
        Right: text right-aligned + EXPLORAR button (140x40px)
      */}
      <div className="w-full md:flex-1 min-w-0 max-w-full md:max-w-[586px] min-h-[250px] bg-[#241612] rounded-[8px] overflow-hidden border border-[#3F2319]/40 shadow-xl relative group flex flex-col sm:flex-row items-center">
        {/* Decorative Ellipses in background (Figma Ellipse 7 & 8) */}
        <div className="hidden md:block absolute -left-[191px] top-[142px] w-[256px] h-[256px] rounded-full border-2 border-[#D28A4C]/40 pointer-events-none z-0" />
        <div className="hidden md:block absolute -left-[199px] top-[134px] w-[256px] h-[256px] rounded-full border border-[#D28A4C]/25 pointer-events-none z-0" />

        {/* Artwork: left flex column */}
        <div className="w-full sm:w-[220px] md:w-[210px] lg:w-[250px] xl:w-[287px] h-[220px] sm:h-[250px] rounded-[14px] sm:rounded-[17px] overflow-hidden shrink-0 bg-[#140D0A] z-10">
          <img
            src="/assets/image3.png"
            alt="Arte digital selecionada e muito mais"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content Right: right flex column with flex-1 min-w-0 to NEVER overlap image */}
        <div className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 flex flex-col items-end justify-between self-stretch text-right z-10 w-full">
          <div className="flex flex-col items-end w-full">
            <h3 className="text-[16px] lg:text-[18px] font-bold leading-[22px] lg:leading-[24px] text-[#F5F1EB] text-right">
              Arte digital selecionada<br className="hidden sm:inline" /> e muito mais
            </h3>
            <p className="text-[13px] lg:text-[14px] font-normal leading-[20px] lg:leading-[24px] text-[#CFB28C] text-right mt-2 line-clamp-3">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
          </div>

          <button
            type="button"
            className="w-[130px] lg:w-[140px] h-[38px] lg:h-[40px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-95 text-[#140D0A] font-medium text-[13px] lg:text-[14px] leading-[20px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 mt-3"
          >
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4 text-[#140D0A]" />
          </button>
        </div>
      </div>
    </section>
  )
}
