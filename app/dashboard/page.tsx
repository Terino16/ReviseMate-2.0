'use client'

import * as React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { BROAD_CURRICULA_META, TEACHER_SUBJECTS } from '../onboarding/constants'

const TAGLINES: Record<string, Record<string, string>> = {
  'Year 7': {
    ks3: "We're building for KS3 — Edexcel IGCSE is just where we started",
    ibmyp: "We're building for MYP — Edexcel IGCSE is just where we started",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
  'Year 8': {
    ks3: "We're building for KS3 — Edexcel IGCSE is just where we started",
    ibmyp: "We're building for MYP — Edexcel IGCSE is just where we started",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
  'Year 9': {
    igcse_gcse: "IGCSE Maths is live — your other subjects are on the way",
    ibmyp: "We're building for MYP — these topics overlap loads with what you're covering",
    other_curr: "IGCSE Maths is live — your other subjects are on the way",
    ks3: "IGCSE Maths is live — your other subjects are on the way",
  },
  'Year 10': {
    igcse_gcse: "Right then — let's ace IGCSE Maths",
    ibmyp: "We're building for MYP — Edexcel IGCSE is just where we started",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
  'Year 11': {
    igcse_gcse: "Right then — let's ace IGCSE Maths",
    ibmyp: "We're building for MYP — Edexcel IGCSE is just where we started",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
  'Year 12': {
    ibdp: "We're building for A Level & IB too — IGCSE is where it all starts",
    alevel: "We're building for A Level & IB too — IGCSE is where it all starts",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
  'Year 13': {
    ibdp: "We're building for A Level & IB too — IGCSE is where it all starts",
    alevel: "We're building for A Level & IB too — IGCSE is where it all starts",
    other_curr: "We're building for your curriculum — Edexcel IGCSE is just where we started",
  },
}

export default function DashboardPage() {
  const { user } = useUser()
  const [showModal, setShowModal] = React.useState(true)

  const meta = (user?.publicMetadata || {}) as Record<string, unknown>
  const role = meta.role as string || 'student'
  const name = meta.userName as string || user?.firstName || 'mate'
  const year = meta.year as string || ''
  const curriculum = meta.curriculum as string || meta.broadCurriculum as string || ''
  const childName = meta.childName as string || ''
  const teachSubjects = (meta.teachSubjects as string[]) || []
  const yearGroups = (meta.yearGroups as string[]) || []
  const parentSubjects = (meta.parentSubjects as string[]) || []
  const currLabel = BROAD_CURRICULA_META[curriculum]?.label || (meta.customCurrText as string) || 'IGCSE'

  const tagline = role === 'student'
    ? (TAGLINES[year]?.[curriculum] || TAGLINES[year]?.['other_curr'] || "Let's get started!")
    : role === 'teacher'
    ? "We're building for teachers like you."
    : "You're already ahead of most parents."

  const headline = role === 'student' ? `Heads up, ${name}!` : `Welcome, ${name}!`

  return (
    <div className="min-h-screen bg-page-bg text-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-[18px] border-b border-bone">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-bold text-dark">Revise<span className="text-cord">Mate</span></span>
        </div>
        <UserButton />
      </header>

      {/* Welcome Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center p-6">
          <div className="fi max-w-[440px] w-full bg-white rounded-[20px] px-8 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-normal tracking-[-0.5px] text-dark mb-2">
              {headline}
            </h2>
            <p className="text-[15px] text-gray-rm leading-[1.6] mb-6">{tagline}</p>

            {/* Role-specific content */}
            {role === 'teacher' && (
              <div className="mb-5">
                {teachSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-3">
                    {teachSubjects.map(id => {
                      const s = TEACHER_SUBJECTS.find(x => x.id === id)
                      return s ? <span key={id} className="px-3.5 py-1.5 rounded-[10px] bg-teal-soft text-[13px] font-semibold text-teal">{s.emoji} {s.label}</span> : null
                    })}
                  </div>
                )}
                {yearGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {yearGroups.map(y => <span key={y} className="px-2.5 py-1 rounded-lg bg-gray-faint text-xs font-medium text-dark">{y}</span>)}
                  </div>
                )}
              </div>
            )}

            {role === 'parent' && (
              <div className="mb-5">
                <p className="text-[13px] text-gray-rm mb-2">Supporting <strong>{childName || 'your child'}</strong> {year ? `in ${year}` : ''}</p>
                {parentSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {parentSubjects.map(id => {
                      const s = TEACHER_SUBJECTS.find(x => x.id === id)
                      return s ? <span key={id} className="px-3.5 py-1.5 rounded-[10px] bg-teal-soft text-[13px] font-semibold text-teal">{s.emoji} {s.label}</span> : null
                    })}
                  </div>
                )}
              </div>
            )}

            {role === 'student' && (
              <div className="mb-5">
                <p className="text-xs text-gray-mid">{year} · {currLabel}</p>
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="px-10 py-3.5 rounded-[14px] bg-cord text-white text-[15px] font-semibold tracking-[-0.2px] border-none cursor-pointer shadow-[0_4px_20px_#8C2F3930]">
              Let&apos;s go →
            </button>
          </div>
        </div>
      )}

      {/* Dashboard content */}
      <div className="max-w-[800px] mx-auto px-8 py-10">
        <h1 className="text-[28px] font-normal tracking-[-0.5px] text-dark mb-2">
          Hey, <span className="italic-accent">{name}</span>
        </h1>
        <p className="text-[15px] text-gray-rm mb-8">
          {role === 'student' && "Ready to revise? Pick a subject to get started."}
          {role === 'teacher' && "Welcome to your teaching dashboard."}
          {role === 'parent' && `Here's how ${childName || 'your child'} is doing.`}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="card card-h p-6">
            <div className="text-[28px] mb-3">📐</div>
            <h3 className="text-base font-bold text-dark mb-1.5">IGCSE Maths</h3>
            <p className="text-[13px] text-gray-rm">Edexcel 4MA1 — Start practising</p>
          </div>
          <div className="card card-h p-6 opacity-50">
            <div className="text-[28px] mb-3">🧪</div>
            <h3 className="text-base font-bold text-dark mb-1.5">More subjects</h3>
            <p className="text-[13px] text-gray-rm">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
