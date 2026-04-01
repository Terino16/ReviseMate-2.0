import { cn } from "@/lib/utils"

interface SidePanelProps {
  title: string
  variant: "planning" | "answer"
  content: string[]
  className?: string
}

export function SidePanel({ title, variant, content, className }: SidePanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        variant === "planning"
          ? "border-purple-200 bg-purple-50/60"
          : "border-emerald-200 bg-emerald-50/60",
        className,
      )}
    >
      <h4
        className={cn(
          "mb-3 text-xs font-bold uppercase tracking-wider",
          variant === "planning" ? "text-purple-700" : "text-emerald-700",
        )}
      >
        {title}
      </h4>
      {content.length === 0 ? (
        <p className="text-xs italic text-gray-mid">
          Content will appear here as you progress...
        </p>
      ) : (
        <div className="space-y-2">
          {content.map((text, i) => (
            <p
              key={i}
              className={cn(
                "text-xs leading-relaxed",
                variant === "planning" ? "text-purple-900" : "text-emerald-900",
              )}
            >
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
