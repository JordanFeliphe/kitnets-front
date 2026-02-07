import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/shared/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-white/40 bg-white/10 text-white",
        secondary:
          "border-zinc-500/50 bg-zinc-500/15 text-zinc-900 dark:text-zinc-100",
        destructive:
          "border-red-500/50 bg-red-500/15 text-red-600 dark:text-red-400",
        outline:
          "border-border/60 bg-background/50 text-foreground",
        success:
          "border-emerald-500/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
        warning:
          "border-amber-500/60 bg-amber-500/15 text-amber-600 dark:text-amber-300",
        info:
          "border-blue-500/60 bg-blue-500/15 text-blue-600 dark:text-blue-300",
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
