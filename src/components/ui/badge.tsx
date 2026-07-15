import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-red text-white",
        secondary: "bg-surface text-surface-muted",
        outline: "border border-surface-border text-ink bg-white",
        emergency: "text-brand-red",
        cold: "text-blue-500",
        live: "bg-brand-red text-white text-[10px] font-bold px-2 py-1",
        stat: "bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5",
        priority: "bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5",
        success: "bg-green-500 text-white",
      },
      size: {
        default: "text-[11.5px]",
        sm: "text-[10px] px-2 py-0.5",
        xs: "text-[9px] px-1.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
