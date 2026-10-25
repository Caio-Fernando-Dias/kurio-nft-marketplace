import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D28A4C] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer font-mono active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#D28A4C] text-[#140D0A] font-bold shadow hover:bg-[#E89B55]",
        destructive:
          "bg-red-900/60 text-red-200 border border-red-800 shadow-sm hover:bg-red-900/80",
        outline:
          "border border-[#D28A4C] text-[#E89B55] bg-transparent shadow-sm hover:bg-[#D28A4C] hover:text-[#140D0A]",
        secondary:
          "bg-[#2F1D15] text-[#F5F1EB] border border-[#3F2319] shadow-sm hover:bg-[#38220F] hover:text-[#E89B55]",
        ghost:
          "text-[#CFB28C] hover:bg-[#241612] hover:text-[#F5F1EB]",
        link:
          "text-[#E89B55] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
