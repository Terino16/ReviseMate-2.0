export type MarkDetail = {
  type: string
  description: string
}

export type Feedback = {
  id: string
  text: string
}

export type CommonOption = {
  id: string
  text: string
  path: string
}

export type PathOption = {
  id: string
  text: string
}

export type CommonQuestion = {
  id: string
  screen: "planning" | "answer"
  text: string
  marks: string
  lo: string[]
  cognitive_level?: string[]
  phaseTitle?: string
  override?: boolean
  markDetails?: MarkDetail[]
  options: CommonOption[]
  correctAnswer: string[]
  feedback: Feedback[]
  screenUpdate: string
}

export type PathQuestion = {
  id: string
  screen: "planning" | "answer"
  text: string
  marks: string
  lo: string[]
  cognitive_level?: string[]
  phaseTitle?: string
  override?: boolean
  markDetails?: MarkDetail[]
  options: PathOption[]
  correctAnswer: string[]
  feedback: Feedback[]
  screenUpdate: string
  planningscreenUpdate?: string
}

export type Path = {
  id: string
  questions: PathQuestion[]
}

export type Question = {
  id: string
  officialQuestion: string
  tags: string[]
  pathways: string[]
  allPath: string
  flow: string[]
  totalMarks: string
  commonQuestions: CommonQuestion[]
  pathQuestions: Path[]
}

export type StepType = "common" | "path"

export type ActiveStep = {
  type: StepType
  data: CommonQuestion | PathQuestion
  flowIndex: number
  pathQuestionIndex?: number
}

export type CompletedStep = {
  type: StepType
  data: CommonQuestion | PathQuestion
  selectedOptionId: string
  wasCorrectFirstAttempt: boolean
  marksAwarded: number
}

export type ResultStats = {
  understandingScore: number
  totalSteps: number
  correctSteps: number
  marksEarned: number
  totalMarks: number
  curriculumLOs: StatItem[]
  reviseMateLOs: StatItem[]
  cognitiveLevels: StatItem[]
}

export type StatItem = {
  id: string
  total: number
  correct: number
}
