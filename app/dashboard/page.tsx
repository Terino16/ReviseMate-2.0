"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TopicCard } from "@/components/dashboard/topic-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { Badge } from "@/components/dashboard/badge"
import { LevelUpCard } from "@/components/dashboard/level-up-card"
import { CommunityCard } from "@/components/dashboard/community-card"
import { UserProfile } from "@/components/dashboard/user-profile"
import { ProgressStats } from "@/components/dashboard/progress-stats"
import { MateQuizCard } from "@/components/dashboard/mate-quiz-card"
import Image from "next/image"

const TOPICS = [
  { number: 1, title: "Numbers and the number system", subtopicCount: 11, },
  { number: 2, title: "Alegbra", subtopicCount: 11,  },
  { number: 3, title: "Units and Measurement", subtopicCount: 11,  },
  { number: 4, title: "Geography of Earth",subtopicCount: 12 },
  { number: 5, title: "Maths paper IGCSE",subtopicCount: 13 },
  { number: 6, title: "Maths paper IBDP",subtopicCount: 14 },
]

export default function DashboardPage() {
  const { user, isLoaded } = useUser()

  const metadata = user?.publicMetadata as Record<string, unknown> | undefined
  const firstName = (metadata?.userName as string) || user?.firstName || "there"
  const role = (metadata?.role as string) || "student"
  const year = (metadata?.year as string) || ""
  const curriculum = (metadata?.broadCurriculum as string) || ""

  const roleLabel = role === "teacher"
    ? "Teacher"
    : role === "parent"
      ? "Parent"
      : year ? `Student: ${year.replace("Year ", "Y")}` : "Student"

  const curriculumLabel = curriculum
    ? curriculum.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "British Curriculum (KS3 / Cambridge Lower Secondary)"

  if (!isLoaded) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-cord border-t-transparent" />
      </main>
    )
  }

  return (
    <>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
              Hello <span className="italic">{firstName}!</span>
            </h1>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-gray-rm">
              Explore topics while we build for {curriculumLabel} - your votes shape what comes next!
            </p>
          </div>
        </div>

        <div className="bg-[#F2EDEC] w-full p-8 flex flex-col space-y-3 items-left rounded-xl relative">
          <p className="font-serif text-3xl">Try IGCSE Maths Question Paper</p>
          <p className="text-sm max-w-xs text-bodytext">
            Try a guided practice on IGCSE Maths Question Paper to see how ReviseMate works
          </p>
          <Link href="/dashboard/quiz/ED_Igcse_Math_A_Q1">
            <Button variant="purple" className="w-fit mt-1">
              Try it out
            </Button>
          </Link>
          <Image
            src="/dashboard/dashboard_avatar.png"
            alt="Numbers"
            width={300}
            height={263}
            className="absolute right-0 bottom-12"
          />
        </div>

        {/* Topics */}
        <SectionHeader
          title="Topics"
          badge={<Badge variant="filled">3 Unlocked</Badge>}
          className="mt-10"
        />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic.number}
              number={topic.number}
              title={topic.title}
              subtopicCount={topic.subtopicCount}
              className="bg-[#F2EDEC]"
            />
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <LevelUpCard className="lg:col-span-3" />
          <CommunityCard className="lg:col-span-2" />
        </div>
      </main>

      {/* Right sidebar */}
      <aside className="hidden w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-bone bg-white p-6 xl:flex">
        <UserProfile
          name={user ? `${firstName} ${(metadata?.lastName as string) || user?.lastName || ""}`.trim() : ""}
          role={roleLabel}
          avatarUrl={user?.imageUrl}
        />

        <ProgressStats
          questions="54 hours"
          understandingScore="02"
          predictedGrade="82%"
        />

        <MateQuizCard />
      </aside>
    </>
  )
}
