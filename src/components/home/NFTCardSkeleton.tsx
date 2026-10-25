import React from 'react'

export const NFTCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full font-mono" aria-hidden="true">
      {/* Outer Card Box Skeleton: rounded-none */}
      <div className="w-full h-[200px] sm:h-[260px] md:h-[300px] bg-[#241612] rounded-none p-2 sm:p-2.5 md:p-3 flex items-center justify-center border border-[#3F2319]/40 shadow-lg">
        <div className="w-full h-full rounded-[8px] md:rounded-[15px] animate-shimmer bg-[#38220F]" />
      </div>

      {/* Info Skeleton */}
      <div className="pt-2 md:pt-3 flex flex-col gap-1.5 w-full">
        <div className="h-4 w-3/4 rounded animate-shimmer bg-[#241612]" />
        <div className="h-4 w-1/3 rounded animate-shimmer bg-[#241612]" />
      </div>
    </div>
  )
}
