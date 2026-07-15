import * as React from "react"

import { cn } from "@src/lib/utils"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3",
        className
      )}
      {...props}
    >
      <div>
        <h1 className="text-xl font-bold mb-1 text-ink">{title}</h1>
        {description ? (
          <p className="text-surface-muted text-xs">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2 shrink-0">{actions}</div> : null}
    </div>
  )
}

export { PageHeader }
