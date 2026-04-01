import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizHeaderProps {
  tags: string[]
  className?: string
}

export function QuizHeader({ tags, className }: QuizHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/dashboard/dashboard_logo.png" alt="ReviseMate" width={32} height={32} />
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cord-soft px-3 py-1 text-xs font-medium text-cord"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm font-medium text-gray-rm transition-colors hover:text-dark"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
