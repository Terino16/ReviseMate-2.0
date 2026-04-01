import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

type OptionState = "default" | "selected" | "correct" | "incorrect" | "dimmed"

interface OptionButtonProps {
  id: string
  text: string
  state: OptionState
  onClick: () => void
  disabled?: boolean
}

export function OptionButton({ id, text, state, onClick, disabled }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200",
        state === "default" &&
          "border-bone bg-white hover:border-gray-light hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
        state === "selected" &&
          "border-cord bg-cord/5 ring-2 ring-cord/20",
        state === "correct" &&
          "border-emerald-500 bg-emerald-50",
        state === "incorrect" &&
          "border-amber-500 bg-amber-50",
        state === "dimmed" &&
          "border-bone/60 bg-gray-faint/50 opacity-50",
        disabled && "cursor-default",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
          state === "correct" && "bg-emerald-500 text-white",
          state === "incorrect" && "bg-amber-500 text-white",
          state === "selected" && "bg-cord text-white",
          (state === "default" || state === "dimmed") && "bg-bone/60 text-gray-rm",
        )}
      >
        {state === "correct" ? (
          <Check className="size-4" />
        ) : state === "incorrect" ? (
          <X className="size-4" />
        ) : (
          id
        )}
      </span>
      <span
        className={cn(
          "text-sm leading-relaxed",
          state === "correct" && "font-medium text-emerald-800",
          state === "incorrect" && "text-amber-800",
          state === "dimmed" && "text-gray-mid",
          (state === "default" || state === "selected") && "text-dark",
        )}
      >
        {text}
      </span>
    </button>
  )
}
