import { cn } from "@/lib/utils"

type BadgeVariant = "filled" | "outline"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = "filled", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        variant === "filled" && "bg-cord text-white",
        variant === "outline" && "border border-cord text-cord",
        className,
      )}
    >
      {children}
    </span>
  )
}
