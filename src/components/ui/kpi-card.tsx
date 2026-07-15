import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@src/lib/utils"

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  hint?: string
  icon?: LucideIcon
  accent?: boolean
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
  className,
  ...props
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-surface-border rounded-xl p-4",
        accent && "border-l-4 border-l-brand-red",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide mb-2.5",
          accent ? "text-brand-red" : "text-surface-muted"
        )}
      >
        <span>{label}</span>
        {Icon ? <Icon className="w-4 h-4" /> : null}
      </div>
      <div
        className={cn(
          "text-3xl font-bold leading-none",
          accent && "text-brand-red"
        )}
      >
        {value}
      </div>
      {hint ? (
        <div className="text-[11px] text-surface-muted mt-1.5">{hint}</div>
      ) : null}
    </div>
  )
}

export { KpiCard }
