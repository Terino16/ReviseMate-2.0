"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Trophy, Brain, Target, ArrowRight } from "lucide-react"
import type { ResultStats } from "@/lib/quiz-types"

interface ResultsModalProps {
  stats: ResultStats
  questionTitle: string
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  color,
}: {
  label: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="rounded-xl border border-bone bg-white p-5">
      <div className={cn("mb-3 flex size-10 items-center justify-center rounded-xl", color)}>
        {icon}
      </div>
      <p className="text-xs text-gray-rm">{label}</p>
      <p className="text-2xl font-bold text-dark">{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-gray-mid">{subtitle}</p>}
    </div>
  )
}

function LOBreakdown({
  title,
  items,
}: {
  title: string
  items: { id: string; total: number; correct: number }[]
}) {
  if (items.length === 0) return null
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-dark">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => {
          const pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
          return (
            <div key={item.id} className="flex items-center gap-3">
              <span className="w-28 truncate text-xs text-gray-rm" title={item.id}>
                {item.id}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bone/60">
                <div
                  className="h-full rounded-full bg-cord transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs font-medium text-dark">
                {item.correct}/{item.total}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ResultsModal({ stats, questionTitle }: ResultsModalProps) {
  const [view, setView] = useState<"summary" | "detail">("summary")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-bone bg-white shadow-2xl">
        <div className="border-b border-bone p-6">
          <h2 className="font-serif text-2xl font-normal text-dark">
            Quiz Complete!
          </h2>
          <p className="mt-1 text-sm text-gray-rm">{questionTitle}</p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setView("summary")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                view === "summary"
                  ? "bg-cord text-white"
                  : "bg-gray-faint text-gray-rm hover:text-dark",
              )}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => setView("detail")}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                view === "detail"
                  ? "bg-cord text-white"
                  : "bg-gray-faint text-gray-rm hover:text-dark",
              )}
            >
              Detailed Breakdown
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {view === "summary" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Understanding Score"
                  value={`${stats.understandingScore}%`}
                  subtitle={`${stats.correctSteps} of ${stats.totalSteps} steps correct`}
                  icon={<Brain className="size-5 text-white" />}
                  color="bg-[#525E7F]"
                />
                <StatCard
                  label="Marks Earned"
                  value={`${stats.marksEarned} / ${stats.totalMarks}`}
                  subtitle="Exam-style marks"
                  icon={<Trophy className="size-5 text-white" />}
                  color="bg-cord"
                />
              </div>

              <LOBreakdown title="Curriculum Learning Objectives" items={stats.curriculumLOs} />
              <LOBreakdown title="ReviseMate Objectives" items={stats.reviseMateLOs} />

              {stats.cognitiveLevels.length > 0 && (
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-dark">Cognitive Levels</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {stats.cognitiveLevels.map((cl) => {
                      const pct =
                        cl.total > 0 ? Math.round((cl.correct / cl.total) * 100) : 0
                      return (
                        <div
                          key={cl.id}
                          className="flex flex-col items-center rounded-xl border border-bone p-3"
                        >
                          <Target className="mb-1 size-4 text-cord" />
                          <span className="text-lg font-bold text-dark">{pct}%</span>
                          <span className="text-[10px] text-gray-mid">{cl.id}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-rm">
                Step-by-step breakdown of your performance
              </p>
              <div className="rounded-xl border border-bone overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-bone bg-gray-faint/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-rm">
                        Step
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-rm">
                        First Attempt
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-rm">
                        Marks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bone/60">
                    {Array.from({ length: stats.totalSteps }).map((_, i) => (
                      <tr key={i} className="hover:bg-gray-faint/30">
                        <td className="px-4 py-2.5 text-dark">Step {i + 1}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={cn(
                              "rounded-md px-2 py-0.5 text-xs font-medium",
                              i < stats.correctSteps
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700",
                            )}
                          >
                            {i < stats.correctSteps ? "Correct" : "Retry needed"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-dark">
                          —
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-bone p-6">
          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cord py-3 text-sm font-medium text-white transition-all hover:shadow-[0_4px_16px_rgba(140,47,57,0.4)]"
          >
            Back to Dashboard
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
