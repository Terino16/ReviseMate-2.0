'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GraduationCap, BookOpen, Heart } from 'lucide-react'
import { completeOnboarding } from './_actions'
import {
  YEARS, CURRICULUM_BY_YEAR, Y9_NEXT_YEAR_OPTIONS, Y11_WHATS_NEXT_OPTIONS,
  SIMPLE_SUBJECT_POOLS, Y9_IGCSE_SUBJECTS, IGCSE_SUBJECTS, IBDP_SUBJECTS, ALEVEL_SUBJECTS,
  YOUNGER_CHALLENGES, OLDER_CHALLENGES,
  TEACHER_SUBJECTS, TEACHER_CURRICULA, TEACHER_STRUGGLES,
  PARENT_SUBJECTS, PARENT_GOALS,
  type Year,
} from './_constants'

// ── Types ──────────────────────────────────────────────────────────────

type Role = 'student' | 'teacher' | 'parent'

type Step =
  | 'welcome' | 'role'
  | 'studentName' | 'studentSchool' | 'studentYear' | 'studentWhatsNext'
  | 'studentSubjects' | 'studentChallenges' | 'studentParentEmail'
  | 'teacherName' | 'teacherSubjects' | 'teacherCurricula' | 'teacherStruggles'
  | 'parentName' | 'parentChildName' | 'parentSchool' | 'parentSubjects' | 'parentGoals'

type SubjectEntry = {
  id: string; label: string; code?: string; board?: string; level?: string
}

interface Data {
  role?: Role
  userName: string
  lastName: string
  school: string
  year: string
  broadCurriculum: string
  y9NextYear: string
  whatsNext: string
  simpleSubjects: string[]
  otherSubjects: SubjectEntry[]
  challenges: string[]
  parentEmail: string
  childName: string
  teachSubjects: string[]
  yearGroups: string[]
  curriculum: string
  customCurrText: string
  teacherGoals: string[]
  parentSubjects: string[]
  parentGoals: string[]
}

// ── Step navigation ────────────────────────────────────────────────────

function yearNum(y: string) {
  return parseInt(y.replace('Year ', '') || '0')
}

function getStepsForRole(d: Data): Step[] {
  if (d.role === 'student') {
    const s: Step[] = ['studentName', 'studentSchool', 'studentYear']
    if (d.year === 'Year 9' || d.year === 'Year 11') s.push('studentWhatsNext')
    s.push('studentSubjects', 'studentChallenges')
    if (yearNum(d.year) >= 7 && yearNum(d.year) <= 9) s.push('studentParentEmail')
    return s
  }
  if (d.role === 'teacher') {
    return ['teacherName', 'teacherSubjects', 'teacherCurricula', 'teacherStruggles']
  }
  if (d.role === 'parent') {
    return ['parentName', 'parentChildName', 'parentSchool', 'parentSubjects', 'parentGoals']
  }
  return []
}

function nextStep(step: Step, d: Data): Step | 'complete' {
  if (step === 'welcome') return 'role'
  if (step === 'role') {
    if (d.role === 'student') return 'studentName'
    if (d.role === 'teacher') return 'teacherName'
    if (d.role === 'parent') return 'parentName'
    return 'role'
  }
  const steps = getStepsForRole(d)
  const idx = steps.indexOf(step)
  if (idx === -1) return 'role'
  return idx < steps.length - 1 ? steps[idx + 1] : 'complete'
}

function prevStep(step: Step, d: Data): Step {
  if (step === 'role') return 'role'
  if (step === 'studentName' || step === 'teacherName' || step === 'parentName') return 'role'
  const steps = getStepsForRole(d)
  const idx = steps.indexOf(step)
  if (idx <= 0) return 'role'
  return steps[idx - 1]
}

function getProgress(step: Step, d: Data): number {
  if (step === 'welcome') return 0
  if (step === 'role') return 6
  const steps = getStepsForRole(d)
  const idx = steps.indexOf(step)
  if (idx === -1) return 6
  return 6 + ((idx + 1) / steps.length) * 94
}

// ── Subject config helper ──────────────────────────────────────────────

type SubjectMode = 'simple' | 'board' | 'ibdp'
type BoardKey = 'Cambridge' | 'Edexcel'

function getSubjectConfig(d: Data): {
  mode: SubjectMode
  pool?: { id: string; label: string; emoji: string }[]
  boardSubjects?: Record<BoardKey, { id: string; label: string; code: string }[]>
  ibdpSubjects?: { id: string; label: string }[]
  max: number
} {
  const yn = yearNum(d.year)

  if (yn <= 8) {
    const pool = SIMPLE_SUBJECT_POOLS[d.broadCurriculum] ?? SIMPLE_SUBJECT_POOLS.ks3
    return { mode: 'simple', pool, max: 3 }
  }

  if (yn === 9) {
    if (d.y9NextYear === 'igcse_gcse') return { mode: 'simple', pool: Y9_IGCSE_SUBJECTS, max: 5 }
    if (d.y9NextYear === 'ibmyp') return { mode: 'simple', pool: SIMPLE_SUBJECT_POOLS.ibmyp, max: 3 }
    return { mode: 'simple', pool: SIMPLE_SUBJECT_POOLS.ks3, max: 3 }
  }

  if (yn === 10 || yn === 11) {
    if (d.broadCurriculum === 'igcse_gcse') return { mode: 'board', boardSubjects: IGCSE_SUBJECTS, max: 12 }
    const pool = SIMPLE_SUBJECT_POOLS[d.broadCurriculum] ?? SIMPLE_SUBJECT_POOLS.ibmyp
    return { mode: 'simple', pool, max: 3 }
  }

  if (yn >= 12) {
    if (d.broadCurriculum === 'ibdp') return { mode: 'ibdp', ibdpSubjects: IBDP_SUBJECTS, max: 8 }
    if (d.broadCurriculum === 'alevel') return { mode: 'board', boardSubjects: ALEVEL_SUBJECTS, max: 8 }
    return { mode: 'simple', pool: SIMPLE_SUBJECT_POOLS.other_curr, max: 3 }
  }

  return { mode: 'simple', pool: SIMPLE_SUBJECT_POOLS.ks3, max: 3 }
}

// ── Shared UI components ───────────────────────────────────────────────

const btnPrimary = "flex-[2] h-12 rounded-xl bg-[#670938] text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_4px_20px_rgba(103,9,56,0.5)] disabled:opacity-40 disabled:hover:shadow-none disabled:cursor-not-allowed"
const btnBack = "flex-1 h-12 rounded-xl border border-bone bg-white text-dark text-sm font-medium transition-all duration-200 hover:bg-gray-faint/50"
const inputClass = "w-full rounded-xl border border-bone bg-gray-faint/50 px-4 py-3 text-sm text-dark placeholder:text-gray-mid focus:border-teal focus:ring-2 focus:ring-teal-soft"

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
        selected
          ? 'border-[#670938] bg-[#670938]/5 text-[#670938] ring-2 ring-[#670938]/20'
          : 'border-bone bg-white text-dark hover:border-gray-light hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      {children}
    </button>
  )
}

function OptionCard({
  selected, onClick, emoji, label, description,
}: {
  selected: boolean; onClick: () => void; emoji: string; label: string; description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-[#670938] bg-[#670938]/5 ring-2 ring-[#670938]/20'
          : 'border-bone bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:border-gray-light'
      }`}
    >
      <span className="text-xl mt-0.5">{emoji}</span>
      <div>
        <p className="font-medium text-dark text-[0.95rem]">{label}</p>
        <p className="text-sm text-gray-rm leading-snug">{description}</p>
      </div>
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────

const INITIAL_DATA: Data = {
  userName: '', lastName: '', school: '', year: '', broadCurriculum: '',
  y9NextYear: '', whatsNext: '', simpleSubjects: [], otherSubjects: [],
  challenges: [], parentEmail: '', childName: '', teachSubjects: [],
  yearGroups: [], curriculum: '', customCurrText: '', teacherGoals: [],
  parentSubjects: [], parentGoals: [],
}

export default function OnboardingPage() {
  const [step, setStep] = React.useState<Step>('welcome')
  const [d, setD] = React.useState<Data>({ ...INITIAL_DATA })
  const [examBoard, setExamBoard] = React.useState<BoardKey>('Cambridge')
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const { user } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (step === 'welcome') {
      const t = setTimeout(() => setStep('role'), 3500)
      return () => clearTimeout(t)
    }
  }, [step])

  const update = (patch: Partial<Data>) => setD(prev => ({ ...prev, ...patch }))

  const toggleInArray = (key: keyof Data, id: string, max?: number) => {
    setD(prev => {
      const arr = prev[key] as string[]
      if (arr.includes(id)) return { ...prev, [key]: arr.filter(v => v !== id) }
      if (max && arr.length >= max) return prev
      return { ...prev, [key]: [...arr, id] }
    })
  }

  const toggleBoardSubject = (
    subj: { id: string; label: string; code: string },
    board: BoardKey,
  ) => {
    setD(prev => {
      const cur = prev.otherSubjects
      const exists = cur.find(s => s.id === subj.id)
      if (exists) return { ...prev, otherSubjects: cur.filter(s => s.id !== subj.id) }
      return { ...prev, otherSubjects: [...cur, { id: subj.id, label: subj.label, code: subj.code, board }] }
    })
  }

  const toggleIBSubject = (subj: { id: string; label: string }) => {
    setD(prev => {
      const cur = prev.otherSubjects
      const exists = cur.find(s => s.id === subj.id)
      if (exists) return { ...prev, otherSubjects: cur.filter(s => s.id !== subj.id) }
      return { ...prev, otherSubjects: [...cur, { id: subj.id, label: subj.label, level: 'HL' }] }
    })
  }

  const toggleIBLevel = (id: string) => {
    setD(prev => ({
      ...prev,
      otherSubjects: prev.otherSubjects.map(s =>
        s.id === id ? { ...s, level: s.level === 'HL' ? 'SL' : 'HL' } : s
      ),
    }))
  }

  const goNext = async () => {
    const next = nextStep(step, d)
    if (next === 'complete') {
      setSubmitting(true)
      setError('')
      const payload: Record<string, unknown> = { role: d.role, userName: d.userName, lastName: d.lastName }

      if (d.role === 'student') {
        payload.school = d.school
        payload.year = d.year
        payload.broadCurriculum = d.broadCurriculum
        if (d.y9NextYear) payload.y9NextYear = d.y9NextYear
        if (d.whatsNext) payload.whatsNext = d.whatsNext
        if (d.simpleSubjects.length) payload.simpleSubjects = d.simpleSubjects
        if (d.otherSubjects.length) payload.otherSubjects = d.otherSubjects
        payload.challenges = d.challenges
        if (d.parentEmail) payload.parentEmail = d.parentEmail
      } else if (d.role === 'teacher') {
        payload.teachSubjects = d.teachSubjects
        payload.yearGroups = d.yearGroups
        payload.curriculum = d.curriculum
        if (d.customCurrText) payload.customCurrText = d.customCurrText
        payload.teacherGoals = d.teacherGoals
      } else if (d.role === 'parent') {
        payload.childName = d.childName
        payload.school = d.school
        payload.year = d.year
        payload.parentSubjects = d.parentSubjects
        payload.parentGoals = d.parentGoals
      }

      const res = await completeOnboarding(payload)
      if (res.success) {
        await user?.reload()
        router.push('/dashboard')
      } else {
        setError(res.error ?? 'Something went wrong')
        setSubmitting(false)
      }
      return
    }
    setStep(next)
  }

  const goBack = () => setStep(prevStep(step, d))

  const progress = getProgress(step, d)
  const subjectConfig = step === 'studentSubjects' ? getSubjectConfig(d) : null
  const yn = yearNum(d.year)

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-svh flex-col bg-[#F2EDEC]">
      {/* Header */}
      <div className="w-full max-w-[1200px] mx-auto px-6 pt-4">
        <div className="flex items-center justify-center mb-4">
          <Image src="/Logo.svg" alt="ReviseMate" width={140} height={40} />
        </div>
        {step !== 'welcome' && (
          <div className="w-full max-w-[420px] mx-auto h-1.5 rounded-full bg-bone overflow-hidden">
            <div
              className="h-full rounded-full bg-[#670938] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div key={step} className="w-full max-w-[520px] fi">

          {/* ─── Welcome ─── */}
          {step === 'welcome' && (
            <div className="text-center space-y-4">
              <h1 className="font-serif text-[3rem] sm:text-[4rem] font-normal leading-tight">
                Welcome to <span className="italic">ReviseMate</span>
              </h1>
              <p className="text-gray-rm text-lg">Let&apos;s get you set up in just a moment...</p>
            </div>
          )}

          {/* ─── Role ─── */}
          {step === 'role' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">I am a...</h1>
                <p className="text-gray-rm text-[0.95rem]">Choose your role to personalise your experience</p>
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {([
                  { id: 'student' as Role, label: 'Student', desc: 'I want to revise smarter and track my progress', icon: <GraduationCap className="size-6" />, color: 'bg-[#525E7F]', ring: 'border-[#525E7F] bg-[#525E7F]/5 ring-2 ring-[#525E7F]/20' },
                  { id: 'teacher' as Role, label: 'Teacher', desc: 'I want to support my students and track their growth', icon: <BookOpen className="size-6" />, color: 'bg-[#670938]', ring: 'border-[#670938] bg-[#670938]/5 ring-2 ring-[#670938]/20' },
                  { id: 'parent' as Role, label: 'Parent', desc: "I want to stay informed about my child's learning", icon: <Heart className="size-6" />, color: 'bg-[#BA1A1A]', ring: 'border-[#BA1A1A] bg-[#BA1A1A]/5 ring-2 ring-[#BA1A1A]/20' },
                ]).map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => update({ role: r.id })}
                    className={`flex items-center gap-4 w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                      d.role === r.id ? r.ring : 'border-bone bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    <div className={`flex items-center justify-center size-12 rounded-xl text-white ${r.color}`}>{r.icon}</div>
                    <div>
                      <p className="font-medium text-dark text-[0.95rem]">{r.label}</p>
                      <p className="text-sm text-gray-rm">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button type="button" onClick={goNext} disabled={!d.role} className={btnPrimary + ' w-full'}>Continue</button>
            </>
          )}

          {/* ─── Student: Name ─── */}
          {step === 'studentName' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What&apos;s your name?</h1>
                <p className="text-gray-rm text-[0.95rem]">We&apos;ll use this to personalise your experience</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fn" className="text-sm font-medium text-dark">First name</label>
                  <input id="fn" value={d.userName} onChange={e => update({ userName: e.target.value })} placeholder="e.g. Sarah" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ln" className="text-sm font-medium text-dark">Last name</label>
                  <input id="ln" value={d.lastName} onChange={e => update({ lastName: e.target.value })} placeholder="e.g. Johnson" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.userName.trim() || !d.lastName.trim()} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Student: School ─── */}
          {step === 'studentSchool' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What school do you go to?</h1>
                <p className="text-gray-rm text-[0.95rem]">
                  {yn >= 10 && yn <= 11 ? 'Optional — you can skip this' : 'Start typing to search'}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8">
                <input value={d.school} onChange={e => update({ school: e.target.value })} placeholder="Type to search..." className={inputClass} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={yn >= 10 && yn <= 11 ? false : !d.school.trim()}
                  className={btnPrimary}
                >
                  {yn >= 10 && yn <= 11 && !d.school.trim() ? 'Skip' : 'Continue'}
                </button>
              </div>
            </>
          )}

          {/* ─── Student: Year & Programme ─── */}
          {step === 'studentYear' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">Year &amp; programme</h1>
                <p className="text-gray-rm text-[0.95rem]">Select your year group and curriculum</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-medium text-dark mb-3">Year group</p>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map(y => (
                      <Chip
                        key={y}
                        selected={d.year === y}
                        onClick={() => update({ year: y, broadCurriculum: '', y9NextYear: '', whatsNext: '', simpleSubjects: [], otherSubjects: [] })}
                      >
                        {y}
                      </Chip>
                    ))}
                  </div>
                </div>
                {d.year && (
                  <div>
                    <p className="text-sm font-medium text-dark mb-3">Curriculum</p>
                    <div className="flex flex-wrap gap-2">
                      {CURRICULUM_BY_YEAR[d.year as Year]?.map(c => (
                        <Chip
                          key={c.id}
                          selected={d.broadCurriculum === c.id}
                          onClick={() => update({ broadCurriculum: c.id, simpleSubjects: [], otherSubjects: [] })}
                        >
                          {c.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.year || !d.broadCurriculum} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Student: What's Next? (Y9 / Y11) ─── */}
          {step === 'studentWhatsNext' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
                  {d.year === 'Year 9' ? "What's next?" : 'Almost done!'}
                </h1>
                <p className="text-gray-rm text-[0.95rem]">
                  {d.year === 'Year 9'
                    ? "Year 10 is coming up — know what programme you're heading into?"
                    : "You'll be in Year 12 next year — know what you're doing?"}
                </p>
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {(d.year === 'Year 9' ? Y9_NEXT_YEAR_OPTIONS : Y11_WHATS_NEXT_OPTIONS).map(o => (
                  <Chip
                    key={o.id}
                    selected={(d.year === 'Year 9' ? d.y9NextYear : d.whatsNext) === o.id}
                    onClick={() => {
                      if (d.year === 'Year 9') update({ y9NextYear: o.id, simpleSubjects: [], otherSubjects: [] })
                      else update({ whatsNext: o.id })
                    }}
                  >
                    {o.label}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={d.year === 'Year 9' ? !d.y9NextYear : !d.whatsNext}
                  className={btnPrimary}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ─── Student: Subjects ─── */}
          {step === 'studentSubjects' && subjectConfig && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">Pick your subjects</h1>
                <p className="text-gray-rm text-[0.95rem]">
                  {subjectConfig.max < 99 ? `Select up to ${subjectConfig.max}` : 'Select your subjects'}
                </p>
              </div>

              {/* Simple subjects */}
              {subjectConfig.mode === 'simple' && subjectConfig.pool && (
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {subjectConfig.pool.map(s => (
                    <Chip
                      key={s.id}
                      selected={d.simpleSubjects.includes(s.id)}
                      onClick={() => toggleInArray('simpleSubjects', s.id, subjectConfig.max)}
                    >
                      {s.emoji} {s.label}
                    </Chip>
                  ))}
                </div>
              )}

              {/* Board-based subjects (IGCSE / A-Level) */}
              {subjectConfig.mode === 'board' && subjectConfig.boardSubjects && (
                <div className="bg-white rounded-2xl border border-bone p-6 mb-8">
                  <div className="flex gap-2 mb-5">
                    {(['Cambridge', 'Edexcel'] as BoardKey[]).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setExamBoard(b)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          examBoard === b
                            ? 'bg-[#670938] text-white'
                            : 'bg-gray-faint text-gray-rm hover:text-dark'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjectConfig.boardSubjects[examBoard].map(s => {
                      const sel = d.otherSubjects.some(o => o.id === s.id)
                      return (
                        <Chip key={s.id} selected={sel} onClick={() => toggleBoardSubject(s, examBoard)}>
                          {s.label} <span className="text-xs text-gray-mid ml-1">({s.code})</span>
                        </Chip>
                      )
                    })}
                  </div>
                  {d.otherSubjects.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-bone">
                      <p className="text-xs text-gray-mid mb-2">Selected ({d.otherSubjects.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {d.otherSubjects.map(s => (
                          <span key={s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#670938]/10 text-[#670938] text-xs font-medium">
                            {s.label}
                            <button type="button" onClick={() => toggleBoardSubject(s as { id: string; label: string; code: string }, s.board as BoardKey)} className="text-[#670938]/50 hover:text-[#670938]">&times;</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IBDP subjects with HL/SL */}
              {subjectConfig.mode === 'ibdp' && subjectConfig.ibdpSubjects && (
                <div className="bg-white rounded-2xl border border-bone p-6 mb-8">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {subjectConfig.ibdpSubjects.map(s => {
                      const sel = d.otherSubjects.some(o => o.id === s.id)
                      return (
                        <Chip key={s.id} selected={sel} onClick={() => toggleIBSubject(s)}>
                          {s.label}
                        </Chip>
                      )
                    })}
                  </div>
                  {d.otherSubjects.length > 0 && (
                    <div className="pt-4 border-t border-bone">
                      <p className="text-xs text-gray-mid mb-3">Set level for each subject</p>
                      <div className="flex flex-col gap-2">
                        {d.otherSubjects.map(s => (
                          <div key={s.id} className="flex items-center justify-between rounded-xl border border-bone px-4 py-2.5">
                            <span className="text-sm font-medium text-dark">{s.label}</span>
                            <button
                              type="button"
                              onClick={() => toggleIBLevel(s.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                s.level === 'HL'
                                  ? 'bg-[#670938] text-white'
                                  : 'bg-[#525E7F] text-white'
                              }`}
                            >
                              {s.level}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={subjectConfig.mode === 'simple' ? d.simpleSubjects.length === 0 : d.otherSubjects.length === 0}
                  className={btnPrimary}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ─── Student: Challenges ─── */}
          {step === 'studentChallenges' && (() => {
            const isLast = nextStep('studentChallenges', d) === 'complete'
            return (
              <>
                <div className="text-center space-y-2 mb-8">
                  <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
                    What do you struggle with?
                  </h1>
                  <p className="text-gray-rm text-[0.95rem]">Select all that apply</p>
                </div>
                <div className="flex flex-col gap-3 mb-8">
                  {(yn <= 9 ? YOUNGER_CHALLENGES : OLDER_CHALLENGES).map(c => (
                    <OptionCard
                      key={c.id}
                      emoji={c.emoji}
                      label={c.label}
                      description=""
                      selected={d.challenges.includes(c.id)}
                      onClick={() => toggleInArray('challenges', c.id)}
                    />
                  ))}
                </div>
                {error && isLast && <p className="text-sm text-[#BA1A1A] text-center mb-4">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={goBack} className={btnBack}>Back</button>
                  <button type="button" onClick={goNext} disabled={d.challenges.length === 0 || submitting} className={btnPrimary}>
                    {submitting ? 'Setting up...' : isLast ? "Let's go" : 'Continue'}
                  </button>
                </div>
              </>
            )
          })()}

          {/* ─── Student: Parent Email ─── */}
          {step === 'studentParentEmail' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">Parent / guardian email</h1>
                <p className="text-gray-rm text-[0.95rem]">Required for students under 16</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pemail" className="text-sm font-medium text-dark">Email address</label>
                  <input
                    id="pemail"
                    type="email"
                    value={d.parentEmail}
                    onChange={e => update({ parentEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              {error && <p className="text-sm text-[#BA1A1A] mt-4 text-center">{error}</p>}
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.parentEmail.includes('@') || submitting} className={btnPrimary}>
                  {submitting ? 'Setting up...' : "Let's go"}
                </button>
              </div>
            </>
          )}

          {/* ─── Teacher: Name ─── */}
          {step === 'teacherName' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What&apos;s your name?</h1>
                <p className="text-gray-rm text-[0.95rem]">We&apos;ll use this to personalise your experience</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tfn" className="text-sm font-medium text-dark">First name</label>
                  <input id="tfn" value={d.userName} onChange={e => update({ userName: e.target.value })} placeholder="e.g. Mr. Smith" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tln" className="text-sm font-medium text-dark">Last name</label>
                  <input id="tln" value={d.lastName} onChange={e => update({ lastName: e.target.value })} placeholder="e.g. Jones" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.userName.trim() || !d.lastName.trim()} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Teacher: Subjects & Year Groups ─── */}
          {step === 'teacherSubjects' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What do you teach?</h1>
                <p className="text-gray-rm text-[0.95rem]">Select your subjects and year groups</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-medium text-dark mb-3">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {TEACHER_SUBJECTS.map(s => (
                      <Chip key={s.id} selected={d.teachSubjects.includes(s.id)} onClick={() => toggleInArray('teachSubjects', s.id)}>
                        {s.emoji} {s.label}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark mb-3">Year groups</p>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map(y => (
                      <Chip key={y} selected={d.yearGroups.includes(y)} onClick={() => toggleInArray('yearGroups', y)}>
                        {y}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={d.teachSubjects.length === 0 || d.yearGroups.length === 0} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Teacher: Curricula ─── */}
          {step === 'teacherCurricula' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">Which curricula do you teach?</h1>
                <p className="text-gray-rm text-[0.95rem]">Select one</p>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                {TEACHER_CURRICULA.map(c => (
                  <Chip key={c.id} selected={d.curriculum === c.id} onClick={() => update({ curriculum: c.id, customCurrText: '' })}>
                    {c.label}
                  </Chip>
                ))}
              </div>
              {d.curriculum === 'other_curr' && (
                <div className="bg-white rounded-2xl border border-bone p-6 mb-4">
                  <input
                    value={d.customCurrText}
                    onChange={e => update({ customCurrText: e.target.value })}
                    placeholder="e.g. Australian Curriculum, CBSE, IB PYP..."
                    className={inputClass}
                  />
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!d.curriculum || (d.curriculum === 'other_curr' && !d.customCurrText.trim())}
                  className={btnPrimary}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ─── Teacher: Struggles ─── */}
          {step === 'teacherStruggles' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">Biggest teaching struggles?</h1>
                <p className="text-gray-rm text-[0.95rem]">Pick your top 2</p>
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {TEACHER_STRUGGLES.map(s => (
                  <OptionCard
                    key={s.id}
                    emoji={s.emoji}
                    label={s.label}
                    description={s.description}
                    selected={d.teacherGoals.includes(s.id)}
                    onClick={() => toggleInArray('teacherGoals', s.id, 2)}
                  />
                ))}
              </div>
              {error && <p className="text-sm text-[#BA1A1A] text-center mb-4">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={d.teacherGoals.length === 0 || submitting} className={btnPrimary}>
                  {submitting ? 'Setting up...' : "Let's go"}
                </button>
              </div>
            </>
          )}

          {/* ─── Parent: Name ─── */}
          {step === 'parentName' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What&apos;s your name?</h1>
                <p className="text-gray-rm text-[0.95rem]">We&apos;ll use this to personalise your experience</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pfn" className="text-sm font-medium text-dark">First name</label>
                  <input id="pfn" value={d.userName} onChange={e => update({ userName: e.target.value })} placeholder="e.g. Sarah" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pln" className="text-sm font-medium text-dark">Last name</label>
                  <input id="pln" value={d.lastName} onChange={e => update({ lastName: e.target.value })} placeholder="e.g. Williams" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.userName.trim() || !d.lastName.trim()} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Parent: Child's Name ─── */}
          {step === 'parentChildName' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What&apos;s your child&apos;s name?</h1>
                <p className="text-gray-rm text-[0.95rem]">We&apos;ll use it throughout the app</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8">
                <input
                  value={d.childName}
                  onChange={e => update({ childName: e.target.value })}
                  placeholder="e.g. Emma"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={!d.childName.trim()} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Parent: School ─── */}
          {step === 'parentSchool' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
                  What school does {d.childName || 'your child'} go to?
                </h1>
                <p className="text-gray-rm text-[0.95rem]">Optional — you can skip this</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8">
                <input value={d.school} onChange={e => update({ school: e.target.value })} placeholder="Type to search..." className={inputClass} />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} className={btnPrimary}>
                  {d.school.trim() ? 'Continue' : 'Skip'}
                </button>
              </div>
            </>
          )}

          {/* ─── Parent: Subjects & Year ─── */}
          {step === 'parentSubjects' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
                  What does {d.childName || 'your child'} need help with?
                </h1>
                <p className="text-gray-rm text-[0.95rem]">Select subjects and year group</p>
              </div>
              <div className="bg-white rounded-2xl border border-bone p-8 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-medium text-dark mb-3">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {PARENT_SUBJECTS.map(s => (
                      <Chip key={s.id} selected={d.parentSubjects.includes(s.id)} onClick={() => toggleInArray('parentSubjects', s.id)}>
                        {s.emoji} {s.label}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark mb-3">What year are they in?</p>
                  <div className="flex flex-wrap gap-2">
                    {YEARS.map(y => (
                      <Chip key={y} selected={d.year === y} onClick={() => update({ year: y })}>
                        {y}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={d.parentSubjects.length === 0 || !d.year} className={btnPrimary}>Continue</button>
              </div>
            </>
          )}

          {/* ─── Parent: Goals ─── */}
          {step === 'parentGoals' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="font-serif text-[2.5rem] font-normal leading-tight">What matters most to you?</h1>
                <p className="text-gray-rm text-[0.95rem]">Select all that apply</p>
              </div>
              <div className="flex flex-col gap-3 mb-8">
                {PARENT_GOALS.map(g => (
                  <OptionCard
                    key={g.id}
                    emoji={g.emoji}
                    label={g.label}
                    description={g.description}
                    selected={d.parentGoals.includes(g.id)}
                    onClick={() => toggleInArray('parentGoals', g.id)}
                  />
                ))}
              </div>
              {error && <p className="text-sm text-[#BA1A1A] text-center mb-4">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={btnBack}>Back</button>
                <button type="button" onClick={goNext} disabled={d.parentGoals.length === 0 || submitting} className={btnPrimary}>
                  {submitting ? 'Setting up...' : "Let's go"}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
