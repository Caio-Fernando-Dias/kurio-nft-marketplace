import React from 'react'
import type { NFTCategoryTab } from '../../types/nft'

interface CategoryTabsProps {
  activeTab: NFTCategoryTab
  onTabChange: (tab: NFTCategoryTab) => void
}

const TABS: { id: NFTCategoryTab; label: string }[] = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
]

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      aria-label="Categorias de NFTs"
      className="flex items-center gap-[20px] font-mono overflow-x-auto no-scrollbar"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-[6px] text-[14px] md:text-[15px] font-medium leading-[16px] whitespace-nowrap transition-colors duration-150 cursor-pointer ${
              isActive
                ? 'text-[#E89B55]'
                : 'text-[#F5F1EB] hover:text-[#E89B55]'
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D28A4C]" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
