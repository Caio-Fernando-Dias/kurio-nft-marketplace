import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-[#D28A4C]",
  {
    variants: {
      variant: {
        default:
          "bg-[#D28A4C] text-[#140D0A] shadow hover:bg-[#E89B55]",
        rare:
          "bg-[#D28A4C] text-[#140D0A] font-bold uppercase tracking-wider shadow-md",
        secondary:
          "bg-[#2F1D15] text-[#CFB28C] border border-[#3F2319] hover:bg-[#38220F]",
        destructive:
          "bg-red-900/60 text-red-200 border border-red-800",
        outline:
          "border border-[#D28A4C] text-[#E89B55]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
