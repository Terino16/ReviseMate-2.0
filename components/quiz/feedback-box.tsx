import { cn } from "@/lib/utils"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface FeedbackBoxProps {
  isCorrect: boolean
  text: string
  className?: string
}

export function FeedbackBox({ isCorrect, text, className }: FeedbackBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        isCorrect
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50",
        className,
      )}
    >
      {isCorrect ? (
        <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      ) : (
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
      )}
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            isCorrect ? "text-emerald-800" : "text-amber-800",
          )}
        >
          {isCorrect ? "Correct!" : "Let's think about this carefully"}
        </p>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            isCorrect ? "text-emerald-700" : "text-amber-700",
          )}
        >
          {text}
        </p>
      </div>
    </div>
  )
}
