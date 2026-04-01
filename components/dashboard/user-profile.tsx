"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProfileProps {
  name: string
  role: string
  avatarUrl?: string
  className?: string
}

export function UserProfile({ name, role, avatarUrl, className }: UserProfileProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl bg-[#F2EDEC] p-2 transition-colors hover:bg-gray-faint/50",
        className,
      )}
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-gray-faint">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm font-semibold text-gray-rm">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-dark">{name}</span>
        <span className="text-xs text-gray-rm">{role}</span>
      </div>
      <ChevronDown className="ml-auto size-4 text-gray-mid" />
    </button>
  )
}
