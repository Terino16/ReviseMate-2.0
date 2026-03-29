'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { completeOnboarding } from './_actions'
import {
  ROLES, YEARS, BROAD_CURRICULA_BY_YEAR, BROAD_CURRICULA_META,
  SIMPLE_SUBJECTS_KS3, SIMPLE_SUBJECTS_GCSE, SIMPLE_SUBJECTS_MYP,
  CORE_SUBJECTS_ALEVEL, CORE_SUBJECTS_IBDP, IB_MATH_COURSES,
  IGCSE_CORE_COURSES, CHALLENGES, CHALLENGES_Y78,
  TEACHER_GOALS, TEACHER_SUBJECTS, PARENT_GOALS,
  OTHER_CURRICULA, Y9_NEXT_OPTIONS, WHATS_NEXT_OPTIONS,
  SCHOOLS_BY_CITY, CITIES, CURRICULA_BY_YEAR,
} from './constants'

type Phase = 'welcome' | 'role' | 'flow' | 'done'
interface OtherSubject { id: string; label: string; board?: string; code?: string; level?: string; sub?: string }

function Chk({ bgClass = 'bg-teal' }: { bgClass?: string }) {
  return (
    <div className={`absolute top-2 right-2 w-[18px] h-[18px] rounded-full ${bgClass} flex items-center justify-center`}>
      <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  )
}

function RecapRow({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className="flex items-center gap-3 py-3 px-5 border-b border-bone">
      <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid w-[70px] shrink-0">{label}</span>
      <span className={`text-[13px] font-medium text-dark py-1 px-2.5 rounded-lg ${bg}`}>{value}</span>
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

  const shell = "min-h-screen flex flex-col bg-page-bg text-dark"

  const OBHeader = () => (
    <header className="flex items-center justify-between px-8 py-[18px]">
      <div className="flex items-center gap-2.5">
        <span className="text-[22px] font-bold">🐟</span>
        <span className="text-[15px] font-bold text-dark">Revise<span className="text-cord">Mate</span></span>
      </div>
      {phase !== 'welcome' && <button onClick={back} className="text-[13px] font-medium text-gray-mid bg-transparent">← back</button>}
    </header>
  )

  const OBCTA = ({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick?: () => void }) => (
    <div className="px-8 pt-3.5 pb-8">
      <button
        onClick={onClick || next}
        disabled={disabled}
        className={`w-full py-4 rounded-[14px] text-[15px] font-semibold tracking-[-0.2px] border-none transition-all ${
          disabled
            ? 'bg-bone text-gray-mid cursor-default'
            : 'bg-cord text-white cursor-pointer shadow-[0_4px_20px_#8C2F3930]'
        }`}
      >
        {label}
      </button>
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
    <div className={shell}>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={`${fade ? 'fi' : 'fo'} max-w-[380px] w-full text-center`}>
          <div className="text-[120px] mb-4">🐟</div>
          <h1 className="text-[28px] font-normal leading-[1.45] tracking-[-0.5px] text-dark mb-9">
            hi mate! before we begin,<br/>we just have a <span className="italic-accent">few questions</span>
          </h1>
          <button onClick={next} className="py-4 px-12 rounded-[14px] bg-dark text-white text-[15px] font-semibold tracking-[-0.2px] border-none cursor-pointer shadow-[0_4px_16px_#20283325]">let&apos;s go →</button>
        </div>
      </div>
    </div>
  )

  // ROLE SELECTION PHASE
  if (phase === 'role') return (
    <div className={shell}><OBHeader />
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={`${fade ? 'fi' : 'fo'} max-w-[520px] w-full text-center`}>
          <div className="text-[60px] mb-4">🐟</div>
          <h2 className="text-[26px] font-normal tracking-[-0.8px] mb-1.5 text-dark">first up — <span className="italic-accent">who are you</span>?</h2>
          <p className="text-[13px] text-gray-rm mb-8">this shapes everything</p>
          <div className="grid grid-cols-3 gap-3">
            {ROLES.map(r => { const sel = role === r.id; return (
              <button key={r.id} onClick={() => setRole(r.id)} className={`pt-7 px-4 pb-6 rounded-2xl text-center relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                {sel && <Chk bgClass="bg-white" />}
                <div className={`w-12 h-12 rounded-[14px] mx-auto mb-3.5 flex items-center justify-center ${sel ? 'bg-white/18' : 'bg-gray-faint'}`}>
                  {r.id === 'student' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? '#FFFFFF' : '#004953'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 0 2.5 3 6 3s6-3 6-3v-5"/><line x1="22" y1="10" x2="22" y2="16"/></svg>}
                  {r.id === 'teacher' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? '#FFFFFF' : '#004953'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
                  {r.id === 'parent' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={sel ? '#FFFFFF' : '#004953'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                </div>
                <div className={`text-[15px] font-bold ${sel ? 'text-white' : 'text-dark'}`}>{r.label}</div>
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
    <div className={shell}><OBHeader />
      <div className="flex-1 flex items-center justify-center px-8">
        <div className={`${fade ? 'fi' : 'fo'} max-w-[400px] w-full text-center`}>
          <div className="text-[60px] mb-4">🐟</div>
          <h2 className="text-[26px] font-normal tracking-[-0.8px] mb-2 text-dark">
            You&apos;re in, <span className="italic-accent">{userName || 'mate'}</span>.
          </h2>
          <p className="text-sm text-gray-rm leading-[1.6] mb-8">
            {role === 'teacher' && "Your profile's set! Now time for the fun part."}
            {role === 'parent' && 'your job just got a little easier.'}
          </p>
          <div className="text-left rounded-2xl bg-white border border-bone overflow-hidden mb-7">
            <div className="px-5 py-4 border-b border-bone"><p className="text-[10px] font-semibold uppercase tracking-[1px] text-gray-mid">so, to recap</p></div>
            <RecapRow label="You are" value={rd?.label || ''} bg="bg-cord-soft" />
            {(userName || lastName) && <RecapRow label="Name" value={`${userName} ${lastName}`.trim()} bg="bg-teal-soft" />}
            {role === 'parent' && childName && <RecapRow label="Child" value={childName} bg="bg-gray-faint" />}
            {school && <RecapRow label="School" value={school} bg="bg-green-soft" />}
            {year && <RecapRow label="Year" value={year} bg="bg-gray-faint" />}
            {yearGroups.length > 0 && <RecapRow label="Years" value={yearGroups.join(', ')} bg="bg-gray-faint" />}
            {(broadCurriculum || curriculum) && <RecapRow label="Curriculum" value={
              year === 'Year 9' && y9NextYear
                ? `${BROAD_CURRICULA_META[broadCurriculum || '']?.label || 'KS3'} → ${y9NextYear === 'igcse_gcse' ? 'IGCSE / GCSE' : y9NextYear === 'ibmyp' ? 'IB MYP' : 'TBC'}`
                : (BROAD_CURRICULA_META[broadCurriculum || '']?.label || BROAD_CURRICULA_META[curriculum || '']?.label || '')
            } bg="bg-green-soft" />}
            {simpleSubjects.length > 0 && <RecapRow label="Subjects" value={simpleSubjects.map(id => {
              const s = [...SIMPLE_SUBJECTS_KS3, ...SIMPLE_SUBJECTS_GCSE, ...SIMPLE_SUBJECTS_MYP].find(x => x.id === id)
              return s?.label || id
            }).join(', ')} bg="bg-teal-soft" />}
            {otherSubjects.length > 0 && <RecapRow label="Subjects" value={otherSubjects.map(s => `${s.label}${s.level ? ` ${s.level}` : ''}${s.code ? ` (${s.code})` : ''}`).join(', ')} bg="bg-gray-faint" />}
            {freeSubjects.length > 0 && <RecapRow label="Subjects" value={freeSubjects.join(', ')} bg="bg-teal-soft" />}
            {teachSubjects.length > 0 && <RecapRow label="Subjects" value={teachSubjects.map(id => TEACHER_SUBJECTS.find(s => s.id === id)?.label).filter(Boolean).join(', ')} bg="bg-teal-soft" />}
            {parentSubjects.length > 0 && <RecapRow label="Subjects" value={parentSubjects.map(id => TEACHER_SUBJECTS.find(s => s.id === id)?.label).filter(Boolean).join(', ')} bg="bg-teal-soft" />}
            {challenges.length > 0 && <RecapRow label="Struggles" value={challenges.map(id => {
              const c = [...CHALLENGES, ...CHALLENGES_Y78].find(x => x.id === id)
              return c?.label || id
            }).join(', ')} bg="bg-cord-soft" />}
          </div>
          {error && <p className="text-[#C0392B] text-[13px] mb-3">Error: {error}</p>}
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
    <div className={shell}><OBHeader />
      {/* Progress bar */}
      <div className="px-8 pb-2">
        <div className="h-[3px] bg-bone rounded-full">
          <div className="h-full bg-teal rounded-full transition-[width] duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-8 py-6 overflow-y-auto">
        <div className={`${fade ? 'fi' : 'fo'} max-w-[520px] w-full`}>
          {/* Step heading */}
          {cur && <h2 className="text-2xl font-normal tracking-[-0.5px] mb-2 text-dark leading-[1.4]">
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
          {cur?.note && <p className="text-[15px] text-gray-rm mb-7 font-normal tracking-[-0.2px]">{cur.note}</p>}
          {!cur?.note && <div className="mb-5" />}

          {/* NAME STEP */}
          {k === 'name' && (
            <div className="flex gap-3 max-w-[400px]">
              <input type="text" placeholder="first name" value={userName} onChange={e => setUserName(e.target.value)} className={`flex-1 py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white border-[1.5px] ${userName ? 'border-teal shadow-[0_0_0_3px_var(--color-cord-soft)]' : 'border-bone'}`} />
              <input type="text" placeholder="last name" value={lastName} onChange={e => setLastName(e.target.value)} className={`flex-1 py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white border-[1.5px] ${lastName ? 'border-teal shadow-[0_0_0_3px_var(--color-cord-soft)]' : 'border-bone'}`} />
            </div>
          )}

          {/* CHILD NAME STEP */}
          {k === 'childName' && (
            <input type="text" placeholder="child's first name" value={childName} onChange={e => setChildName(e.target.value)} className={`w-full max-w-[400px] py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white border-[1.5px] ${childName ? 'border-teal shadow-[0_0_0_3px_var(--color-teal-soft)]' : 'border-bone'}`} />
          )}

          {/* SCHOOL STEP */}
          {k === 'school' && (
            <div className="max-w-[400px]">
              {!city ? (
                <div>
                  <input type="text" placeholder="search city..." value={citySearch} onChange={e => setCitySearch(e.target.value)} className={`w-full py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white mb-2 border-[1.5px] ${citySearch ? 'border-teal shadow-[0_0_0_3px_var(--color-teal-soft)]' : 'border-bone'}`} />
                  {filteredCities.map(c => (
                    <button key={c} onClick={() => { setCity(c); setCitySearch('') }} className="w-full py-3 px-4 rounded-[10px] bg-white border border-bone mb-1.5 text-left text-sm font-medium text-dark">{c}</button>
                  ))}
                </div>
              ) : !school ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-teal bg-teal-soft py-1 px-2.5 rounded-lg">{city}</span>
                    <button onClick={() => { setCity(''); setSchool(''); setSchoolSearch('') }} className="text-xs text-gray-mid bg-transparent">change</button>
                  </div>
                  <input type="text" placeholder="search school..." value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} className={`w-full py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white mb-2 border-[1.5px] ${schoolSearch ? 'border-teal shadow-[0_0_0_3px_var(--color-teal-soft)]' : 'border-bone'}`} />
                  {filteredSchools.map(s => (
                    <button key={s} onClick={() => { setSchool(s); setSchoolSearch('') }} className="w-full py-3 px-4 rounded-[10px] bg-white border border-bone mb-1.5 text-left text-sm font-medium text-dark">{s}</button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-teal bg-teal-soft py-1.5 px-3.5 rounded-[10px]">{school}</span>
                  <button onClick={() => { setSchool(''); setSchoolSearch('') }} className="text-xs text-gray-mid bg-transparent">change</button>
                </div>
              )}
            </div>
          )}

          {/* YEAR & CURRICULUM STEP */}
          {k === 'yearCurriculum' && (
            <div>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {YEARS.map(y => { const sel = year === y.value; return (
                  <button key={y.value} onClick={() => { setYear(y.value); setBroadCurriculum(null) }} className={`pt-3.5 px-1.5 pb-2.5 rounded-[14px] text-center transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                    <div className={`text-sm leading-[1.2] ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{y.label}</div>
                    <div className={`text-[10px] font-medium mt-[3px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{y.grade}</div>
                  </button>
                )})}
              </div>
              {year && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2.5">Programme</p>
                  <div className="flex flex-col gap-2">
                    {availableBroadCurr.map(cid => {
                      const meta = BROAD_CURRICULA_META[cid]
                      if (!meta) return null
                      const sel = broadCurriculum === cid
                      return (
                        <button key={cid} onClick={() => setBroadCurriculum(cid)} className={`py-3.5 px-[18px] rounded-xl text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                          {sel && <Chk />}
                          <span className={`text-sm ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{meta.label}</span>
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
            <div className="flex flex-col gap-2.5 max-w-[400px]">
              {Y9_NEXT_OPTIONS.map(opt => { const sel = y9NextYear === opt.id; return (
                <button key={opt.id} onClick={() => setY9NextYear(opt.id)} className={`py-[18px] px-5 rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <span className={`text-[15px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{opt.label}</span>
                </button>
              )})}
            </div>
          )}

          {/* CUSTOM CURRICULUM */}
          {k === 'customCurr' && (
            <div className="max-w-[400px]">
              <input type="text" placeholder="e.g. Australian HSC, French Bac..." value={customCurrText} onChange={e => { setCustomCurrText(e.target.value); setCustomCurrConfirmed(false) }} className={`w-full py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white mb-2 border-[1.5px] ${customCurrText ? 'border-teal shadow-[0_0_0_3px_var(--color-teal-soft)]' : 'border-bone'}`} />
              {filteredOtherCurr.map(c => (
                <button key={c.id} onClick={() => { setCustomCurrText(c.label); setCustomCurrConfirmed(true) }} className={`w-full py-3 px-4 rounded-[10px] border border-bone mb-1.5 text-left text-sm font-medium text-dark flex justify-between items-center ${customCurrConfirmed && customCurrText === c.label ? 'bg-teal-soft' : 'bg-white'}`}>
                  <span>{c.label}</span>
                  <span className="text-[11px] text-gray-mid">{c.region}</span>
                </button>
              ))}
              {customCurrText.trim() && filteredOtherCurr.length === 0 && (
                <button onClick={() => setCustomCurrConfirmed(true)} className={`w-full py-3 px-4 rounded-[10px] border border-bone text-sm font-medium text-dark text-left ${customCurrConfirmed ? 'bg-teal-soft' : 'bg-white'}`}>
                  Use &quot;{customCurrText}&quot;
                </button>
              )}
            </div>
          )}

          {/* SIMPLE SUBJECTS */}
          {k === 'simpleSubjects' && (
            <div className="flex flex-col gap-2 max-w-[400px]">
              {simpleSubjectList.map((s: { id: string; label: string }) => { const sel = simpleSubjects.includes(s.id); return (
                <button key={s.id} onClick={() => toggle(s.id, simpleSubjects, setSimpleSubjects, simpleSubjectMax)} className={`py-4 px-[18px] rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <span className={`text-[15px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{s.label}</span>
                </button>
              )})}
              <p className="text-[11px] text-gray-mid mt-1">pick up to {simpleSubjectMax}</p>
            </div>
          )}

          {/* FREE SUBJECTS */}
          {k === 'freeSubjects' && (
            <div className="max-w-[400px]">
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="type a subject..." value={freeSubjectInput} onChange={e => setFreeSubjectInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && freeSubjectInput.trim() && freeSubjects.length < 5) { setFreeSubjects([...freeSubjects, freeSubjectInput.trim()]); setFreeSubjectInput('') } }} className={`flex-1 py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white border-[1.5px] ${freeSubjectInput ? 'border-teal' : 'border-bone'}`} />
                <button onClick={() => { if (freeSubjectInput.trim() && freeSubjects.length < 5) { setFreeSubjects([...freeSubjects, freeSubjectInput.trim()]); setFreeSubjectInput('') } }} className="py-3.5 px-[18px] rounded-xl bg-teal text-white text-sm font-semibold">add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {freeSubjects.map((s, i) => (
                  <span key={i} className="py-2 px-3.5 rounded-[10px] bg-teal-soft text-[13px] font-semibold text-teal flex items-center gap-1.5">
                    {s}
                    <button onClick={() => setFreeSubjects(freeSubjects.filter((_, j) => j !== i))} className="bg-transparent text-sm text-teal p-0">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* OTHER SUBJECTS (IGCSE board-based, A-Level, IBDP) */}
          {k === 'otherSubjects' && (
            <div>
              {isMid && broadCurriculum === 'igcse_gcse' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2">Cambridge (CAIE)</p>
                    {IGCSE_CORE_COURSES.caie.map(s => {
                      const sel = otherSubjects.some(x => x.id === s.id)
                      return (
                        <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: 'Cambridge' }])} className={`w-full py-3 px-3.5 rounded-[10px] text-left relative mb-1.5 transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border border-bone'}`}>
                          {sel && <Chk />}
                          <div className={`text-[13px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{s.label}</div>
                          <div className={`text-[10px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{s.code}</div>
                        </button>
                      )
                    })}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2">Edexcel</p>
                    {IGCSE_CORE_COURSES.edexcel_ig.map(s => {
                      const sel = otherSubjects.some(x => x.id === s.id)
                      return (
                        <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: 'Edexcel' }])} className={`w-full py-3 px-3.5 rounded-[10px] text-left relative mb-1.5 transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border border-bone'}`}>
                          {sel && <Chk />}
                          <div className={`text-[13px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{s.label}</div>
                          <div className={`text-[10px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{s.code}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isUpr && broadCurriculum === 'ibdp' && (
                <div className="flex flex-col gap-2 max-w-[400px]">
                  {CORE_SUBJECTS_IBDP.map(s => {
                    const sel = otherSubjects.some(x => x.id === s.id)
                    const existingSub = otherSubjects.find(x => x.id === s.id)
                    return (
                      <div key={s.id}>
                        <button onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label }])} className={`w-full py-4 px-[18px] rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                          {sel && <Chk />}
                          <span className={`text-[15px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{s.label}</span>
                          {existingSub?.level && <span className={`ml-2 text-[11px] font-semibold ${sel ? 'text-white/80' : 'text-gray-mid'}`}>{existingSub.level}</span>}
                        </button>
                        {sel && !existingSub?.level && (
                          <div className="flex gap-2 mt-1.5 ml-4">
                            {['HL', 'SL'].map(lvl => (
                              <button key={lvl} onClick={() => setOtherSubjects(otherSubjects.map(x => x.id === s.id ? { ...x, level: lvl } : x))} className="py-1.5 px-4 rounded-lg bg-white border-[1.5px] border-bone text-xs font-semibold text-dark">{lvl}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2">Maths course</p>
                    {IB_MATH_COURSES.ibdp.map(mc => {
                      const sel = mathCourse === mc.id
                      return (
                        <button key={mc.id} onClick={() => setMathCourse(sel ? null : mc.id)} className={`w-full py-3 px-4 rounded-[10px] text-left relative mb-1.5 transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border border-bone'}`}>
                          {sel && <Chk />}
                          <div className={`text-[13px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{mc.label}</div>
                          {mc.sub && <div className={`text-[10px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{mc.sub}</div>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isUpr && broadCurriculum === 'alevel' && (
                <div className="flex flex-col gap-2 max-w-[500px]">
                  {CORE_SUBJECTS_ALEVEL.map((s: { id: string; label: string; code?: string; board?: string }) => {
                    const sel = otherSubjects.some(x => x.id === s.id)
                    return (
                      <button key={s.id} onClick={() => sel ? setOtherSubjects(otherSubjects.filter(x => x.id !== s.id)) : setOtherSubjects([...otherSubjects, { id: s.id, label: s.label, code: s.code, board: s.board }])} className={`py-3 px-4 rounded-[10px] text-left relative flex justify-between items-center transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border border-bone'}`}>
                        {sel && <Chk />}
                        <div>
                          <span className={`text-[13px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{s.label}</span>
                          {s.code && <span className={`ml-1.5 text-[10px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>({s.code})</span>}
                        </div>
                        <span className={`text-[10px] font-medium ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{s.board}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* CHALLENGES */}
          {k === 'challenges' && (
            <div className="grid grid-cols-2 gap-2">
              {currentChallenges.map(ch => { const sel = challenges.includes(ch.id); return (
                <button key={ch.id} onClick={() => toggle(ch.id, challenges, setChallenges)} className={`py-4 px-3.5 rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  {ch.emoji && <div className="text-xl mb-1.5">{ch.emoji}</div>}
                  <div className={`text-[13px] mb-1 ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{ch.label}</div>
                  {ch.quote && <div className={`text-[11px] leading-[1.4] italic ${sel ? 'text-white/70' : 'text-gray-mid'}`}>&ldquo;{ch.quote}&rdquo;</div>}
                </button>
              )})}
            </div>
          )}

          {/* WHATS NEXT (Y11) */}
          {k === 'whatsNext' && (
            <div className="flex flex-col gap-2.5 max-w-[400px]">
              {WHATS_NEXT_OPTIONS.map(opt => { const sel = whatsNext === opt.id; return (
                <button key={opt.id} onClick={() => setWhatsNext(opt.id)} className={`py-[18px] px-5 rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <span className={`text-[15px] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{opt.label}</span>
                </button>
              )})}
            </div>
          )}

          {/* PARENT EMAIL */}
          {k === 'parentEmail' && (
            <div className="max-w-[400px]">
              <input type="email" placeholder="parent@example.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} className={`w-full py-3.5 px-[18px] rounded-xl text-base font-medium text-dark bg-white mb-4 border-[1.5px] ${parentEmail ? 'border-teal shadow-[0_0_0_3px_var(--color-teal-soft)]' : 'border-bone'}`} />
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={ageConsent} onChange={e => setAgeConsent(e.target.checked)} className="mt-[3px] accent-teal" />
                <span className="text-[13px] text-gray-rm leading-[1.5]">I confirm I have permission from a parent or guardian to create this account</span>
              </label>
            </div>
          )}

          {/* TEACHER: SUBJECTS + YEAR GROUPS */}
          {k === 'teachSubjects' && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {TEACHER_SUBJECTS.map(s => { const sel = teachSubjects.includes(s.id); return (
                  <button key={s.id} onClick={() => toggle(s.id, teachSubjects, setTeachSubjects)} className={`py-4 px-3 rounded-[14px] text-center relative cursor-pointer transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                    {sel && <Chk />}
                    <div className={`text-[13px] leading-[1.2] ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{s.label}</div>
                  </button>
                )})}
                <button onClick={() => toggle('t_other', teachSubjects, setTeachSubjects)} className={`py-4 px-3 rounded-[14px] text-center relative cursor-pointer transition-all ${teachSubjects.includes('t_other') ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {teachSubjects.includes('t_other') && <Chk />}
                  <div className={`text-[13px] font-semibold ${teachSubjects.includes('t_other') ? 'text-white' : 'text-dark'}`}>Other</div>
                </button>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2.5">Year groups you teach</div>
              <div className="grid grid-cols-4 gap-2">
                {YEARS.map(y => { const sel = yearGroups.includes(y.value); return (
                  <button key={y.value} onClick={() => toggle(y.value, yearGroups, setYearGroups)} className={`pt-3.5 px-1.5 pb-2.5 rounded-xl relative text-center cursor-pointer transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-gray-faint border-[2.5px] border-transparent'}`}>
                    {sel && <Chk />}
                    <div className={`text-sm leading-[1.2] ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{y.label}</div>
                    <div className={`text-[10px] font-medium mt-[3px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{y.grade}</div>
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* TEACHER: CURRICULUM */}
          {k === 'curriculum' && (
            <div className="flex flex-col gap-2 max-w-[400px]">
              {availableCurricula.map((c: { id: string; label: string }) => { const sel = curriculum === c.id; return (
                <button key={c.id} onClick={() => setCurriculum(c.id)} className={`py-4 px-[18px] rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <span className={`text-sm ${sel ? 'font-bold text-white' : 'font-medium text-dark'}`}>{c.label}</span>
                </button>
              )})}
              {curriculum === 'other_curr' && (
                <input type="text" placeholder="e.g. Australian Curriculum, CBSE, IB PYP…" value={customCurrText} onChange={e => setCustomCurrText(e.target.value)} className="w-full py-[13px] px-4 rounded-xl border-[1.5px] border-teal text-sm text-dark bg-white mt-2 shadow-[0_0_0_3px_var(--color-teal-soft)]" />
              )}
            </div>
          )}

          {/* TEACHER: GOALS */}
          {k === 'teacherGoal' && (
            <div className="grid grid-cols-2 gap-2">
              {TEACHER_GOALS.map(g => { const sel = teacherGoals.includes(g.id); return (
                <button key={g.id} onClick={() => toggle(g.id, teacherGoals, setTeacherGoals, 2)} className={`py-4 px-3.5 rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <div className="text-lg mb-1.5">{g.emoji}</div>
                  <div className={`text-[13px] mb-1 ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{g.label}</div>
                  <div className={`text-[11px] leading-[1.4] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{g.desc}</div>
                </button>
              )})}
            </div>
          )}

          {/* PARENT: SUBJECTS + YEAR */}
          {k === 'parentSubjects' && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {TEACHER_SUBJECTS.map(s => { const sel = parentSubjects.includes(s.id); return (
                  <button key={s.id} onClick={() => toggle(s.id, parentSubjects, setParentSubjects)} className={`py-4 px-3 rounded-[14px] text-center relative cursor-pointer transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                    {sel && <Chk />}
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className={`text-xs ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{s.label}</div>
                  </button>
                )})}
                <button onClick={() => toggle('t_other', parentSubjects, setParentSubjects)} className={`py-4 px-3 rounded-[14px] text-center relative cursor-pointer transition-all ${parentSubjects.includes('t_other') ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {parentSubjects.includes('t_other') && <Chk />}
                  <div className={`text-xs font-semibold ${parentSubjects.includes('t_other') ? 'text-white' : 'text-dark'}`}>Other</div>
                </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-gray-mid mb-2.5">What year is {childName || 'your child'} in?</p>
              <div className="grid grid-cols-4 gap-2">
                {YEARS.map(y => { const sel = year === y.value; return (
                  <button key={y.value} onClick={() => setYear(y.value)} className={`pt-3.5 px-1.5 pb-2.5 rounded-[14px] text-center transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                    <div className={`text-sm leading-[1.2] ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{y.label}</div>
                    <div className={`text-[10px] font-medium mt-[3px] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{y.grade}</div>
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* PARENT: GOALS */}
          {k === 'parentGoal' && (
            <div className="grid grid-cols-2 gap-2.5">
              {PARENT_GOALS.map(g => { const sel = goal === g.id; return (
                <button key={g.id} onClick={() => setGoal(g.id)} className={`py-[18px] px-4 rounded-[14px] text-left relative transition-all ${sel ? 'bg-teal border-2 border-teal' : 'bg-white border-[1.5px] border-bone'}`}>
                  {sel && <Chk />}
                  <div className="text-xl mb-2">{g.emoji}</div>
                  <div className={`text-sm mb-1 ${sel ? 'font-bold text-white' : 'font-semibold text-dark'}`}>{g.label}</div>
                  <div className={`text-xs leading-[1.4] ${sel ? 'text-white/70' : 'text-gray-mid'}`}>{g.desc}</div>
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
