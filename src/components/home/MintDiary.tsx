import React from 'react'

interface Article {
  id: string
  title: string
  date: string
  readTime: string
  description: string
  image: string
}

const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Como funciona a propriedade de NFTs',
    date: '12 de setembro',
    readTime: 'Leitura de 6 min',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    image: '/assets/image3.png',
  },
  {
    id: 'art-2',
    title: '10 artistas digitais para acompanhar',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    description: 'Conheça criadores que moldam a cultura digital.',
    image: '/assets/image.png',
  },
  {
    id: 'art-3',
    title: 'Raridade, atributos e procedência',
    date: '15 de setembro',
    readTime: 'Leitura de 3 min',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    image: '/assets/image2.png',
  },
  {
    id: 'art-4',
    title: 'Como proteger sua carteira',
    date: '15 de setembro',
    readTime: 'Leitura de 2 min',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    image: '/assets/image4.png',
  },
]

export const MintDiary: React.FC = () => {
  return (
    <section aria-label="Diário da Cunhagem" className="w-full max-w-[1200px] mx-auto flex flex-col gap-[32px] font-mono">
      {/* Centered Heading */}
      <div className="flex flex-col items-center text-center gap-[6px]">
        <h2 className="text-[28px] font-bold leading-[37px] text-[#F5F1EB]">
          Diário da Cunhagem
        </h2>
        <p className="text-[14px] font-normal leading-[18px] text-[#CFB28C] max-w-[700px]">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>

      {/* 
        Grid of 4 cards:
        Figma specs: each card is 268px wide x 369px tall
        Background: #241612, border-radius: 8px
        Image: 268x195px
        Padding: 12px 16px 16px, gap: 8px
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] w-full">
        {ARTICLES.map((article) => (
          <article
            key={article.id}
            className="w-full h-[369px] flex flex-col bg-[#241612] rounded-[8px] overflow-hidden border border-[#3F2319]/40 shadow-xl transition-transform duration-300 hover:-translate-y-1 group"
          >
            {/* Image: 268px x 195px */}
            <div className="w-full h-[195px] overflow-hidden bg-[#140D0A] shrink-0">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content: padding 12px 16px 16px, gap 8px */}
            <div className="flex-1 p-[12px_16px_16px] flex flex-col justify-between">
              <div className="flex flex-col gap-[6px]">
                <div className="text-[12px] font-medium leading-[16px] text-[#CFB28C]">
                  {article.date} | {article.readTime}
                </div>

                <h3 className="text-[16px] font-bold leading-[20px] text-[#F5F1EB] group-hover:text-[#E89B55] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-[12px] font-normal leading-[18px] text-[#CFB28C] line-clamp-2">
                  {article.description}
                </p>
              </div>

              {/* CTA */}
              <button
                type="button"
                className="text-[14px] font-medium text-[#E89B55] hover:text-[#D28A4C] flex items-center gap-1 transition-colors cursor-pointer w-fit mt-1"
              >
                <span>Ler mais</span>
                <span className="text-[16px]">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
