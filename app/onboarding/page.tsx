'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { completeOnboarding } from './_actions'
import {
  C, ROLES, YEARS, BROAD_CURRICULA_BY_YEAR, BROAD_CURRICULA_META,
  SIMPLE_SUBJECTS_KS3, SIMPLE_SUBJECTS_GCSE, SIMPLE_SUBJECTS_MYP,
  CORE_SUBJECTS_ALEVEL, CORE_SUBJECTS_IBDP, IB_MATH_COURSES,
  IGCSE_CORE_COURSES, CHALLENGES, CHALLENGES_Y78,
  TEACHER_GOALS, TEACHER_SUBJECTS, PARENT_GOALS,
  OTHER_CURRICULA, Y9_NEXT_OPTIONS, WHATS_NEXT_OPTIONS,
  SCHOOLS_BY_CITY, CITIES, CURRICULA_BY_YEAR, SUBJECTS, SUBJECTS_BY_CURRICULUM,
} from './constants'

type Phase = 'welcome' | 'role' | 'flow' | 'done'
interface OtherSubject { id: string; label: string; board?: string; code?: string; level?: string; sub?: string }

const accent = C.teal
const accentSoft = C.tealSoft

function Chk({ a }: { a?: string }) {
  return (
    <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 99, background: a || C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  )
}

function RecapRow({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.bone}`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, width: 70, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: C.dark, padding: '4px 10px', borderRadius: 8, background: bg }}>{value}</span>
    </div>
  )
}

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [phase, setPhase] = React.useState<Phase>('welcome')
  const [fade, setFade] = React.useState(true)
  const [role, setRole] = React.useState<string | null>(null)
  const [step, setStep] = React.useState(0)
  const [year, setYear] = React.useState<string | null>(null)
  const [yearGroups, setYearGroups] = React.useState<string[]>([])
  const [curriculum, setCurriculum] = React.useState<string | null>(null)
  const [subjects, setSubjects] = React.useState<string[]>([])
  const [challenges, setChallenges] = React.useState<string[]>([])
  const [goal, setGoal] = React.useState<string | null>(null)
  const [teacherGoals, setTeacherGoals] = React.useState<string[]>([])
  const [parentGoals, setParentGoals] = React.useState<string[]>([])
  const [childName, setChildName] = React.useState('')
  const [userName, setUserName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [school, setSchool] = React.useState('')
  const [city, setCity] = React.useState('')
  const [citySearch, setCitySearch] = React.useState('')
  const [schoolSearch, setSchoolSearch] = React.useState('')
  const [parentEmail, setParentEmail] = React.useState('')
  const [whatsNext, setWhatsNext] = React.useState<string | null>(null)
  const [teachType, setTeachType] = React.useState<string | null>(null)
  const [teachSubjects, setTeachSubjects] = React.useState<string[]>([])
  const [parentSubjects, setParentSubjects] = React.useState<string[]>([])
  const [broadCurriculum, setBroadCurriculum] = React.useState<string | null>(null)
  const [y9NextYear, setY9NextYear] = React.useState<string | null>(null)
  const [mathCourse, setMathCourse] = React.useState<string | null>(null)
  const [otherSubjects, setOtherSubjects] = React.useState<OtherSubject[]>([])
  const [simpleSubjects, setSimpleSubjects] = React.useState<string[]>([])
  const [freeSubjects, setFreeSubjects] = React.useState<string[]>([])
  const [freeSubjectInput, setFreeSubjectInput] = React.useState('')
  const [customCurrText, setCustomCurrText] = React.useState('')
  const [customCurrConfirmed, setCustomCurrConfirmed] = React.useState(false)
  const [ageConsent, setAgeConsent] = React.useState(false)
  const [error, setError] = React.useState('')
  const saveToConvex = useMutation(api.users.saveOnboardingData)

  const rd = ROLES.find(r => r.id === role)
  const isLower = ['Year 7','Year 8','Year 9'].includes(year || '')
  const isUpr = ['Year 12','Year 13'].includes(year || '')
  const isMid = ['Year 10','Year 11'].includes(year || '')

  const effectiveCurriculum = (year === 'Year 9' && y9NextYear === 'igcse_gcse') ? 'igcse_gcse' : broadCurriculum

  const simpleSubjectList = (year === 'Year 9' && y9NextYear === 'igcse_gcse') ? SIMPLE_SUBJECTS_GCSE
    : (year === 'Year 9' && y9NextYear === 'ibmyp') ? SIMPLE_SUBJECTS_MYP
    : (isUpr && broadCurriculum === 'alevel') ? CORE_SUBJECTS_ALEVEL
    : broadCurriculum === 'ibmyp' ? SIMPLE_SUBJECTS_MYP
    : SIMPLE_SUBJECTS_KS3

  const simpleSubjectMax = (year === 'Year 9' && y9NextYear === 'igcse_gcse') ? 5 : 3

  const allMathCourses = (effectiveCurriculum === 'igcse_gcse')
    ? [
        { id: '0580', label: 'CAIE Mathematics', sub: null, code: '0580' },
        { id: '4ma1', label: 'Edexcel Mathematics A', sub: null, code: '4MA1' },
      ]
    : broadCurriculum === 'alevel'
    ? [
        { id: '9709', label: 'CAIE Mathematics', sub: null, code: '9709' },
        { id: 'wma', label: 'Edexcel Mathematics', sub: null, code: 'WMA' },
      ]
    : broadCurriculum === 'ibdp'
    ? (IB_MATH_COURSES.ibdp || [])
    : []

  const availableCurricula = role === 'teacher'
    ? Object.entries(BROAD_CURRICULA_META)
        .filter(([id]) => !['olevel', 'btec'].includes(id))
        .map(([id, meta]) => ({ id, label: meta.label }))
    : year ? (CURRICULA_BY_YEAR[year] || []) : []

  const go = React.useCallback((fn: () => void) => {
    setFade(false)
    setTimeout(() => { fn(); setFade(true) }, 200)
  }, [])

  const toggle = (v: string, list: string[], set: React.Dispatch<React.SetStateAction<string[]>>, max?: number) => {
    if (list.includes(v)) set(list.filter(x => x !== v))
    else if (!max || list.length < max) set([...list, v])
  }

  const flows = React.useMemo(() => {
    const isLwr = ['Year 7','Year 8','Year 9'].includes(year || '')
    const isY9 = year === 'Year 9'

    const studentSteps: { key: string; q: string; note?: string }[] = [
      { key: 'name', q: "what's your name?" },
      { key: 'school', q: 'what school do you go to?', note: '' },
      { key: 'yearCurriculum', q: 'what year and programme?' },
    ]

    if (isY9 && broadCurriculum && broadCurriculum !== 'other_curr') {
      studentSteps.push({ key: 'y9NextYear', q: "Year 10 is coming up — know what programme you're heading into?", note: "so we can get you started on the right stuff" })
    }

    if (broadCurriculum === 'other_curr' && isLwr) {
      studentSteps.push({ key: 'customCurr', q: 'which curriculum are you following?', note: "start typing — we've got a big list" })
      studentSteps.push({ key: 'simpleSubjects', q: 'which subjects do you want help with?', note: 'pick the ones you want to focus on' })
    } else if (broadCurriculum === 'other_curr') {
      studentSteps.push({ key: 'customCurr', q: 'which curriculum are you following?', note: "start typing — we've got a big list" })
      studentSteps.push({ key: 'freeSubjects', q: 'which subjects do you need help with?', note: 'type them in — up to 5' })
    } else if (isY9 && y9NextYear === 'igcse_gcse') {
      studentSteps.push({ key: 'simpleSubjects', q: 'these are your core IGCSE subjects.', note: 'which ones do you want help with?' })
    } else if (isY9 && y9NextYear === 'ibmyp') {
      studentSteps.push({ key: 'simpleSubjects', q: 'which subjects do you want help with?', note: 'pick the ones you want to focus on' })
    } else if (isY9 && y9NextYear === 'other_unsure') {
      studentSteps.push({ key: 'simpleSubjects', q: 'which subjects do you want help with?', note: 'pick the ones you want to focus on' })
    } else if (!isY9 && isLwr && ['ks3','ibmyp'].includes(broadCurriculum || '')) {
      studentSteps.push({ key: 'simpleSubjects', q: 'which subjects do you want help with?', note: 'pick the ones you want to focus on' })
    } else if (!isLwr && !isUpr && broadCurriculum === 'ibmyp') {
      studentSteps.push({ key: 'simpleSubjects', q: 'which subjects do you want help with?', note: 'pick the ones you want to focus on' })
    } else if (!isLwr && !isUpr && broadCurriculum === 'igcse_gcse') {
      studentSteps.push({ key: 'otherSubjects', q: 'which core subjects do you want to get ahead in?', note: '' })
    } else if (isUpr && broadCurriculum === 'ibdp') {
      studentSteps.push({ key: 'otherSubjects', q: 'which core subjects do you want to get ahead in?', note: '' })
    } else if (isUpr && broadCurriculum === 'alevel') {
      studentSteps.push({ key: 'otherSubjects', q: 'which subjects do you need help with?', note: '' })
    }

    studentSteps.push({ key: 'challenges', q: 'What are your biggest revision struggles?', note: '' })

    if (year === 'Year 11') {
      studentSteps.push({ key: 'whatsNext', q: "almost done! you'll be in Year 12 next year — know what you're doing?", note: '' })
    }

    if (['Year 7','Year 8','Year 9'].includes(year || '')) {
      studentSteps.push({ key: 'parentEmail', q: "got a parent or guardian's email?", note: 'so we can keep them in the loop on what you\'re up to' })
    }

    return {
      student: studentSteps,
      teacher: [
        { key: 'name', q: "what's your name?", note: '' },
        { key: 'teachSubjects', q: 'what do you teach?', note: '' },
        { key: 'curriculum', q: 'which curricula do you teach?', note: '' },
        { key: 'teacherGoal', q: 'what are your biggest teaching struggles?', note: 'pick your top 2 — your answers shape what we build first' },
      ],
      parent: [
        { key: 'name', q: "what's your name?", note: '' },
        { key: 'childName', q: "what's your child's name?", note: '' },
        { key: 'school', q: 'what school do they go to?', note: '' },
        { key: 'parentSubjects', q: 'what does your child need help with?', note: '' },
        { key: 'parentGoal', q: 'what matters most to you?', note: '' },
      ],
    }
  }, [broadCurriculum, y9NextYear, year, isUpr])

  const flow = role ? flows[role as keyof typeof flows] : []
  const cur = flow[step]
  const total = flow.length

  const canGo = () => {
    if (phase === 'role') return !!role
    if (!cur) return false
    const k = cur.key
    if (k === 'name') return userName.trim().length > 0 && lastName.trim().length > 0
    if (k === 'school') return !!school || schoolSearch.trim().length > 0
    if (k === 'yearCurriculum') return !!year && !!broadCurriculum
    if (k === 'customCurr') return customCurrText.trim().length > 0 && customCurrConfirmed
    if (k === 'simpleSubjects') return simpleSubjects.length > 0
    if (k === 'freeSubjects') return freeSubjects.length > 0
    if (k === 'otherSubjects') return otherSubjects.length >= 1
    if (k === 'challenges') return challenges.length > 0
    if (k === 'y9NextYear') return !!y9NextYear
    if (k === 'parentEmail') return ageConsent
    if (k === 'whatsNext') return !!whatsNext
    if (k === 'teachSubjects') return teachSubjects.length > 0 && yearGroups.length > 0
    if (k === 'curriculum') return !!curriculum
    if (k === 'teacherGoal') return teacherGoals.length > 0
    if (k === 'parentSubjects') return parentSubjects.length > 0 && !!year
    if (k === 'parentGoal') return !!goal
    if (k === 'childName') return childName.trim().length > 0
    return false
  }

  const finish = async () => {
    const data = {
      role, userName, lastName, school, year, yearGroups,
      curriculum: effectiveCurriculum || broadCurriculum || curriculum,
      broadCurriculum, subjects, challenges, goal, teacherGoals, parentGoals,
      parentSubjects, childName, mathCourse, otherSubjects, simpleSubjects,
      freeSubjects, customCurrText, parentEmail, teachType, teachSubjects,
      y9NextYear, whatsNext,
    }

    try {
      // Save to Convex
      await saveToConvex({
        clerkId: user?.id || '',
        email: user?.primaryEmailAddress?.emailAddress,
        role: role || 'student',
        userName: userName || '',
        lastName: lastName || '',
        school: school || undefined,
        year: year || undefined,
        broadCurriculum: broadCurriculum || undefined,
        curriculum: (effectiveCurriculum || broadCurriculum || curriculum) || undefined,
        customCurrText: customCurrText || undefined,
        y9NextYear: y9NextYear || undefined,
        whatsNext: whatsNext || undefined,
        mathCourse: mathCourse || undefined,
        simpleSubjects: simpleSubjects.length > 0 ? simpleSubjects : undefined,
        freeSubjects: freeSubjects.length > 0 ? freeSubjects : undefined,
        otherSubjects: otherSubjects.length > 0 ? otherSubjects : undefined,
        challenges: challenges.length > 0 ? challenges : undefined,
        parentEmail: parentEmail || undefined,
        teachType: teachType || undefined,
        teachSubjects: teachSubjects.length > 0 ? teachSubjects : undefined,
        yearGroups: yearGroups.length > 0 ? yearGroups : undefined,
        teacherGoals: teacherGoals.length > 0 ? teacherGoals : undefined,
        childName: childName || undefined,
        parentSubjects: parentSubjects.length > 0 ? parentSubjects : undefined,
        parentGoals: parentGoals.length > 0 ? parentGoals : undefined,
        goal: goal || undefined,
      })
    } catch (e) {
      console.error('Failed to save to Convex:', e)
    }

    // Save to Clerk metadata (marks onboarding complete)
    const res = await completeOnboarding(data)
    if (res?.message) {
      await user?.reload()
      router.push('/dashboard')
    }
    if (res?.error) {
      setError(res.error)
    }
  }

  const next = () => {
    if (phase === 'welcome') return go(() => setPhase('role'))
    if (phase === 'role' && !role) return
    if (phase === 'role') return go(() => setPhase('flow'))
    if (!canGo()) return
    if (cur?.key === 'school' && !school && schoolSearch.trim()) {
      setSchool(schoolSearch.trim())
      setSchoolSearch('')
    }
    if (step < total - 1) return go(() => setStep(s => s + 1))
    go(() => setPhase('done'))
  }

  const back = () => go(() => {
    if (phase === 'done') { setPhase('flow'); setStep(total - 1) }
    else if (phase === 'flow' && step > 0) setStep(s => s - 1)
    else if (phase === 'flow') { setPhase('role'); setStep(0) }
    else if (phase === 'role') setPhase('welcome')
  })

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (phase === 'done') { finish(); return }
        if (phase === 'welcome' || (phase === 'role' && role) || (phase === 'flow' && canGo())) next()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const shell: React.CSSProperties = { minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Sora',sans-serif", background: C.pageBg, color: C.black }

  const OBHeader = () => (
    <header style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>🐟</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}><span>Revise</span><span style={{ color: C.orange }}>Mate</span></span>
      </div>
      {phase !== 'welcome' && <button onClick={back} style={{ fontSize: 13, fontWeight: 500, color: C.grayMid, background: 'none' }}>← back</button>}
    </header>
  )

  const OBCTA = ({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick?: () => void }) => (
    <div style={{ padding: '14px 32px 32px' }}>
      <button onClick={onClick || next} disabled={disabled} style={{
        width: '100%', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px',
        background: disabled ? C.bone : C.cord, color: disabled ? C.grayMid : C.white,
        cursor: disabled ? 'default' : 'pointer', border: 'none',
        boxShadow: disabled ? 'none' : `0 4px 20px ${C.cord}30`, transition: 'all .2s',
      }}>{label}</button>
    </div>
  )

  const filteredCities = citySearch.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8)
    : []

  const filteredSchools = city && schoolSearch.trim()
    ? (SCHOOLS_BY_CITY[city] || []).filter(s => s.toLowerCase().includes(schoolSearch.toLowerCase())).slice(0, 6)
    : []

  const filteredOtherCurr = customCurrText.trim()
    ? OTHER_CURRICULA.filter(c => c.label.toLowerCase().includes(customCurrText.toLowerCase())).slice(0, 8)
    : []

  // WELCOME PHASE
  if (phase === 'welcome') return (
    <div style={shell}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div className={fade ? 'fi' : 'fo'} style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 120, marginBottom: 16 }}>🐟</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.45, letterSpacing: '-0.5px', color: C.dark, marginBottom: 36 }}>
            hi mate! before we begin,<br/>we just have a <span className="italic-accent">few questions</span>
          </h1>
          <button onClick={next} style={{ padding: '16px 48px', borderRadius: 14, background: C.purple, color: C.white, fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px', border: 'none', cursor: 'pointer', boxShadow: `0 4px 16px ${C.purple}25` }}>let&apos;s go →</button>
        </div>
      </div>
    </div>
  )

  // ROLE SELECTION PHASE
  if (phase === 'role') return (
    <div style={shell}><OBHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div className={fade ? 'fi' : 'fo'} style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🐟</div>
          <h2 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.8px', marginBottom: 6, color: C.dark }}>first up — <span className="italic-accent">who are you</span>?</h2>
          <p style={{ fontSize: 13, color: C.gray, marginBottom: 32 }}>this shapes everything</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {ROLES.map(r => { const sel = role === r.id; return (
              <button key={r.id} onClick={() => setRole(r.id)} style={{ padding: '28px 16px 24px', borderRadius: 16, textAlign: 'center', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                {sel && <Chk a={C.white} />}
                <div style={{ width: 48, height: 48, borderRadius: 14, margin: '0 auto 14px', background: sel ? 'rgba(255,255,255,0.18)' : C.grayFaint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.id === 'student' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? C.white : C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 0 2.5 3 6 3s6-3 6-3v-5"/><line x1="22" y1="10" x2="22" y2="16"/></svg>}
                  {r.id === 'teacher' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? C.white : C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
                  {r.id === 'parent' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? C.white : C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: sel ? C.white : C.dark }}>{r.label}</div>
              </button>
            )})}
          </div>
        </div>
      </div>
      <OBCTA label="continue" disabled={!role} />
    </div>
  )

  // DONE PHASE
  if (phase === 'done') return (
    <div style={shell}><OBHeader />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div className={fade ? 'fi' : 'fo'} style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🐟</div>
          <h2 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '-0.8px', marginBottom: 8, color: C.dark }}>
            You&apos;re in, <span className="italic-accent">{userName || 'mate'}</span>.
          </h2>
          <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.6, marginBottom: 32 }}>
            {role === 'teacher' && "Your profile's set! Now time for the fun part."}
            {role === 'parent' && 'your job just got a little easier.'}
          </p>
          <div style={{ textAlign: 'left', borderRadius: 16, background: C.white, border: `1px solid ${C.bone}`, overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.bone}` }}><p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: C.grayMid }}>so, to recap</p></div>
            <RecapRow label="You are" value={rd?.label || ''} bg={C.orangeSoft} />
            {(userName || lastName) && <RecapRow label="Name" value={`${userName} ${lastName}`.trim()} bg={C.purpleSoft} />}
            {role === 'parent' && childName && <RecapRow label="Child" value={childName} bg={C.brownSoft} />}
            {school && <RecapRow label="School" value={school} bg={C.greenSoft} />}
            {year && <RecapRow label="Year" value={year} bg={C.brownSoft} />}
            {yearGroups.length > 0 && <RecapRow label="Years" value={yearGroups.join(', ')} bg={C.brownSoft} />}
            {(broadCurriculum || curriculum) && <RecapRow label="Curriculum" value={
              year === 'Year 9' && y9NextYear
                ? `${BROAD_CURRICULA_META[broadCurriculum || '']?.label || 'KS3'} → ${y9NextYear === 'igcse_gcse' ? 'IGCSE / GCSE' : y9NextYear === 'ibmyp' ? 'IB MYP' : 'TBC'}`
                : (BROAD_CURRICULA_META[broadCurriculum || '']?.label || BROAD_CURRICULA_META[curriculum || '']?.label || '')
            } bg={C.greenSoft} />}
            {simpleSubjects.length > 0 && <RecapRow label="Subjects" value={simpleSubjects.map(id => {
              const s = [...SIMPLE_SUBJECTS_KS3, ...SIMPLE_SUBJECTS_GCSE, ...SIMPLE_SUBJECTS_MYP].find(x => x.id === id)
              return s?.label || id
            }).join(', ')} bg={C.purpleSoft} />}
            {otherSubjects.length > 0 && <RecapRow label="Subjects" value={otherSubjects.map(s => `${s.label}${s.level ? ` ${s.level}` : ''}${s.code ? ` (${s.code})` : ''}`).join(', ')} bg={C.brownSoft} />}
            {freeSubjects.length > 0 && <RecapRow label="Subjects" value={freeSubjects.join(', ')} bg={C.purpleSoft} />}
            {teachSubjects.length > 0 && <RecapRow label="Subjects" value={teachSubjects.map(id => TEACHER_SUBJECTS.find(s => s.id === id)?.label).filter(Boolean).join(', ')} bg={C.purpleSoft} />}
            {parentSubjects.length > 0 && <RecapRow label="Subjects" value={parentSubjects.map(id => TEACHER_SUBJECTS.find(s => s.id === id)?.label).filter(Boolean).join(', ')} bg={C.purpleSoft} />}
            {challenges.length > 0 && <RecapRow label="Struggles" value={challenges.map(id => {
              const c = [...CHALLENGES, ...CHALLENGES_Y78].find(x => x.id === id)
              return c?.label || id
            }).join(', ')} bg={C.orangeSoft} />}
          </div>
          {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 12 }}>Error: {error}</p>}
        </div>
      </div>
      <OBCTA label="let's go →" onClick={finish} />
    </div>
  )

  // FLOW PHASE
  const k = cur?.key
  const currentChallenges = ['Year 7','Year 8'].includes(year || '') ? CHALLENGES_Y78 : CHALLENGES
  const availableBroadCurr = year ? (BROAD_CURRICULA_BY_YEAR[year] || []) : []

  return (
    <div style={shell}><OBHeader />
      {/* Progress bar */}
      <div style={{ padding: '0 32px 8px' }}>
        <div style={{ height: 3, background: C.bone, borderRadius: 99 }}>
          <div style={{ height: '100%', background: accent, borderRadius: 99, transition: 'width .3s', width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 32px', overflowY: 'auto' }}>
        <div className={fade ? 'fi' : 'fo'} style={{ maxWidth: 520, width: '100%' }}>
          {/* Step heading */}
          {cur && <h2 style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 8, color: C.dark, lineHeight: 1.4 }}>
            {k === 'name' && (
              role === 'parent'
                ? <>what&apos;s your <span className="italic-accent-bold">name</span>?</>
                : <>what&apos;s your <span className="italic-accent-bold">name</span>?</>
            )}
            {k === 'childName' && <>what&apos;s your <span className="italic-accent-bold">child&apos;s name</span>?</>}
            {k === 'school' && <>what <span className="italic-accent-bold">school</span> {role === 'teacher' ? 'do you teach at?' : role === 'parent' ? `does ${childName || 'your child'} go to?` : 'do you go to?'}</>}
            {k === 'yearCurriculum' && <>what <span className="italic-accent-bold">year</span> and <span className="italic-accent-bold">programme</span>?</>}
            {k === 'y9NextYear' && <><span className="italic-accent-bold">Year 10</span> is coming up — know what programme you&apos;re heading into?</>}
            {k === 'customCurr' && <>tell us about your <span className="italic-accent-bold">curriculum</span></>}
            {k === 'simpleSubjects' && (
              (year === 'Year 9' && y9NextYear === 'igcse_gcse')
                ? <>these are your core <span className="italic-accent-bold">IGCSE</span> subjects.</>
                : <>which <span className="italic-accent-bold">subjects</span> do you need help with?</>
            )}
            {k === 'freeSubjects' && <>which <span className="italic-accent-bold">subjects</span> do you need help with?</>}
            {k === 'otherSubjects' && (
              (isMid && broadCurriculum === 'igcse_gcse')
                ? <>which core <span className="italic-accent-bold">subjects</span> do you want to get ahead in?</>
                : (isUpr && broadCurriculum === 'ibdp')
                ? <>which core <span className="italic-accent-bold">subjects</span> do you want to get ahead in?</>
                : <>which <span className="italic-accent-bold">subjects</span> do you need help with?</>
            )}
            {k === 'challenges' && <>What are your biggest <span className="italic-accent-bold">revision struggles</span>?</>}
            {k === 'whatsNext' && <>almost done! you&apos;ll be in <span className="italic-accent-bold">Year 12</span> next year — know what you&apos;re doing?</>}
            {k === 'parentEmail' && <>got a <span className="italic-accent-bold">parent or guardian&apos;s</span> email?</>}
            {k === 'teachSubjects' && <>what do you <span className="italic-accent-bold">teach</span>?</>}
            {k === 'curriculum' && <>{role === 'teacher' ? 'which ' : 'what '}<span className="italic-accent-bold">{role === 'teacher' ? 'curricula' : 'curriculum'}</span>{role === 'teacher' ? ' do you teach?' : '?'}</>}
            {k === 'teacherGoal' && <>what are your biggest <span className="italic-accent-bold">teaching struggles</span>?</>}
            {k === 'parentSubjects' && <>What does <span className="italic-accent-bold">{childName || 'your child'}</span> need help with?</>}
            {k === 'parentGoal' && <>what <span className="italic-accent-bold">matters most</span> to you?</>}
          </h2>}
          {cur?.note && <p style={{ fontSize: 15, color: C.gray, marginBottom: 28, fontWeight: 400, letterSpacing: '-0.2px' }}>{cur.note}</p>}
          {!cur?.note && <div style={{ marginBottom: 20 }} />}

          {/* NAME STEP */}
          {k === 'name' && (
            <div style={{ display: 'flex', gap: 12, maxWidth: 400 }}>
              <input type="text" placeholder="first name" value={userName} onChange={e => setUserName(e.target.value)} style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${userName ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, boxShadow: userName ? `0 0 0 3px ${C.orangeSoft}` : 'none' }} />
              <input type="text" placeholder="last name" value={lastName} onChange={e => setLastName(e.target.value)} style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${lastName ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, boxShadow: lastName ? `0 0 0 3px ${C.orangeSoft}` : 'none' }} />
            </div>
          )}

          {/* CHILD NAME STEP */}
          {k === 'childName' && (
            <input type="text" placeholder="child's first name" value={childName} onChange={e => setChildName(e.target.value)} style={{ width: '100%', maxWidth: 400, padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${childName ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, boxShadow: childName ? `0 0 0 3px ${accentSoft}` : 'none' }} />
          )}

          {/* SCHOOL STEP */}
          {k === 'school' && (
            <div style={{ maxWidth: 400 }}>
              {!city ? (
                <div>
                  <input type="text" placeholder="search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${citySearch ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, marginBottom: 8, boxShadow: citySearch ? `0 0 0 3px ${accentSoft}` : 'none' }} />
                  {filteredCities.map(c => (
                    <button key={c} onClick={() => { setCity(c); setCitySearch('') }} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: C.white, border: `1px solid ${C.bone}`, marginBottom: 6, textAlign: 'left', fontSize: 14, fontWeight: 500, color: C.dark }}>{c}</button>
                  ))}
                </div>
              ) : !school ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.teal, background: C.tealSoft, padding: '4px 10px', borderRadius: 8 }}>{city}</span>
                    <button onClick={() => { setCity(''); setSchool(''); setSchoolSearch('') }} style={{ fontSize: 12, color: C.grayMid, background: 'none' }}>change</button>
                  </div>
                  <input type="text" placeholder="search school..." value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${schoolSearch ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, marginBottom: 8, boxShadow: schoolSearch ? `0 0 0 3px ${accentSoft}` : 'none' }} />
                  {filteredSchools.map(s => (
                    <button key={s} onClick={() => { setSchool(s); setSchoolSearch('') }} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: C.white, border: `1px solid ${C.bone}`, marginBottom: 6, textAlign: 'left', fontSize: 14, fontWeight: 500, color: C.dark }}>{s}</button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.teal, background: C.tealSoft, padding: '6px 14px', borderRadius: 10 }}>{school}</span>
                  <button onClick={() => { setSchool(''); setSchoolSearch('') }} style={{ fontSize: 12, color: C.grayMid, background: 'none' }}>change</button>
                </div>
              )}
            </div>
          )}

          {/* YEAR & CURRICULUM STEP */}
          {k === 'yearCurriculum' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
                {YEARS.map(y => { const sel = year === y.value; return (
                  <button key={y.value} onClick={() => { setYear(y.value); setBroadCurriculum(null) }} style={{ padding: '14px 6px 10px', borderRadius: 14, background: sel ? C.teal : C.white, textAlign: 'center', border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                    <div style={{ fontSize: 14, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, lineHeight: 1.2 }}>{y.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, marginTop: 3 }}>{y.grade}</div>
                  </button>
                )})}
              </div>
              {year && (
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 10 }}>Programme</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {availableBroadCurr.map(cid => {
                      const meta = BROAD_CURRICULA_META[cid]
                      if (!meta) return null
                      const sel = broadCurriculum === cid
                      return (
                        <button key={cid} onClick={() => setBroadCurriculum(cid)} style={{ padding: '14px 18px', borderRadius: 12, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                          {sel && <Chk />}
                          <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{meta.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Y9 NEXT YEAR */}
          {k === 'y9NextYear' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
              {Y9_NEXT_OPTIONS.map(opt => { const sel = y9NextYear === opt.id; return (
                <button key={opt.id} onClick={() => setY9NextYear(opt.id)} style={{ padding: '18px 20px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <span style={{ fontSize: 15, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{opt.label}</span>
                </button>
              )})}
            </div>
          )}

          {/* CUSTOM CURRICULUM */}
          {k === 'customCurr' && (
            <div style={{ maxWidth: 400 }}>
              <input type="text" placeholder="e.g. Australian HSC, French Bac..." value={customCurrText} onChange={e => { setCustomCurrText(e.target.value); setCustomCurrConfirmed(false) }} style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${customCurrText ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, marginBottom: 8, boxShadow: customCurrText ? `0 0 0 3px ${accentSoft}` : 'none' }} />
              {filteredOtherCurr.map(c => (
                <button key={c.id} onClick={() => { setCustomCurrText(c.label); setCustomCurrConfirmed(true) }} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: customCurrConfirmed && customCurrText === c.label ? C.tealSoft : C.white, border: `1px solid ${C.bone}`, marginBottom: 6, textAlign: 'left', fontSize: 14, fontWeight: 500, color: C.dark, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{c.label}</span>
                  <span style={{ fontSize: 11, color: C.grayMid }}>{c.region}</span>
                </button>
              ))}
              {customCurrText.trim() && filteredOtherCurr.length === 0 && (
                <button onClick={() => setCustomCurrConfirmed(true)} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: customCurrConfirmed ? C.tealSoft : C.white, border: `1px solid ${C.bone}`, fontSize: 14, fontWeight: 500, color: C.dark, textAlign: 'left' }}>
                  Use &quot;{customCurrText}&quot;
                </button>
              )}
            </div>
          )}

          {/* SIMPLE SUBJECTS */}
          {k === 'simpleSubjects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
              {simpleSubjectList.map((s: { id: string; label: string }) => { const sel = simpleSubjects.includes(s.id); return (
                <button key={s.id} onClick={() => toggle(s.id, simpleSubjects, setSimpleSubjects, simpleSubjectMax)} style={{ padding: '16px 18px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <span style={{ fontSize: 15, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{s.label}</span>
                </button>
              )})}
              <p style={{ fontSize: 11, color: C.grayMid, marginTop: 4 }}>pick up to {simpleSubjectMax}</p>
            </div>
          )}

          {/* FREE SUBJECTS */}
          {k === 'freeSubjects' && (
            <div style={{ maxWidth: 400 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="type a subject..." value={freeSubjectInput} onChange={e => setFreeSubjectInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && freeSubjectInput.trim() && freeSubjects.length < 5) { setFreeSubjects([...freeSubjects, freeSubjectInput.trim()]); setFreeSubjectInput('') } }} style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${freeSubjectInput ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white }} />
                <button onClick={() => { if (freeSubjectInput.trim() && freeSubjects.length < 5) { setFreeSubjects([...freeSubjects, freeSubjectInput.trim()]); setFreeSubjectInput('') } }} style={{ padding: '14px 18px', borderRadius: 12, background: C.teal, color: C.white, fontSize: 14, fontWeight: 600 }}>add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {freeSubjects.map((s, i) => (
                  <span key={i} style={{ padding: '8px 14px', borderRadius: 10, background: C.tealSoft, fontSize: 13, fontWeight: 600, color: C.teal, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s}
                    <button onClick={() => setFreeSubjects(freeSubjects.filter((_, j) => j !== i))} style={{ background: 'none', fontSize: 14, color: C.teal, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* OTHER SUBJECTS (IGCSE board-based, A-Level, IBDP) */}
          {k === 'otherSubjects' && (
            <div>
              {isMid && broadCurriculum === 'igcse_gcse' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 8 }}>Cambridge (CAIE)</p>
                    {IGCSE_CORE_COURSES.caie.map(s => {
                      const sel = otherSubjects.some(x => x.id === s.id)
                      return (
                        <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: 'Cambridge' }])} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1px solid ${C.bone}`, marginBottom: 6, transition: 'all .15s' }}>
                          {sel && <Chk />}
                          <div style={{ fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid }}>{s.code}</div>
                        </button>
                      )
                    })}
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 8 }}>Edexcel</p>
                    {IGCSE_CORE_COURSES.edexcel_ig.map(s => {
                      const sel = otherSubjects.some(x => x.id === s.id)
                      return (
                        <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: 'Edexcel' }])} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1px solid ${C.bone}`, marginBottom: 6, transition: 'all .15s' }}>
                          {sel && <Chk />}
                          <div style={{ fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{s.label}</div>
                          <div style={{ fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid }}>{s.code}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isUpr && broadCurriculum === 'ibdp' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
                  {CORE_SUBJECTS_IBDP.map(s => {
                    const sel = otherSubjects.some(x => x.id === s.id)
                    const existingSub = otherSubjects.find(x => x.id === s.id)
                    return (
                      <div key={s.id}>
                        <button onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label }])} style={{ width: '100%', padding: '16px 18px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                          {sel && <Chk />}
                          <span style={{ fontSize: 15, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{s.label}</span>
                          {existingSub?.level && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: sel ? 'rgba(255,255,255,0.8)' : C.grayMid }}>{existingSub.level}</span>}
                        </button>
                        {sel && !existingSub?.level && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 6, marginLeft: 16 }}>
                            {['HL', 'SL'].map(lvl => (
                              <button key={lvl} onClick={() => setOtherSubjects(otherSubjects.map(x => x.id === s.id ? { ...x, level: lvl } : x))} style={{ padding: '6px 16px', borderRadius: 8, background: C.white, border: `1.5px solid ${C.bone}`, fontSize: 12, fontWeight: 600, color: C.dark }}>{lvl}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 8 }}>Maths course</p>
                    {IB_MATH_COURSES.ibdp.map(mc => {
                      const sel = mathCourse === mc.id
                      return (
                        <button key={mc.id} onClick={() => setMathCourse(sel ? null : mc.id)} style={{ width: '100%', padding: '12px 16px', borderRadius: 10, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1px solid ${C.bone}`, marginBottom: 6, transition: 'all .15s' }}>
                          {sel && <Chk />}
                          <div style={{ fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{mc.label}</div>
                          {mc.sub && <div style={{ fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid }}>{mc.sub}</div>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isUpr && broadCurriculum === 'alevel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
                  {CORE_SUBJECTS_ALEVEL.map((s: { id: string; label: string; code?: string; board?: string }) => {
                    const sel = otherSubjects.some(x => x.id === s.id)
                    return (
                      <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: s.board }])} style={{ padding: '12px 16px', borderRadius: 10, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1px solid ${C.bone}`, transition: 'all .15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {sel && <Chk />}
                        <div>
                          <span style={{ fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{s.label}</span>
                          {s.code && <span style={{ marginLeft: 6, fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid }}>({s.code})</span>}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 500, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid }}>{s.board}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* CHALLENGES */}
          {k === 'challenges' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {currentChallenges.map(ch => { const sel = challenges.includes(ch.id); return (
                <button key={ch.id} onClick={() => toggle(ch.id, challenges, setChallenges)} style={{ padding: '16px 14px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  {ch.emoji && <div style={{ fontSize: 20, marginBottom: 6 }}>{ch.emoji}</div>}
                  <div style={{ fontSize: 13, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, marginBottom: 4 }}>{ch.label}</div>
                  {ch.quote && <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, lineHeight: 1.4, fontStyle: 'italic' }}>&ldquo;{ch.quote}&rdquo;</div>}
                </button>
              )})}
            </div>
          )}

          {/* WHATS NEXT (Y11) */}
          {k === 'whatsNext' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
              {WHATS_NEXT_OPTIONS.map(opt => { const sel = whatsNext === opt.id; return (
                <button key={opt.id} onClick={() => setWhatsNext(opt.id)} style={{ padding: '18px 20px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <span style={{ fontSize: 15, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{opt.label}</span>
                </button>
              )})}
            </div>
          )}

          {/* PARENT EMAIL */}
          {k === 'parentEmail' && (
            <div style={{ maxWidth: 400 }}>
              <input type="email" placeholder="parent@example.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: `1.5px solid ${parentEmail ? accent : C.bone}`, fontSize: 16, fontWeight: 500, color: C.black, background: C.white, marginBottom: 16, boxShadow: parentEmail ? `0 0 0 3px ${accentSoft}` : 'none' }} />
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={ageConsent} onChange={e => setAgeConsent(e.target.checked)} style={{ marginTop: 3, accentColor: C.teal }} />
                <span style={{ fontSize: 13, color: C.gray, lineHeight: 1.5 }}>I confirm I have permission from a parent or guardian to create this account</span>
              </label>
            </div>
          )}

          {/* TEACHER: SUBJECTS + YEAR GROUPS */}
          {k === 'teachSubjects' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {TEACHER_SUBJECTS.map(s => { const sel = teachSubjects.includes(s.id); return (
                  <button key={s.id} onClick={() => toggle(s.id, teachSubjects, setTeachSubjects)} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, cursor: 'pointer', transition: 'all .15s' }}>
                    {sel && <Chk />}
                    <div style={{ fontSize: 13, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, lineHeight: 1.2 }}>{s.label}</div>
                  </button>
                )})}
                <button onClick={() => toggle('t_other', teachSubjects, setTeachSubjects)} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', position: 'relative', background: teachSubjects.includes('t_other') ? C.teal : C.white, border: teachSubjects.includes('t_other') ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, cursor: 'pointer', transition: 'all .15s' }}>
                  {teachSubjects.includes('t_other') && <Chk />}
                  <div style={{ fontSize: 13, fontWeight: 600, color: teachSubjects.includes('t_other') ? C.white : C.dark }}>Other</div>
                </button>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 10 }}>Year groups you teach</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {YEARS.map(y => { const sel = yearGroups.includes(y.value); return (
                  <button key={y.value} onClick={() => toggle(y.value, yearGroups, setYearGroups)} style={{ padding: '14px 6px 10px', borderRadius: 12, position: 'relative', background: sel ? C.teal : C.grayFaint, textAlign: 'center', border: sel ? `2px solid ${C.teal}` : '2.5px solid transparent', cursor: 'pointer', transition: 'all .15s' }}>
                    {sel && <Chk />}
                    <div style={{ fontSize: 14, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark, lineHeight: 1.2 }}>{y.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, marginTop: 3 }}>{y.grade}</div>
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* TEACHER: CURRICULUM */}
          {k === 'curriculum' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
              {availableCurricula.map((c: { id: string; label: string }) => { const sel = curriculum === c.id; return (
                <button key={c.id} onClick={() => setCurriculum(c.id)} style={{ padding: '16px 18px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500, color: sel ? C.white : C.dark }}>{c.label}</span>
                </button>
              )})}
              {curriculum === 'other_curr' && (
                <input type="text" placeholder="e.g. Australian Curriculum, CBSE, IB PYP…" value={customCurrText} onChange={e => setCustomCurrText(e.target.value)} style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: `1.5px solid ${C.teal}`, fontSize: 14, color: C.black, background: C.white, marginTop: 8, boxShadow: `0 0 0 3px ${C.tealSoft}` }} />
              )}
            </div>
          )}

          {/* TEACHER: GOALS */}
          {k === 'teacherGoal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TEACHER_GOALS.map(g => { const sel = teacherGoals.includes(g.id); return (
                <button key={g.id} onClick={() => toggle(g.id, teacherGoals, setTeacherGoals, 2)} style={{ padding: '16px 14px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{g.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, marginBottom: 4 }}>{g.label}</div>
                  <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, lineHeight: 1.4 }}>{g.desc}</div>
                </button>
              )})}
            </div>
          )}

          {/* PARENT: SUBJECTS + YEAR */}
          {k === 'parentSubjects' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                {TEACHER_SUBJECTS.map(s => { const sel = parentSubjects.includes(s.id); return (
                  <button key={s.id} onClick={() => toggle(s.id, parentSubjects, setParentSubjects)} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, cursor: 'pointer', transition: 'all .15s' }}>
                    {sel && <Chk />}
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark }}>{s.label}</div>
                  </button>
                )})}
                <button onClick={() => toggle('t_other', parentSubjects, setParentSubjects)} style={{ padding: '16px 12px', borderRadius: 14, textAlign: 'center', position: 'relative', background: parentSubjects.includes('t_other') ? C.teal : C.white, border: parentSubjects.includes('t_other') ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, cursor: 'pointer', transition: 'all .15s' }}>
                  {parentSubjects.includes('t_other') && <Chk />}
                  <div style={{ fontSize: 12, fontWeight: 600, color: parentSubjects.includes('t_other') ? C.white : C.dark }}>Other</div>
                </button>
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: C.grayMid, marginBottom: 10 }}>What year is {childName || 'your child'} in?</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {YEARS.map(y => { const sel = year === y.value; return (
                  <button key={y.value} onClick={() => setYear(y.value)} style={{ padding: '14px 6px 10px', borderRadius: 14, background: sel ? C.teal : C.white, textAlign: 'center', border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                    <div style={{ fontSize: 14, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, lineHeight: 1.2 }}>{y.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, marginTop: 3 }}>{y.grade}</div>
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* PARENT: GOALS */}
          {k === 'parentGoal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PARENT_GOALS.map(g => { const sel = goal === g.id; return (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{ padding: '18px 16px', borderRadius: 14, textAlign: 'left', position: 'relative', background: sel ? C.teal : C.white, border: sel ? `2px solid ${C.teal}` : `1.5px solid ${C.bone}`, transition: 'all .15s' }}>
                  {sel && <Chk />}
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{g.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: sel ? 700 : 600, color: sel ? C.white : C.dark, marginBottom: 4 }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: sel ? 'rgba(255,255,255,0.7)' : C.grayMid, lineHeight: 1.4 }}>{g.desc}</div>
                </button>
              )})}
            </div>
          )}
        </div>
      </div>
      <OBCTA label={step === total - 1 ? "finish" : "continue"} disabled={!canGo()} />
    </div>
  )
}
