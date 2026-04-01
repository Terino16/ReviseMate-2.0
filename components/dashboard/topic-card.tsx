import { cn } from "@/lib/utils"
import { ArrowRight, MoreVertical } from "lucide-react"

const numberColors = [
  "bg-cord-soft text-cord",
  "bg-teal-soft text-teal",
  "bg-cord-soft text-cord",
  "bg-[#F0E6F6] text-[#7B3FA0]",
  "bg-cord-soft text-cord",
  "bg-teal-soft text-teal",
] as const

interface TopicCardProps {
  number: number
  title: string
  subtopicCount?: number
  progress?: number
  locked?: boolean
  className?: string
}

export function TopicCard({
  number,
  title,
  subtopicCount,
  progress,
  locked = false,
  className,
}: TopicCardProps) {
  const colorClass = numberColors[(number - 1) % numberColors.length]
  const hasProgress = progress !== undefined && progress > 0

  return (
    <div
      className={cn(
        "card card-h group relative flex flex-col justify-between p-5 !bg-[#F2EDEC]",
        locked && "opacity-60",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-bold",
            colorClass,
          )}
        >
          {number}
        </span>
        <button
          type="button"
          className="text-gray-light transition-colors hover:text-gray-rm"
          aria-label="More options"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-[0.95rem] font-semibold leading-snug text-dark tracking-tight">{title}</h3>
       {subtopicCount && <p className="mt-1 text-xs text-bodytext tracking-tight">{subtopicCount} subtopics</p>}
      </div>

      {hasProgress && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-bone/60">
            <div
              className="h-full rounded-full bg-cord transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-xs text-gray-rm">{progress}% Complete</span>
            <ArrowRight className="size-3.5 text-gray-mid transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}
