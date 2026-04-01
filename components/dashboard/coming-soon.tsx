import { Construction } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComingSoonProps {
  title: string
  description?: string
  className?: string
}

export function ComingSoon({ title, description, className }: ComingSoonProps) {
  return (
    <main className={cn("flex flex-1 flex-col items-center justify-center gap-4 px-8", className)}>
      <div className="flex size-16 items-center justify-center rounded-2xl bg-cord-soft">
        <Construction className="size-7 text-cord" />
      </div>
      <h1 className="font-serif text-3xl font-normal text-dark">{title}</h1>
      <p className="max-w-sm text-center text-sm leading-relaxed text-gray-rm">
        {description || "We're working hard to bring this to you. Stay tuned!"}
      </p>
      <span className="rounded-full border border-cord px-4 py-1.5 text-xs font-semibold text-cord">
        Coming Soon
      </span>
    </main>
  )
}
