import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onExploreClick?: () => void
}

const HERO_SLIDES = [
  {
    id: 1,
    image: '/assets/image.png',
    title: 'Emerald Ape #042 - Obra em destaque',
  },
  {
    id: 2,
    image: '/assets/image2.png',
    title: 'Sage Nomad #009 - Obra em destaque',
  },
  {
    id: 3,
    image: '/assets/image3.png',
    title: 'Neon Vessel #552 - Obra em destaque',
  },
]

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <section aria-label="Destaque principal" className="w-full relative font-mono">
      {/* 
        DESKTOP HERO (>= 768px):
        - Container: width 1200px, height 450px, padding: 0 0 0 40px
        - Left: 600px, botão próximo ao texto
        - 3 bolinhas funcionais para alternar entre as artes de NFT
        - Right artwork: 450x450px, radius: 24px
      */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[1200px] h-auto lg:h-[450px] pl-4 lg:pl-[40px] pr-0 mx-auto gap-8">
        {/* Left Column: 600px max, flex-1 com botão próximo do texto */}
        <div className="w-full max-w-[600px] flex-1 flex flex-col items-start gap-[20px]">
          {/* Text block */}
          <div className="flex flex-col items-start gap-[8px]">
            <span className="text-[14px] font-medium leading-[16px] tracking-[0.1em] text-[#F5F1EB]">
              Bem-vindo à Kurio
            </span>

            <h1 className="text-[43px] font-bold text-[#F5F1EB] uppercase leading-[60px] lg:leading-[70px] whitespace-pre-line tracking-tight">
              SEJA DONO DO FUTURO{'\n'}DA ARTE DIGITAL
            </h1>

            <p className="text-[14px] font-normal leading-[24px] text-[#CFB28C] max-w-[557px] mt-[2px]">
              Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
            </p>
          </div>

          {/* Row: Button EXPLORAR próximo ao texto + 3 Bolinhas interativas */}
          <div className="w-full max-w-[600px] flex items-center justify-between mt-[4px]">
            <Button
              type="button"
              onClick={onExploreClick}
              className="w-[140px] h-[40px] px-[28px] py-[10px] bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-[16px] leading-[20px] rounded-[6px] shrink-0"
            >
              EXPLORAR
            </Button>

            {/* 3 Bolinhas interativas para trocar as imagens */}
            <div className="flex items-center gap-[6px] pr-[8px]">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Alternar para imagem ${idx + 1}: ${slide.title}`}
                  className="p-2 -m-1 inline-flex items-center justify-center cursor-pointer min-w-[28px] min-h-[28px]"
                >
                  <span
                    className={`transition-all duration-300 rounded-full block ${
                      activeSlide === idx
                        ? 'w-[22px] h-[8px] bg-[#D28A4C]'
                        : 'w-[8px] h-[8px] bg-[#D28A4C]/40 hover:bg-[#D28A4C]/80'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Artwork: 450x450px with 24px border radius */}
        <div className="w-[360px] h-[360px] lg:w-[450px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-2xl shrink-0 bg-[#241612] border border-[#3F2319]/40 relative">
          <img
            key={HERO_SLIDES[activeSlide].image}
            src={HERO_SLIDES[activeSlide].image}
            alt={HERO_SLIDES[activeSlide].title}
            width={450}
            height={450}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* 
        MOBILE HERO (< 768px) matching Mobile_Inicio.png and Mobile_Inicio.css:
        - Width: 366px, Height: 190px, border-radius: 24px
        - Background gradient with overlapping glowing ellipses
        - Left column: welcome text, title, description, EXPLORAR ->
        - Right: main artwork (138x138) + overlapping secondary artwork (58x58)
        - 3 dots centered horizontally at bottom
      */}
      <div
        className="md:hidden relative w-full max-w-[366px] h-[190px] mx-auto rounded-[24px] p-4 overflow-hidden border border-[#D28A4C]/20 flex flex-col justify-between"
        style={{
          background: 'linear-gradient(104.74deg, rgba(210, 138, 76, 0.2) 1.08%, rgba(210, 138, 76, 0.1) 99.23%)',
        }}
      >
        {/* Background Ellipses */}
        <div
          className="absolute -left-[80px] -top-[31px] w-[248px] h-[248px] rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(160.25deg, rgba(221, 154, 95, 0.43) 22.1%, rgba(210, 138, 76, 0.04) 87.42%)',
          }}
        />
        <div
          className="absolute left-[73px] -top-[10px] w-[248px] h-[248px] rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(160.25deg, rgba(221, 154, 95, 0.37) 22.1%, rgba(210, 138, 76, 0) 87.42%)',
          }}
        />

        {/* Content Row: Text + Artwork */}
        <div className="relative z-10 flex items-start justify-between w-full">
          {/* Left Text Content */}
          <div className="flex flex-col gap-[4px] max-w-[190px] shrink-0">
            <span className="text-[12px] font-medium leading-[16px] text-[#F5F1EB]">
              Bem-vindo à Kurio
            </span>

            <h2 className="text-[18px] font-bold leading-[24px] text-[#F5F1EB] uppercase whitespace-pre-line tracking-tight">
              SEJA DONO DA{'\n'}CULTURA DIGITAL
            </h2>

            <p className="text-[12px] font-normal leading-[17px] text-[#CFB28C] max-w-[185px]">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>

            <button
              type="button"
              onClick={onExploreClick}
              className="w-fit flex items-center gap-1.5 text-[12px] font-bold leading-[14px] text-[#E89B55] hover:text-[#D28A4C] mt-0.5 cursor-pointer transition-colors"
            >
              <span>EXPLORAR</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D28A4C]" />
            </button>
          </div>

          {/* Right Artworks (overlapping) */}
          <div className="relative w-[138px] h-[142px] shrink-0">
            {/* Main artwork: 138x138 */}
            <div className="absolute right-0 top-0 w-[138px] h-[138px] rounded-[16px] overflow-hidden shadow-lg border border-[#D28A4C]/30 bg-[#241612]">
              <img
                key={HERO_SLIDES[activeSlide].image}
                src={HERO_SLIDES[activeSlide].image}
                alt={HERO_SLIDES[activeSlide].title}
                width={138}
                height={138}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Overlapping secondary artwork: 58x58 */}
            <div className="absolute left-[-10px] bottom-0 w-[58px] h-[58px] rounded-[16px] overflow-hidden shadow-2xl border-2 border-[#140D0A] bg-[#241612] z-10">
              <img
                src={HERO_SLIDES[(activeSlide + 1) % HERO_SLIDES.length].image}
                alt="Obra secundária"
                width={58}
                height={58}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom 3 Dots Indicator: 7px circles horizontally centered */}
        <div className="relative z-10 flex items-center justify-center gap-[4px] w-full pt-1">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Alternar para imagem ${idx + 1}: ${slide.title}`}
              className="p-2 -m-1 inline-flex items-center justify-center cursor-pointer min-w-[24px] min-h-[24px]"
            >
              <span
                className={`w-[7px] h-[7px] rounded-full transition-all duration-300 block ${
                  activeSlide === idx
                    ? 'bg-[#D28A4C]'
                    : 'bg-[#D28A4C]/40 hover:bg-[#D28A4C]/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
