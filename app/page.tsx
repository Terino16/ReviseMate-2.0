'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const C = {
  pageBg: '#F8F8F6', white: '#FFFFFF', cream: '#F4F4F2', bone: '#E4E2DE',
  gray: '#78797A', grayMid: '#A8A8A6', grayFaint: '#F2F2F0',
  teal: '#004953', tealSoft: '#E6F0F1',
  cord: '#8C2F39', cordSoft: '#FAEAEB',
  dark: '#202833', greenSoft: '#E0EEEC',
}

const PILLS = [
  { emoji: '📐', label: 'IGCSE Maths', bg: C.tealSoft },
  { emoji: '🧪', label: 'Chemistry', bg: C.cordSoft },
  { emoji: '⚛️', label: 'Physics', bg: C.greenSoft },
  { emoji: '📖', label: 'English', bg: C.grayFaint },
  { emoji: '🧬', label: 'Biology', bg: C.tealSoft },
]

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div style={{ minHeight: '100vh', background: C.pageBg, fontFamily: "'Sora', sans-serif", color: C.dark, overflow: 'hidden' }}>
      {/* Navbar */}
      <nav className="hero-nav" style={{
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          <span style={{ fontSize: 17, fontWeight: 700, color: C.dark, letterSpacing: '-0.3px' }}>
            Revise<span style={{ color: C.cord }}>Mate</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/sign-in" style={{
            padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600,
            color: C.dark, background: 'transparent', border: `1.5px solid ${C.bone}`,
            textDecoration: 'none', transition: 'all 0.15s',
          }}>
            Log in
          </Link>
          <Link href="/sign-up" style={{
            padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600,
            color: C.white, background: C.cord, border: 'none',
            textDecoration: 'none', boxShadow: `0 4px 16px ${C.cord}25`,
            transition: 'all 0.15s',
          }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '80px 40px 60px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Badge */}
        <div className="hero-in-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', borderRadius: 99,
          background: C.white, border: `1px solid ${C.bone}`,
          fontSize: 13, fontWeight: 500, color: C.gray,
          marginBottom: 28,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: '#34D399' }} />
          Built for IGCSE, A-Level & IB students
        </div>

        {/* Heading */}
        <h1 className="hero-in-2" style={{
          fontSize: 56, fontWeight: 400, letterSpacing: '-1.5px',
          lineHeight: 1.15, color: C.dark, marginBottom: 20,
          maxWidth: 750, margin: '0 auto 20px',
        }}>
          Revision that{' '}
          <span style={{
            fontFamily: "'Source Serif 4', serif",
            fontStyle: 'italic', fontWeight: 700,
            color: C.cord,
          }}>actually</span>{' '}
          works.
        </h1>

        {/* Subheading */}
        <p className="hero-in-3" style={{
          fontSize: 18, fontWeight: 400, color: C.gray,
          lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px',
          letterSpacing: '-0.2px',
        }}>
          Smart practice, real exam questions, and a study plan that adapts to you so you stop wasting time and start seeing results.
        </p>

        {/* CTA buttons */}
        <div className="hero-in-4" style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 56 }}>
          <Link href="/sign-up" style={{
            padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 600,
            letterSpacing: '-0.2px', color: C.white, background: C.cord,
            textDecoration: 'none', boxShadow: `0 6px 24px ${C.cord}30`,
            transition: 'all 0.15s', border: 'none',
          }}>
            Start revising — it&apos;s free →
          </Link>
          <Link href="/sign-in" style={{
            padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 600,
            letterSpacing: '-0.2px', color: C.dark, background: C.white,
            textDecoration: 'none', border: `1.5px solid ${C.bone}`,
            transition: 'all 0.15s',
          }}>
            I have an account
          </Link>
        </div>

        {/* Subject pills */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          {PILLS.map((p) => (
            <span key={p.label} className="pill-in" style={{
              padding: '10px 18px', borderRadius: 12,
              background: p.bg, fontSize: 13, fontWeight: 600,
              color: C.dark, display: 'flex', alignItems: 'center', gap: 8,
              border: `1px solid ${C.bone}`,
            }}>
              <span style={{ fontSize: 16 }}>{p.emoji}</span>
              {p.label}
            </span>
          ))}
        </div>

        {/* Floating preview card */}
        <div className="hero-fade" style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <div className="hero-float" style={{
            background: C.white,
            borderRadius: 20,
            border: `1px solid ${C.bone}`,
            padding: '32px 36px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: C.tealSoft, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>📐</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>IGCSE Mathematics</div>
                <div style={{ fontSize: 12, color: C.gray }}>Edexcel 4MA1 · Higher Tier</div>
              </div>
              <div style={{
                marginLeft: 'auto', padding: '6px 14px', borderRadius: 8,
                background: C.greenSoft, fontSize: 12, fontWeight: 700, color: C.teal,
              }}>Live</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { label: 'Understanding', value: '78%', color: C.teal },
                { label: 'Topics covered', value: '12/42', color: C.cord },
                { label: 'Practice Qs', value: '86', color: C.dark },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '16px 18px', borderRadius: 14,
                  background: C.grayFaint, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: C.gray }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Subtle gradient fade at bottom */}
          <div style={{
            position: 'absolute', bottom: -2, left: 0, right: 0, height: 80,
            background: `linear-gradient(transparent, ${C.pageBg})`,
            borderRadius: '0 0 20px 20px', pointerEvents: 'none',
          }} />
        </div>
      </main>
    </div>
  )
}
