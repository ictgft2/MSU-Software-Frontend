import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-red text-white hover:bg-brand-reddark",
        destructive:
          "bg-brand-red text-white hover:bg-brand-reddark",
        outline:
          "border border-surface-border bg-white text-ink hover:bg-surface",
        secondary:
          "bg-sidebar text-white hover:bg-sidebar-hover",
        ghost: "hover:bg-surface text-surface-muted hover:text-ink",
        link: "text-brand-red underline-offset-4 hover:underline",
        soft: "bg-surface text-surface-muted hover:bg-[#e8e8ea]",
      },
      size: {
        default: "h-9 px-3 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        xs: "h-7 rounded-md px-2.5 text-[11.5px]",
        lg: "h-10 rounded-lg px-4",
        icon: "h-7 w-7 rounded-full",
        iconSm: "h-6 w-6 rounded-md",
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
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
