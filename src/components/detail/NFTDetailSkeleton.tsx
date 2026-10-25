import React from 'react'
import { Header } from '../layout/Header'
import { Footer } from '../layout/Footer'

export const NFTDetailSkeleton: React.FC = () => {
  return (
    <div
      aria-label="Carregando detalhes do colecionável"
      aria-busy="true"
      className="min-h-screen bg-[#140D0A] text-[#F5F1EB] font-mono selection:bg-[#E89B55] selection:text-[#140D0A] flex flex-col justify-between"
    >
      {/* DESKTOP SKELETON (>= md) */}
      <div className="hidden md:flex flex-col items-center w-full">
        <div className="w-full max-w-[1200px] mx-auto pt-[24px]">
          <Header initialActiveSection="mercado" />

          {/* Breadcrumb Skeleton */}
          <div className="w-[1200px] pt-8 pb-10">
            <div className="h-4 w-32 rounded animate-shimmer bg-[#241612]" />
          </div>

          {/* Two-Column Detail Layout: Artwork 444px + Details 595px */}
          <div className="w-[1200px] flex items-start justify-between pb-16">
            {/* Left Column: Thumbnails + Main Artwork */}
            <div className="flex items-start gap-[16px]">
              {/* 4 Thumbnails (100 x 100 px) */}
              <div className="flex flex-col gap-[14px]">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-[100px] h-[100px] rounded-[6px] bg-[#241612] border border-[#3F2319]/40 p-2 animate-shimmer"
                  />
                ))}
              </div>

              {/* Main Artwork (444 x 444 px) */}
              <div className="w-[444px] h-[444px] bg-[#241612] rounded-[6px] p-[20px] flex items-center justify-center border border-[#3F2319]/40">
                <div className="w-[404px] h-[404px] rounded-[24px] bg-[#38220F] animate-shimmer" />
              </div>
            </div>

            {/* Right Column: Details (595 x 448 px) */}
            <div className="w-[595px] h-[448px] flex flex-col justify-between items-start">
              <div className="w-full flex flex-col gap-[16px]">
                {/* Title Skeleton */}
                <div className="h-9 w-3/4 rounded animate-shimmer bg-[#241612]" />
                
                {/* Price & Rating Row */}
                <div className="w-full flex items-center justify-between">
                  <div className="h-6 w-28 rounded animate-shimmer bg-[#241612]" />
                  <div className="h-5 w-44 rounded animate-shimmer bg-[#241612]" />
                </div>

                <div className="w-[573px] h-[1px] bg-[#D28A4C]/20 my-2" />

                {/* Description Skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-32 rounded animate-shimmer bg-[#241612]" />
                  <div className="h-4 w-full rounded animate-shimmer bg-[#241612]" />
                  <div className="h-4 w-5/6 rounded animate-shimmer bg-[#241612]" />
                </div>

                {/* Editions Skeleton */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="h-4 w-20 rounded animate-shimmer bg-[#241612]" />
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[28px] rounded-full bg-[#241612] animate-shimmer" />
                    <div className="w-[42px] h-[28px] rounded-full bg-[#241612] animate-shimmer" />
                    <div className="w-[46px] h-[28px] rounded-full bg-[#241612] animate-shimmer" />
                    <div className="w-[66px] h-[28px] rounded-full bg-[#241612] animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Quantity + Buy Buttons */}
              <div className="w-full flex items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-[33px] h-[49.5px] rounded-[33px] bg-[#241612] animate-shimmer" />
                  <div className="w-[20px] h-6 rounded bg-[#241612] animate-shimmer" />
                  <div className="w-[33px] h-[49.5px] rounded-[33px] bg-[#241612] animate-shimmer" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[130px] h-[40px] rounded-[6px] bg-[#241612] animate-shimmer" />
                  <div className="w-[130px] h-[40px] rounded-[6px] bg-[#241612] animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1200px] mx-auto mt-[40px]">
          <Footer />
        </div>
      </div>

      {/* MOBILE SKELETON (< md) */}
      <div className="flex md:hidden flex-col w-full min-h-screen bg-[#140D0A]">
        {/* Mobile Header Skeleton */}
        <div className="h-[44px] px-4 flex items-center justify-between border-b border-[#3F2319]/40">
          <div className="w-8 h-8 rounded-full bg-[#241612] animate-shimmer" />
          <div className="w-24 h-5 rounded bg-[#241612] animate-shimmer" />
          <div className="w-8 h-8 rounded-full bg-[#241612] animate-shimmer" />
        </div>

        {/* Artwork Image Box */}
        <div className="w-full aspect-square max-w-[390px] mx-auto p-4 flex items-center justify-center">
          <div className="w-full h-full rounded-[24px] bg-[#241612] animate-shimmer" />
        </div>

        {/* Sheet Skeleton */}
        <div className="flex-1 bg-[#241612] rounded-t-[31px] px-6 pt-6 pb-28 flex flex-col gap-4">
          <div className="h-6 w-3/4 rounded bg-[#38220F] animate-shimmer" />
          <div className="h-4 w-full rounded bg-[#38220F] animate-shimmer" />
          <div className="h-4 w-2/3 rounded bg-[#38220F] animate-shimmer" />
          <div className="flex gap-2 pt-2">
            <div className="w-12 h-7 rounded-full bg-[#38220F] animate-shimmer" />
            <div className="w-12 h-7 rounded-full bg-[#38220F] animate-shimmer" />
            <div className="w-12 h-7 rounded-full bg-[#38220F] animate-shimmer" />
          </div>
        </div>

        {/* Sticky Bottom Bar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-[#241612] rounded-t-[32px] px-6 py-4 flex items-center justify-between border-t border-[#3F2319]/40 z-30">
          <div className="w-24 h-6 rounded bg-[#38220F] animate-shimmer" />
          <div className="w-40 h-12 rounded-[40px] bg-[#38220F] animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
