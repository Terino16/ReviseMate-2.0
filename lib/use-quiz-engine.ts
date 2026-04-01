"use client"

import { useCallback, useMemo, useReducer } from "react"
import type {
  Question,
  CommonQuestion,
  PathQuestion,
  ActiveStep,
  CompletedStep,
  ResultStats,
  StatItem,
} from "./quiz-types"

type State = {
  flowIndex: number
  currentPathId: string
  currentPathQuestionIndex: number
  selectedOptionId: string | null
  isSubmitted: boolean
  firstAttemptMap: Record<string, boolean>
  completedSteps: CompletedStep[]
  planningContent: string[]
  answerContent: string[]
  marksEarned: number
  isComplete: boolean
  feedbackOptionId: string | null
}

type Action =
  | { type: "SELECT_OPTION"; optionId: string }
  | { type: "SUBMIT" }
  | { type: "ADVANCE"; question: Question }
  | { type: "RETRY" }
  | { type: "RESET" }

function getStepKey(flowIndex: number, pathQuestionIndex?: number): string {
  return pathQuestionIndex !== undefined
    ? `${flowIndex}-${pathQuestionIndex}`
    : `${flowIndex}`
}

function resolveStep(
  question: Question,
  flowIndex: number,
  currentPathId: string,
  currentPathQuestionIndex: number,
): ActiveStep | null {
  if (flowIndex >= question.flow.length) return null

  const flowEntry = question.flow[flowIndex]

  if (flowEntry === "PQ") {
    const path = question.pathQuestions.find((p) => p.id === currentPathId)
    if (!path || currentPathQuestionIndex >= path.questions.length) return null
    return {
      type: "path",
      data: path.questions[currentPathQuestionIndex],
      flowIndex,
      pathQuestionIndex: currentPathQuestionIndex,
    }
  }

  const common = question.commonQuestions.find((q) => q.id === flowEntry)
  if (!common) return null
  return { type: "common", data: common, flowIndex }
}

function isCorrectAnswer(
  step: ActiveStep,
  optionId: string,
): boolean {
  return step.data.correctAnswer.includes(optionId)
}

function getScreenUpdate(step: ActiveStep, selectedOptionId: string): string {
  const q = step.data
  const update =
    (q as PathQuestion).planningscreenUpdate || q.screenUpdate || ""

  if (step.type === "common") {
    const option = (q as CommonQuestion).options.find(
      (o) => o.id === selectedOptionId,
    )
    if (option && option.path) {
      return `${update} ${option.text}`
    }
  }
  return update
}

function calculateMarksForStep(
  step: ActiveStep,
  isFirstAttempt: boolean,
): number {
  if (!isFirstAttempt) return 0
  if (step.data.markDetails && step.data.markDetails.length > 0) {
    return step.data.markDetails.length
  }
  return parseInt(step.data.marks) || 0
}

function createReducer(question: Question) {
  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SELECT_OPTION": {
        if (state.isSubmitted) return state
        return { ...state, selectedOptionId: action.optionId }
      }

      case "SUBMIT": {
        if (!state.selectedOptionId || state.isSubmitted) return state

        const step = resolveStep(
          question,
          state.flowIndex,
          state.currentPathId,
          state.currentPathQuestionIndex,
        )
        if (!step) return state

        const stepKey = getStepKey(step.flowIndex, step.pathQuestionIndex)
        const isFirstAttempt = state.firstAttemptMap[stepKey] !== false
        const correct = isCorrectAnswer(step, state.selectedOptionId)

        if (!correct) {
          return {
            ...state,
            isSubmitted: true,
            feedbackOptionId: state.selectedOptionId,
            firstAttemptMap: { ...state.firstAttemptMap, [stepKey]: false },
          }
        }

        const marks = calculateMarksForStep(step, isFirstAttempt)
        const screenText = getScreenUpdate(step, state.selectedOptionId)
        const screen = step.data.screen

        let newPlanningContent = state.planningContent
        let newAnswerContent = state.answerContent
        if (screenText) {
          if (screen === "planning") {
            newPlanningContent = [...state.planningContent, screenText]
          } else {
            newAnswerContent = [...state.answerContent, screenText]
          }
        }

        let newMarks = state.marksEarned + marks

        if (step.data.override && isFirstAttempt) {
          let retroMarks = 0
          for (const cs of state.completedSteps) {
            if (!cs.wasCorrectFirstAttempt && cs.data.markDetails) {
              retroMarks += cs.data.markDetails.filter((m) =>
                m.type.startsWith("M"),
              ).length
            }
          }
          newMarks += retroMarks
        }

        const completed: CompletedStep = {
          type: step.type,
          data: step.data,
          selectedOptionId: state.selectedOptionId,
          wasCorrectFirstAttempt: isFirstAttempt,
          marksAwarded: marks,
        }

        return {
          ...state,
          isSubmitted: true,
          feedbackOptionId: state.selectedOptionId,
          completedSteps: [...state.completedSteps, completed],
          planningContent: newPlanningContent,
          answerContent: newAnswerContent,
          marksEarned: newMarks,
          firstAttemptMap: isFirstAttempt
            ? state.firstAttemptMap
            : { ...state.firstAttemptMap, [stepKey]: false },
        }
      }

      case "ADVANCE": {
        const step = resolveStep(
          action.question,
          state.flowIndex,
          state.currentPathId,
          state.currentPathQuestionIndex,
        )
        if (!step) return { ...state, isComplete: true }

        let newPathId = state.currentPathId
        let newPathQIndex = state.currentPathQuestionIndex
        let newFlowIndex = state.flowIndex

        if (step.type === "common") {
          const selected = state.selectedOptionId
          if (selected) {
            const option = (step.data as CommonQuestion).options.find(
              (o) => o.id === selected,
            )
            if (option && option.path) {
              newPathId = option.path
            }
          }
          newFlowIndex = state.flowIndex + 1
          newPathQIndex = 0
        } else {
          const path = action.question.pathQuestions.find(
            (p) => p.id === state.currentPathId,
          )
          if (path && state.currentPathQuestionIndex < path.questions.length - 1) {
            newPathQIndex = state.currentPathQuestionIndex + 1
          } else {
            newFlowIndex = state.flowIndex + 1
            newPathQIndex = 0
          }
        }

        if (newFlowIndex >= action.question.flow.length) {
          return {
            ...state,
            flowIndex: newFlowIndex,
            currentPathId: newPathId,
            currentPathQuestionIndex: newPathQIndex,
            selectedOptionId: null,
            isSubmitted: false,
            feedbackOptionId: null,
            isComplete: true,
          }
        }

        return {
          ...state,
          flowIndex: newFlowIndex,
          currentPathId: newPathId,
          currentPathQuestionIndex: newPathQIndex,
          selectedOptionId: null,
          isSubmitted: false,
          feedbackOptionId: null,
        }
      }

      case "RETRY":
        return {
          ...state,
          selectedOptionId: null,
          isSubmitted: false,
          feedbackOptionId: null,
        }

      case "RESET":
        return initialState

      default:
        return state
    }
  }
}

const initialState: State = {
  flowIndex: 0,
  currentPathId: "",
  currentPathQuestionIndex: 0,
  selectedOptionId: null,
  isSubmitted: false,
  firstAttemptMap: {},
  completedSteps: [],
  planningContent: [],
  answerContent: [],
  marksEarned: 0,
  isComplete: false,
  feedbackOptionId: null,
}

export function useQuizEngine(question: Question) {
  const reducer = useMemo(() => createReducer(question), [question])
  const [state, dispatch] = useReducer(reducer, initialState)

  const activeStep = useMemo(
    () =>
      resolveStep(
        question,
        state.flowIndex,
        state.currentPathId,
        state.currentPathQuestionIndex,
      ),
    [question, state.flowIndex, state.currentPathId, state.currentPathQuestionIndex],
  )

  const currentStepIsCorrect = useMemo(() => {
    if (!state.isSubmitted || !state.feedbackOptionId || !activeStep) return null
    return isCorrectAnswer(activeStep, state.feedbackOptionId)
  }, [state.isSubmitted, state.feedbackOptionId, activeStep])

  const totalProgressSteps = useMemo(() => {
    let count = 0
    for (const entry of question.flow) {
      if (entry === "PQ") {
        if (state.currentPathId) {
          const path = question.pathQuestions.find(
            (p) => p.id === state.currentPathId,
          )
          count += path ? path.questions.length : 1
        } else {
          const maxPath = question.pathQuestions.reduce(
            (max, p) => Math.max(max, p.questions.length),
            0,
          )
          count += maxPath || 1
        }
      } else {
        count += 1
      }
    }
    return count
  }, [question, state.currentPathId])

  const completedCount = state.completedSteps.length

  const selectOption = useCallback(
    (optionId: string) => dispatch({ type: "SELECT_OPTION", optionId }),
    [],
  )

  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), [])

  const advance = useCallback(
    () => dispatch({ type: "ADVANCE", question }),
    [question],
  )

  const retry = useCallback(() => {
    dispatch({ type: "RETRY" })
  }, [])

  const calculateResults = useCallback((): ResultStats => {
    const totalSteps = state.completedSteps.length
    const correctSteps = state.completedSteps.filter(
      (s) => s.wasCorrectFirstAttempt,
    ).length
    const understandingScore =
      totalSteps > 0 ? Math.round((correctSteps / totalSteps) * 100) : 0

    const loMap = new Map<string, { total: number; correct: number }>()
    const rmMap = new Map<string, { total: number; correct: number }>()
    const cogMap = new Map<string, { total: number; correct: number }>()

    for (const step of state.completedSteps) {
      for (const lo of step.data.lo) {
        const map = lo.startsWith("RM-") || lo.startsWith("ReviseMate") ? rmMap : loMap
        const entry = map.get(lo) || { total: 0, correct: 0 }
        entry.total++
        if (step.wasCorrectFirstAttempt) entry.correct++
        map.set(lo, entry)
      }
      if (step.data.cognitive_level) {
        for (const cl of step.data.cognitive_level) {
          const entry = cogMap.get(cl) || { total: 0, correct: 0 }
          entry.total++
          if (step.wasCorrectFirstAttempt) entry.correct++
          cogMap.set(cl, entry)
        }
      }
    }

    const toItems = (map: Map<string, { total: number; correct: number }>): StatItem[] =>
      Array.from(map.entries()).map(([id, { total, correct }]) => ({
        id,
        total,
        correct,
      }))

    return {
      understandingScore,
      totalSteps,
      correctSteps,
      marksEarned: state.marksEarned,
      totalMarks: parseInt(question.totalMarks) || 0,
      curriculumLOs: toItems(loMap),
      reviseMateLOs: toItems(rmMap),
      cognitiveLevels: toItems(cogMap),
    }
  }, [state.completedSteps, state.marksEarned, question.totalMarks])

  return {
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
  }
}
