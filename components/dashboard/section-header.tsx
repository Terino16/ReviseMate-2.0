import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  badge?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, badge, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-xl font-semibold text-dark">{title}</h2>
      {badge}
    </div>
  )
}
