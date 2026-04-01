"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, AlignLeft, ClipboardList, MessageCircle, Settings } from "lucide-react"

const navItems = [
  { icon: "/dashboard/Home.svg", href: "/dashboard", label: "Home" },
  { icon: "/dashboard/Topics.svg", href: "/dashboard/topics", label: "Topics" },
  { icon: "/dashboard/Quizzes.svg", href: "/dashboard/quizzes", label: "Quizzes" },
  { icon: "/dashboard/Analytics.svg", href: "/dashboard/analytics", label: "Analytics" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-4 bottom-4 left-4 rounded-lg flex h-screen w-[104px] shrink-0 flex-col items-center border-r border-bone  py-6 bg-[#F2EDEC]">
      <Link href="/dashboard" className="mb-8">
        <Image
          src="/dashboard/dashboard_logo.png"
          alt="ReviseMate"
          width={48}
          height={48}
          className="object-contain"
        />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-8 mt-12">
        {navItems.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href="/dashboard"
              aria-label={label}
              className={cn(
                "flex size-13 items-center justify-center rounded-full transition-all duration-200",
                isActive
                  ? "bg-cord text-white shadow-sm"
                  : "text-gray-mid hover:bg-gray-faint hover:text-dark",
              )}
            >
              <Image src={Icon} alt={label} width={22} height={22} />
            </Link>
          )
        })}
         <Link
        href="/dashboard"
        aria-label="Settings"
        className={cn(
          "flex size-11 items-center justify-center rounded-xl transition-all duration-200",
          pathname === "/dashboard/settings"
            ? "bg-cord text-white shadow-sm"
            : "text-gray-mid hover:bg-gray-faint hover:text-dark",
        )}
      >
       <Image src="/dashboard/Setting.svg" alt="Settings" width={24} height={24} />
      </Link>
      </nav>

     
    </aside>
  )
}
