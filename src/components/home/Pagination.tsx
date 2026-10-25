import React from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
}) => {
  // Conforme especificado pelo usuário: "A páginação vai até 4 depois seta"
  const pages = [1, 2, 3, 4]

  return (
    <nav
      aria-label="Paginação do catálogo"
      className="flex items-center justify-end gap-[8px] mt-8 mb-4 font-mono"
    >
      {/* Previous Page Arrow (se currentPage > 1) */}
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
          className="w-[35px] h-[35px] rounded-[4px] border border-[#3F2319] bg-transparent hover:border-[#D28A4C] text-[#F5F1EB] flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Page Numbers 1 até 4 */}
      {pages.map((p) => {
        const isActive = p === currentPage
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`Página ${p}`}
            aria-current={isActive ? 'page' : undefined}
            className={`w-[35px] h-[35px] rounded-[4px] text-[18px] transition-all cursor-pointer flex items-center justify-center leading-[16px] ${
              isActive
                ? 'bg-[#D28A4C] text-[#140D0A] font-bold'
                : 'border border-[#3F2319] bg-transparent text-[#F5F1EB] hover:border-[#D28A4C] font-normal'
            }`}
          >
            {p}
          </button>
        )
      })}

      {/* Seta para próxima página */}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, 4))}
        aria-label="Próxima página"
        disabled={currentPage >= 4}
        className={`w-[35px] h-[35px] rounded-[4px] border border-[#3F2319] bg-transparent flex items-center justify-center transition-colors ${
          currentPage >= 4
            ? 'opacity-40 cursor-not-allowed text-[#7A6C65]'
            : 'hover:border-[#D28A4C] text-[#F5F1EB] cursor-pointer'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
