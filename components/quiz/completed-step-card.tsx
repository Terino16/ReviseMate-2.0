import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { CompletedStep, CommonQuestion, CommonOption, PathOption } from "@/lib/quiz-types"

interface CompletedStepCardProps {
  step: CompletedStep
  stepNumber: number
}

export function CompletedStepCard({ step, stepNumber }: CompletedStepCardProps) {
  const options = step.data.options as (CommonOption | PathOption)[]
  const selectedOption = options.find((o) => o.id === step.selectedOptionId)

  return (
    <div className="rounded-xl border border-bone/60 bg-white/60 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-3.5" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-mid">Step {stepNumber}</p>
          <p className="text-sm font-medium text-dark">{step.data.text}</p>
          {selectedOption && (
            <p className="mt-1 text-xs text-emerald-700">
              {step.selectedOptionId}. {selectedOption.text}
            </p>
          )}
          {step.marksAwarded > 0 && (
            <div className="mt-1.5 flex gap-1.5">
              {step.data.markDetails?.map((m) => (
                <span
                  key={m.type}
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    step.wasCorrectFirstAttempt
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-faint text-gray-mid",
                  )}
                >
                  {m.type}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
