'use client'

import * as React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { C, BROAD_CURRICULA_META, TEACHER_SUBJECTS } from '../onboarding/constants'

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
    <div style={{ minHeight: '100vh', fontFamily: "'Sora',sans-serif", background: C.pageBg, color: C.black }}>
      {/* Header */}
      <header style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.bone}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}><span>Revise</span><span style={{ color: C.orange }}>Mate</span></span>
        </div>
        <UserButton />
      </header>

      {/* Welcome Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="fi" style={{ maxWidth: 440, width: '100%', background: C.white, borderRadius: 20, padding: '36px 32px', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.5px', color: C.dark, marginBottom: 8 }}>
              {headline}
            </h2>
            <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, marginBottom: 24 }}>{tagline}</p>

            {/* Role-specific content */}
            {role === 'teacher' && (
              <div style={{ marginBottom: 20 }}>
                {teachSubjects.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
                    {teachSubjects.map(id => {
                      const s = TEACHER_SUBJECTS.find(x => x.id === id)
                      return s ? <span key={id} style={{ padding: '6px 14px', borderRadius: 10, background: C.tealSoft, fontSize: 13, fontWeight: 600, color: C.teal }}>{s.emoji} {s.label}</span> : null
                    })}
                  </div>
                )}
                {yearGroups.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                    {yearGroups.map(y => <span key={y} style={{ padding: '4px 10px', borderRadius: 8, background: C.grayFaint, fontSize: 12, fontWeight: 500, color: C.dark }}>{y}</span>)}
                  </div>
                )}
              </div>
            )}

            {role === 'parent' && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: C.gray, marginBottom: 8 }}>Supporting <strong>{childName || 'your child'}</strong> {year ? `in ${year}` : ''}</p>
                {parentSubjects.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {parentSubjects.map(id => {
                      const s = TEACHER_SUBJECTS.find(x => x.id === id)
                      return s ? <span key={id} style={{ padding: '6px 14px', borderRadius: 10, background: C.tealSoft, fontSize: 13, fontWeight: 600, color: C.teal }}>{s.emoji} {s.label}</span> : null
                    })}
                  </div>
                )}
              </div>
            )}

            {role === 'student' && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: C.grayMid }}>{year} · {currLabel}</p>
              </div>
            )}

            <button onClick={() => setShowModal(false)} style={{
              padding: '14px 40px', borderRadius: 14, background: C.cord, color: C.white,
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px', border: 'none', cursor: 'pointer',
              boxShadow: `0 4px 20px ${C.cord}30`,
            }}>Let&apos;s go →</button>
          </div>
        </div>
      )}

      {/* Dashboard content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.5px', color: C.dark, marginBottom: 8 }}>
          Hey, <span className="italic-accent">{name}</span>
        </h1>
        <p style={{ fontSize: 15, color: C.gray, marginBottom: 32 }}>
          {role === 'student' && "Ready to revise? Pick a subject to get started."}
          {role === 'teacher' && "Welcome to your teaching dashboard."}
          {role === 'parent' && `Here's how ${childName || 'your child'} is doing.`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card card-h" style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>📐</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 6 }}>IGCSE Maths</h3>
            <p style={{ fontSize: 13, color: C.gray }}>Edexcel 4MA1 — Start practising</p>
          </div>
          <div className="card card-h" style={{ padding: 24, opacity: 0.5 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🧪</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 6 }}>More subjects</h3>
            <p style={{ fontSize: 13, color: C.gray }}>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
