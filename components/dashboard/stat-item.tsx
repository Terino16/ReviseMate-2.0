import { cn } from "@/lib/utils"

interface StatItemProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}

export function StatItem({ icon, label, value, className }: StatItemProps) {
  return (
    <div className={cn("flex items-center gap-3 py-4", className)}>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-cord-soft text-cord">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-rm">{label}</span>
        <span className="text-lg font-semibold leading-tight text-dark">{value}</span>
      </div>
    </div>
  )
}
