import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary/10 text-secondary",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        outline: "text-foreground",

        success: "border-green-700/50 bg-green-700/10 text-green-700 dark:text-green-400",
        warning: "border-amber-700/50 bg-amber-700/10 text-amber-700 dark:text-amber-400",
        info: "border-sky-700/50 bg-sky-700/10 text-sky-700 dark:text-sky-400",

        statusActive: "border-green-700/50 bg-green-700/10 text-green-700 dark:text-green-400",
        statusInactive: "border-red-700/50 bg-red-700/10 text-red-700 dark:text-red-400",

        pro: "border-violet-700/50 bg-violet-700/10 text-violet-700 dark:text-violet-400",
        beta: "border-orange-700/50 bg-orange-700/10 text-orange-700 dark:text-orange-400",

        statusPending: "border-amber-700/50 bg-amber-700/10 text-amber-700 dark:text-amber-400",
        statusPaused: "border-yellow-700/50 bg-yellow-700/10 text-yellow-700 dark:text-yellow-400",
        statusBlocked: "border-rose-700/50 bg-rose-700/10 text-rose-700 dark:text-rose-400",
        statusSuspended: "border-orange-700/50 bg-orange-700/10 text-orange-700 dark:text-orange-400",
        statusReview: "border-green-700/50 bg-green-700/10 text-green-700 dark:text-green-400",
        statusDraft: "border-zinc-700/50 bg-zinc-700/10 text-zinc-700 dark:text-zinc-400",
        statusNew: "border-sky-700/50 bg-sky-700/10 text-sky-700 dark:text-sky-400",
        statusExpired: "border-slate-700/50 bg-slate-700/10 text-slate-700 dark:text-slate-400",

        successAlt: "border-emerald-700/50 bg-emerald-700/10 text-emerald-700 dark:text-emerald-400",
        infoAlt: "border-cyan-700/50 bg-cyan-700/10 text-cyan-700 dark:text-cyan-400",
        warningAlt: "border-amber-700/50 bg-amber-700/10 text-amber-700 dark:text-amber-400",
        dangerAlt: "border-red-700/50 bg-red-700/10 text-red-700 dark:text-red-400",

        premium: "border-fuchsia-700/50 bg-fuchsia-700/10 text-fuchsia-700 dark:text-fuchsia-400",
        vip: "border-yellow-700/50 bg-yellow-700/10 text-yellow-700 dark:text-yellow-400",
        neutral: "border-zinc-700/50 bg-zinc-700/10 text-zinc-700 dark:text-zinc-400",
        indigo: "border-indigo-700/50 bg-indigo-700/10 text-indigo-700 dark:text-indigo-400",
        teal: "border-teal-700/50 bg-teal-700/10 text-teal-700 dark:text-teal-400",
        lime: "border-lime-700/50 bg-lime-700/10 text-lime-700 dark:text-lime-400",
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
