import { cn } from "@/lib/utils"

interface ProgressDotsProps {
  total: number
  completed: number
  className?: string
}

export function ProgressDots({ total, completed, className }: ProgressDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < completed
        const isCurrent = i === completed
        return (
          <div key={i} className="flex items-center gap-1">
            <div
              className={cn(
                "size-3 rounded-full transition-all duration-300",
                isDone && "bg-cord",
                isCurrent && "bg-cord ring-2 ring-cord/30 ring-offset-2",
                !isDone && !isCurrent && "bg-bone",
              )}
            />
            {i < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-4 rounded-full transition-all duration-300",
                  i < completed ? "bg-cord" : "bg-bone",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
