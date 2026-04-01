"use client"

import { useEffect, useRef, useCallback } from "react"
import { useQuizEngine } from "@/lib/use-quiz-engine"
import { QuizHeader } from "@/components/quiz/quiz-header"
import { ProgressDots } from "@/components/quiz/progress-dots"
import { OptionButton } from "@/components/quiz/option-button"
import { FeedbackBox } from "@/components/quiz/feedback-box"
import { SidePanel } from "@/components/quiz/side-panel"
import { MarksCard } from "@/components/quiz/marks-card"
import { CompletedStepCard } from "@/components/quiz/completed-step-card"
import { ResultsModal } from "@/components/quiz/results-modal"
import type { Question, CommonOption, PathOption } from "@/lib/quiz-types"
import questionData from "@/docs/new-mathematics-question.json"

const question = questionData as unknown as Question

export default function QuizPage() {
  const {
    state,
    activeStep,
    currentStepIsCorrect,
    totalProgressSteps,
    completedCount,
    selectOption,
    submit,
    advance,
    retry,
    calculateResults,
  } = useQuizEngine(question)

  const activeStepRef = useRef<HTMLDivElement>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAdvance = useCallback(() => {
    advance()
  }, [advance])

  useEffect(() => {
    if (state.isSubmitted && currentStepIsCorrect) {
      advanceTimerRef.current = setTimeout(handleAdvance, 1200)
      return () => {
        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
      }
    }
  }, [state.isSubmitted, currentStepIsCorrect, handleAdvance])

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [completedCount])

  const getOptionState = (
    optionId: string,
  ): "default" | "selected" | "correct" | "incorrect" | "dimmed" => {
    if (!state.isSubmitted) {
      return state.selectedOptionId === optionId ? "selected" : "default"
    }
    if (!activeStep) return "default"

    const isCorrect = activeStep.data.correctAnswer.includes(optionId)
    const isSelected = state.feedbackOptionId === optionId

    if (isSelected && isCorrect) return "correct"
    if (isSelected && !isCorrect) return "incorrect"
    if (isCorrect && currentStepIsCorrect) return "correct"
    return "dimmed"
  }

  const feedbackText = (() => {
    if (!state.isSubmitted || !state.feedbackOptionId || !activeStep) return null
    const fb = activeStep.data.feedback.find((f) => f.id === state.feedbackOptionId)
    return fb?.text || null
  })()

  const options: (CommonOption | PathOption)[] = activeStep
    ? activeStep.data.options
    : []

  const totalMarks = parseInt(question.totalMarks) || 0

  if (state.isComplete) {
    const stats = calculateResults()
    return (
      <ResultsModal
        stats={stats}
        questionTitle={question.officialQuestion}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F2EDEC]">
      <div className="border-b border-bone bg-white px-6 py-4">
        <QuizHeader tags={question.tags} />
      </div>

      <div className="border-b border-bone bg-white px-6 py-6">
        <p className="mx-auto max-w-4xl text-base leading-relaxed text-dark">
          {question.officialQuestion}
        </p>
      </div>

      <div className="flex justify-center border-b border-bone bg-white px-6 py-4">
        <ProgressDots
          total={totalProgressSteps}
          completed={completedCount}
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 py-6">
        <div className="flex-[2] space-y-4">
          {state.completedSteps.map((step, i) => (
            <CompletedStepCard key={i} step={step} stepNumber={i + 1} />
          ))}

          {activeStep && (
            <div ref={activeStepRef} className="rounded-xl border border-bone bg-white p-6 shadow-sm">
              {activeStep.data.phaseTitle && (
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cord">
                  {activeStep.data.phaseTitle}
                </p>
              )}
              <p className="mb-1 text-xs text-gray-mid">
                Step {completedCount + 1}
              </p>
              <p className="mb-5 text-[0.95rem] font-semibold leading-snug text-dark">
                {activeStep.data.text}
              </p>

              <div className="space-y-2.5">
                {options.map((option) => (
                  <OptionButton
                    key={option.id}
                    id={option.id}
                    text={option.text}
                    state={getOptionState(option.id)}
                    onClick={() => {
                      if (!state.isSubmitted) {
                        selectOption(option.id)
                      }
                    }}
                    disabled={state.isSubmitted}
                  />
                ))}
              </div>

              {state.isSubmitted && feedbackText && currentStepIsCorrect !== null && (
                <FeedbackBox
                  isCorrect={currentStepIsCorrect}
                  text={feedbackText}
                  className="mt-4"
                />
              )}

              {!state.isSubmitted && (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!state.selectedOptionId}
                  className="mt-5 w-full rounded-xl bg-cord py-3 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_4px_16px_rgba(140,47,57,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  Submit
                </button>
              )}

              {state.isSubmitted && currentStepIsCorrect === false && (
                <button
                  type="button"
                  onClick={retry}
                  className="mt-3 w-full rounded-xl border border-cord bg-white py-3 text-sm font-medium text-cord transition-all duration-200 hover:bg-cord/5"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <MarksCard earned={state.marksEarned} total={totalMarks} />
          <SidePanel title="Planning Screen" variant="planning" content={state.planningContent} />
          <SidePanel title="Answer Screen" variant="answer" content={state.answerContent} />
        </div>
      </div>
    </div>
  )
}
