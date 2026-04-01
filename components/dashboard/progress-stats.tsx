import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { StatItem } from "./stat-item"

interface ProgressStatsProps {
  questions: string
  understandingScore: string
  predictedGrade: string
  className?: string
}

export function ProgressStats({
  questions,
  understandingScore,
  predictedGrade,
  className,
}: ProgressStatsProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h3 className="mb-2 font-serif text- font-normal text-2xl  text-dark">Your Progress</h3>

      <div className="flex flex-col divide-y divide-bone">
        <StatItem
          icon={<Image src="/dashboard/Question.svg" alt="Questions" width={20} height={20} />}
          label="Questions"
          value={questions}
        />
        <StatItem
          icon={<Image src="/dashboard/Score.svg" alt="Understanding Score" width={20} height={20} />}
          label="Understanding Score"
          value={understandingScore}
        />
        <StatItem
          icon={<Image src="/dashboard/Predicted_grade.svg" alt="Predicted Grade" width={20} height={20} />}
          label="Predicted Grade"
          value={predictedGrade}
        />
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-cord py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(140,47,57,0.4)]"
      >
        See what&apos;s coming
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
