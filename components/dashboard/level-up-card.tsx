import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { SectionHeader } from "./section-header"

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel: string
}

function FeatureItem({ icon, title, description, ctaLabel }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cord-soft text-cord">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-dark">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-rm">{description}</p>
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-cord underline underline-offset-2 transition-colors hover:text-cord-light"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}

interface LevelUpCardProps {
  className?: string
}

export function LevelUpCard({ className }: LevelUpCardProps) {
  return (
    <div className={cn("card p-6", className)}>
      <SectionHeader
        title="Level Up Your Revision"
        badge={<Badge variant="outline">Coming Soon</Badge>}
        className="mb-5"
      />
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
        <FeatureItem
          icon={<Image src="/dashboard/Exam_mode.svg" alt="Exam Mode" width={20} height={20} />}
          title="Exam Mode"
          description="Simulate real exam conditions and get predicted grades based on your performance."
          ctaLabel="Take a Look"
        />
        <FeatureItem
          icon={<Image src="/dashboard/Unit_text.svg" alt="Unit Tests" width={20} height={20} />}
          title="Unit Tests"
          description="Practice by topic, subtopic, or weak areas - your Mate's got you."
          ctaLabel="Take a Look"
        />
      </div>
    </div>
  )
}
