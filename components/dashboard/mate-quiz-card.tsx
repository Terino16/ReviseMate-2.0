import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface MateQuizCardProps {
  className?: string
}

export function MateQuizCard({ className }: MateQuizCardProps) {
  return (
    <div
      className={cn(
        "card overflow-hidden bg-[#F2EDEC] text-white",
        className,
      )}
    >
      <div className="relative h-[220px] w-full">
        <Image
          src="/dashboard/dashboard_illustration.svg"
          alt="Illustration"
          fill
          className="object-contain"
        />
      </div>
      <div className="p-5 space-y-2">
        <h3 className="font-serif text-2xl font-normal  leading-snug text-black">
          What kind of<br />mate are you?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-bodytext">
          The one who puts everyone onto the good stuff - or the one who gatekeeps everything?
        </p>
       <Button variant="purple" className="w-full">
        Tell your mates
       </Button>
        <button
          type="button"
          className="mt-2 w-full text-center text-xs font-medium underline underline-offset-2 transition-colors  text-bodytext"
        >
          Copy link
        </button>
      </div>
    </div>
  )
}
