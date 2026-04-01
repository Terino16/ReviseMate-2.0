import Image from "next/image"
import { cn } from "@/lib/utils"

interface FeaturedTopicProps {
  title: string
  description: string
  ctaLabel: string
  onCtaClick?: () => void
  className?: string
}

export function FeaturedTopic({
  title,
  description,
  ctaLabel,
  onCtaClick,
  className,
}: FeaturedTopicProps) {
  return (
    <div
      className={cn(
        "card relative flex items-center justify-between overflow-hidden bg-[#F2EDEC] px-8 py-6",
        className,
      )}
    >
      <div className="relative z-10 max-w-[55%]">
        <h2 className="text-xl font-semibold text-dark">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-rm">{description}</p>
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-4 rounded-xl bg-cord px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(140,47,57,0.4)]"
        >
          {ctaLabel}
        </button>
      </div>
      <div className="relative z-0 h-[140px] w-[200px] shrink-0">
        <Image
          src="/dashboard_avatar.png"
          alt="Illustration"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}
