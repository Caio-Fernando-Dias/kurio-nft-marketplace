import React from 'react'

export const CartSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Carregando itens do carrinho"
      aria-busy="true"
      className="w-full flex flex-col font-mono"
    >
      {/* DESKTOP SKELETON (782px Table + 332px Summary) */}
      <div className="hidden md:flex justify-between items-start gap-[86px] w-full">
        {/* Table Rows Skeleton (782px wide) */}
        <div className="w-[782px] shrink-0 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-full h-[104px] bg-[#241612] rounded-[6px] p-4 flex items-center justify-between border border-[#3F2319]/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[6px] bg-[#38220F] animate-shimmer shrink-0" />
                <div className="flex flex-col gap-2">
                  <div className="w-48 h-4 rounded bg-[#38220F] animate-shimmer" />
                  <div className="w-24 h-3 rounded bg-[#38220F] animate-shimmer" />
                </div>
              </div>
              <div className="w-16 h-4 rounded bg-[#38220F] animate-shimmer" />
              <div className="w-24 h-8 rounded-full bg-[#38220F] animate-shimmer" />
              <div className="w-20 h-4 rounded bg-[#38220F] animate-shimmer" />
              <div className="w-6 h-6 rounded bg-[#38220F] animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Summary Skeleton (332px wide) */}
        <div className="w-[332px] shrink-0 bg-[#241612] rounded-[6px] p-[20px] flex flex-col gap-4 border border-[#3F2319]/40">
          <div className="w-32 h-5 rounded bg-[#38220F] animate-shimmer" />
          <div className="w-full h-[1px] bg-[#D28A4C]/20" />
          <div className="flex justify-between">
            <div className="w-20 h-4 rounded bg-[#38220F] animate-shimmer" />
            <div className="w-16 h-4 rounded bg-[#38220F] animate-shimmer" />
          </div>
          <div className="flex justify-between">
            <div className="w-28 h-4 rounded bg-[#38220F] animate-shimmer" />
            <div className="w-14 h-4 rounded bg-[#38220F] animate-shimmer" />
          </div>
          <div className="flex justify-between">
            <div className="w-24 h-4 rounded bg-[#38220F] animate-shimmer" />
            <div className="w-16 h-4 rounded bg-[#38220F] animate-shimmer" />
          </div>
          <div className="w-full h-[1px] bg-[#D28A4C]/20" />
          <div className="flex justify-between">
            <div className="w-16 h-5 rounded bg-[#38220F] animate-shimmer" />
            <div className="w-24 h-5 rounded bg-[#38220F] animate-shimmer" />
          </div>
          <div className="w-full h-[40px] rounded-[3px] bg-[#38220F] animate-shimmer mt-2" />
        </div>
      </div>

      {/* MOBILE SKELETON */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="w-full h-[120px] bg-[#241612] rounded-[12px] p-3 flex items-center gap-3 border border-[#3F2319]/40"
          >
            <div className="w-20 h-20 rounded-[8px] bg-[#38220F] animate-shimmer shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-32 h-4 rounded bg-[#38220F] animate-shimmer" />
              <div className="w-20 h-3 rounded bg-[#38220F] animate-shimmer" />
              <div className="w-16 h-4 rounded bg-[#38220F] animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
