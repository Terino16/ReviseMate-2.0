import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

interface MarksCardProps {
  earned: number
  total: number
  className?: string
}

export function MarksCard({ earned, total, className }: MarksCardProps) {
  const percentage = total > 0 ? Math.round((earned / total) * 100) : 0

  return (
    <div className={cn("rounded-xl border border-bone bg-white p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="size-4 text-cord" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-rm">
          Your Progress
        </h4>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-dark">{earned}</span>
        <span className="text-sm text-gray-rm">/ {total} marks</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bone/60">
        <div
          className="h-full rounded-full bg-cord transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
