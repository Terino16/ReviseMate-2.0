import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"

interface CommunityCardProps {
  className?: string
}

export function CommunityCard({ className }: CommunityCardProps) {
  return (
    <div className={cn("card relative overflow-hidden p-6", className)}>
      <div className="absolute right-4 top-4 text-cord/20">
       <Image src="/dashboard/Search.svg" alt="Search" width={100} height={100} />
      </div>

      <h3 className="relative z-10 font-serif text-2xl font-normal  leading-snug text-dark">
        Find Your<br />Revision Squad
      </h3>
      <p className="relative z-10 mt-2 max-w-[200px] text-xs leading-relaxed text-gray-rm">
        Get help when you&apos;re stuck, celebrate wins together, and never feel alone in your revision.
      </p>
     
     <Button variant="purple" className="w-full mt-2">
      Join the Community 
     </Button>
    </div>
  )
}
