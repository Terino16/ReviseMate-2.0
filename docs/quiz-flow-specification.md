# Revisemate Quiz Flow — Complete Specification

This document fully specifies the **question data schema** and the **quiz engine flow** used in `app/quiz/[quiz]/page.tsx`. It is self-contained — you can recreate the entire system from this file alone.

---

## Table of Contents

1. [High-Level Overview](#1-high-level-overview)
2. [Question Data Schema](#2-question-data-schema)
3. [The Flow Engine](#3-the-flow-engine)
4. [Branching & Pathways](#4-branching--pathways)
5. [Screen Routing (Planning vs Answer)](#5-screen-routing-planning-vs-answer)
6. [Scoring & Marks System](#6-scoring--marks-system)
7. [Feedback System](#7-feedback-system)
8. [Learning Objectives & Cognitive Levels](#8-learning-objectives--cognitive-levels)
9. [Result Calculation](#9-result-calculation)
10. [Saving Results](#10-saving-results)
11. [UI Layout](#11-ui-layout)
12. [Worked Example: Full Walkthrough](#12-worked-example-full-walkthrough)
13. [JSON Template](#13-json-template)

---

## 1. High-Level Overview

A quiz in Revisemate is a **guided, step-by-step walkthrough** of an exam question. Instead of just asking "solve this," it breaks the problem into micro-steps — planning, method selection, calculation, and verification — then guides the student through each one with multiple-choice options and instant feedback.

The key innovation is **branching pathways**: at a decision point (e.g., "Which method do you want to use?"), the student's choice determines which sequence of follow-up questions they see. All branches converge back into shared "common" steps afterward.

```
┌─────────────────────────────────────────────────────┐
│                   QUESTION                          │
│  "Work out the number of goals scored by Kath."     │
└──────────────────────┬──────────────────────────────┘
                       │
              flow: ["C1", "C2", "PQ", "C3", "C4", "C5", "C6"]
                       │
                       ▼
                ┌──────────┐
                │    C1    │  Common: Extract key info
                │(planning)│
                └─────┬────┘
                      ▼
                ┌──────────┐
                │    C2    │  Common: Choose method (BRANCHING POINT)
                │(planning)│  Option A → path "algebra"
                └─────┬────┘  Option B → path "numeric"
                      │
              ┌───────┴───────┐
              ▼               ▼
       ┌─────────────┐ ┌─────────────┐
       │   ALGEBRA   │ │   NUMERIC   │
       │   PATH      │ │   PATH      │
       │ Q1→Q2→Q3→  │ │ Q1→Q2→Q3   │
       │ Q4→Q5→Q6   │ │             │
       └──────┬──────┘ └──────┬──────┘
              └───────┬───────┘
                      ▼
                ┌──────────┐
                │    C3    │  Common: Verification check
                │(planning)│
                └─────┬────┘
                      ▼
                ┌──────────┐
                │    C4    │  Common: Calculate all values
                │(planning)│
                └─────┬────┘
                      ▼
                ┌──────────┐
                │    C5    │  Common: Verify ratio holds
                │(planning)│
                └─────┬────┘
                      ▼
                ┌──────────┐
                │    C6    │  Common: Verify difference
                │(planning)│
                └─────┬────┘
                      ▼
               QUIZ COMPLETE
              → Result Dashboard
```

---

## 2. Question Data Schema

### Root Object

```typescript
type Question = {
  id: string;                    // Unique identifier, e.g. "ED_Igcse_Math_A_Q1"
  officialQuestion: string;      // The full exam question text (displayed at top)
  tags: string[];                // Display tags: ["10 marks", "easy", "25-30 mins", "Date of Exam: May 2022"]
  pathways: string[];            // Available pathway IDs: ["algebra", "numeric"]
  allPath: string;               // "True" if ALL paths must be traversed, "False" if student picks one
  flow: string[];                // Execution order: ["C1", "C2", "PQ", "C3", "C4", "C5", "C6"]
  totalMarks: string;            // Maximum marks available (as string): "3"
  commonQuestions: CommonQuestion[];  // Shared steps (referenced by "C1", "C2", etc. in flow)
  pathQuestions: Path[];             // Branching pathway steps (referenced by "PQ" in flow)
};
```

### CommonQuestion

These are steps shared across all pathways. Referenced in `flow` by their `id` (e.g., `"C1"`, `"C2"`).

```typescript
type CommonQuestion = {
  id: string;                    // Matches a flow entry: "C1", "C2", etc.
  screen: "planning" | "answer"; // Which panel the screenUpdate goes to
  text: string;                  // The question prompt shown to the student
  marks: string;                 // Marks available for this step (as string): "0" or "1"
  lo: string[];                  // Learning objectives: ["LO-F-1.7A", "LO-F-1.7E"]
  cognitive_level?: string[];    // Bloom's levels: ["Remember", "Understand", "Apply", "Analyze", "Evaluate"]
  phaseTitle?: string;           // Optional section heading shown above the step
  override?: boolean;            // If true, correct answer retroactively awards M-marks to all prior steps
  markDetails?: MarkDetail[];    // Detailed mark breakdown (M1, A1, etc.)
  options: CommonOption[];       // Multiple choice options (A, B, C, D)
  correctAnswer: string[];       // Which option IDs are correct: ["A"] or ["A", "B"] for multiple valid answers
  feedback: Feedback[];          // One feedback entry per option
  screenUpdate: string;          // Text appended to the planning/answer panel on correct answer
};

type CommonOption = {
  id: string;       // "A", "B", "C", "D"
  text: string;     // Display text for the option
  path: string;     // If non-empty, selecting this sets the active pathway (e.g. "algebra")
                    // Empty string "" means no pathway change
};

type Feedback = {
  id: string;       // Matches option ID: "A", "B", "C", "D"
  text: string;     // Feedback text shown when this option is selected
};

type MarkDetail = {
  type: string;         // Mark type: "M1", "M2", "A1", "A2" etc.
  description: string;  // What the mark is awarded for
};
```

### PathQuestion

These are steps specific to a chosen pathway. Referenced in `flow` by `"PQ"`.

```typescript
type Path = {
  id: string;                    // Pathway identifier: "algebra" or "numeric"
  questions: PathQuestion[];     // Ordered list of questions for this pathway
};

type PathQuestion = {
  id: string;                    // Question ID within path: "Q1", "Q2", etc.
  screen: "planning" | "answer"; // Which panel the screenUpdate goes to
  text: string;                  // The question prompt
  marks: string;                 // Marks available: "0" or "1"
  lo: string[];                  // Learning objectives
  cognitive_level?: string[];    // Bloom's levels
  phaseTitle?: string;           // Optional section heading
  override?: boolean;            // Override flag
  markDetails?: MarkDetail[];    // Detailed mark breakdown
  options: PathOption[];         // Multiple choice options (no `path` field)
  correctAnswer: string[];       // Correct option IDs
  feedback: Feedback[];          // Feedback per option
  screenUpdate: string;          // Text appended to panel on correct answer
};

type PathOption = {
  id: string;       // "A", "B", "C", "D"
  text: string;     // Display text
  // NOTE: No `path` field — pathway is already determined
};
```

---

## 3. The Flow Engine

The `flow` array is the heart of the system. It's a flat, ordered list that controls which step the student sees next.

### Flow entries

| Entry Format | Meaning |
|---|---|
| `"C1"`, `"C2"`, ... `"Cn"` | Show the common question whose `id` matches this string |
| `"PQ"` | Show the **next** question from the currently active pathway |

### Execution algorithm

```
State:
  flowIndex = 0                    // Current position in flow[]
  currentPathId = ""               // Active pathway ID (set by option.path)
  currentPathQuestionIndex = 0     // Current position within the active path's questions[]

On quiz load:
  1. Read flow[0]
  2. If it starts with "C" → find matching commonQuestion, show it
  3. If it's "PQ" → find first pathway, show its first question

On correct answer submitted:
  1. If current step is type "common":
     a. If selected option has a non-empty `path` → set currentPathId = option.path
     b. Increment flowIndex
     c. Reset currentPathQuestionIndex = 0

  2. If current step is type "path":
     a. Find the pathQuestions entry matching currentPathId
     b. If more questions remain in this path:
        - Increment currentPathQuestionIndex
        - Do NOT increment flowIndex (stay on "PQ")
     c. If no more questions in this path:
        - Increment flowIndex (move past "PQ")
        - Reset currentPathQuestionIndex = 0

  3. Look at flow[flowIndex]:
     - If starts with "C" → load matching common question
     - If "PQ" → load pathQuestions[currentPathId].questions[currentPathQuestionIndex]

  4. If flowIndex >= flow.length → quiz is complete

On incorrect answer:
  - Show feedback inline
  - Do NOT advance — student retries the same step
  - Marks are NOT awarded on retry (only first attempt counts)
```

### Timing

There is a **1200ms delay** between a correct answer and the next step appearing. This gives the student time to read the feedback.

---

## 4. Branching & Pathways

### How branching works

1. A **common question** (typically early in the flow) has options with a `path` field
2. When the student picks an option with `path: "algebra"`, the engine stores `currentPathId = "algebra"`
3. When the flow reaches `"PQ"`, it looks up `pathQuestions.find(p => p.id === "algebra")` and iterates through that path's questions
4. Multiple correct answers are supported — e.g., `correctAnswer: ["A", "B"]` means both "algebra" and "numeric" are valid choices
5. Once all questions in the chosen path are exhausted, the flow advances past `"PQ"` to the next common step

### `allPath` field

- `"False"` (default): Student picks ONE pathway. Only that path's questions are shown.
- `"True"`: ALL pathways must be traversed (not currently implemented in the quiz engine but reserved in the schema).

### Multiple PQ entries

The flow can have multiple `"PQ"` entries if there are multiple branching points:

```json
"flow": ["C1", "PQ", "C2", "PQ", "C3"]
```

Each `"PQ"` block uses the **currently active** `currentPathId` and iterates through its questions.

---

## 5. Screen Routing (Planning vs Answer)

Each question has a `screen` field that determines which side panel accumulates its content:

| `screen` value | Target panel | Purpose |
|---|---|---|
| `"planning"` | **Planning Screen** (purple tint) | Problem understanding, method setup, verification |
| `"answer"` | **Answer Screen** (green tint) | Actual calculations, final answer, working |

### What gets added to the panel

On a correct answer:
1. The `screenUpdate` text is appended to the designated panel
2. If the step is a common question AND the selected option has a non-empty `path`, the update text becomes: `screenUpdate + " " + option.text`
3. If `markDetails` exist, each mark detail is appended as formatted HTML below the screen update

Example flow of panel content:

```
PLANNING SCREEN accumulates:
  Step C1: "The ratio of goals scored by Arjun, Simon, and Kath is 2:5:8..."
  Step C2: "Method Selected: Algebraic Approach: Set up equations..."
  Step Q1(algebra): "For every 2 goals Arjun scores, Simon scores 5..."
  Step Q2(algebra): "Arjun = 2x, Simon = 5x, Kath = 8x."
  ...

ANSWER SCREEN accumulates:
  Step Q5(algebra): "Simplify and solve: 3x = 12, so x = 4."
  Step Q6(algebra): "Kath scored 8x4=32 goals → [M1 earned] → [A1 earned]"
```

---

## 6. Scoring & Marks System

### Mark types

| Prefix | Type | Meaning |
|---|---|---|
| `M` | Method mark | Awarded for correct mathematical method/setup |
| `A` | Accuracy mark | Awarded for correct numerical answer |

Marks are defined in the `markDetails` array on each question step:

```json
"markDetails": [
  { "type": "M1", "description": "Setting up the equation using the ratio" },
  { "type": "A1", "description": "Correct final answer of 32" }
]
```

### Scoring rules

1. **First attempt only**: Marks are ONLY awarded if the student answers correctly on their **first** attempt at a step
2. **Retry allowed**: On wrong answers, the student can retry indefinitely, but earns 0 marks for that step
3. **Each mark detail = 1 point**: Every entry in `markDetails` is worth exactly 1 mark
4. **Toast notifications**: When marks are earned, a success toast appears: "✓ M1 Mark(s) Earned!"

### The `override` flag

If a question has `"override": true` and the student answers it correctly on first attempt:
- The engine retroactively awards **all M-type marks** from **every prior step** (even if those steps were answered incorrectly)
- This models exam marking schemes where a correct final answer implies understanding of the method

### Total score

```
totalScore = sum of all marks across all steps (each markDetail entry = 1 if earned)
maxPossibleScore = question.totalMarks (from root object)
```

---

## 7. Feedback System

### Per-option feedback

Every option (A, B, C, D) has its own feedback entry. The engine shows the matching feedback:

- **Correct answer** → green box: "Correct!" + feedback text
- **Wrong answer** → yellow box: "Let's think about this carefully" + feedback text

### Feedback design principles

For **correct** options: Reinforce WHY the answer is right.

```json
{ "id": "A", "text": "Excellent! We need to use both pieces of information: the ratio 2:5:8 and the fact that Simon scored 12 more goals than Arjun." }
```

For **wrong** options: Guide the student toward the right answer WITHOUT giving it away. Use Socratic questioning.

```json
{ "id": "B", "text": "Read the problem statement carefully. Does it say Simon scored 12 goals in total, or is there a different relationship involving the number 12?" }
```

---

## 8. Learning Objectives & Cognitive Levels

### Learning Objectives (`lo` field)

Each step tags which curriculum objectives it assesses:

| Prefix | Type | Example |
|---|---|---|
| `LO-` | Curriculum learning objective | `"LO-F-1.7A"` (IGCSE syllabus ref) |
| `RM-` | ReviseMate internal objective | `"RM-problem-decomposition"` |

These are tracked for analytics — the results dashboard shows per-LO performance.

### Cognitive Levels (`cognitive_level` field)

Maps to Bloom's Taxonomy:

| Level | What it tests |
|---|---|
| `Remember` | Recall facts, definitions |
| `Understand` | Explain concepts, interpret information |
| `Apply` | Use knowledge in new situations |
| `Analyze` | Break down information, identify patterns |
| `Evaluate` | Judge, justify, verify solutions |

---

## 9. Result Calculation

When the quiz completes, `calculateResults()` runs:

```typescript
ResultStats = {
  understandingScore: number;     // % of steps correct on first attempt
  totalSteps: number;             // Total guidance steps shown
  correctSteps: number;           // Steps correct on first attempt
  marksEarned: number;            // Actual marks scored
  totalMarks: number;             // Maximum possible marks
  curriculumLOs: StatItem[];      // Per-LO breakdown (LO- prefix)
  reviseMateLOs: StatItem[];      // Per-LO breakdown (RM- prefix)
  cognitiveLevels: StatItem[];    // Per-cognitive-level breakdown
};

// Where:
StatItem = { id: string; total: number; correct: number };
```

### Understanding Score vs Marks

These are two separate metrics:

- **Understanding Score**: `(correct first-attempt steps / total steps) × 100` — measures comprehension
- **Marks Earned**: Sum of awarded mark details — measures exam-style performance

---

## 10. Saving Results

On quiz completion, a POST is sent to `/api/save-quiz`:

```typescript
{
  courseId: string;           // From CourseProvider context
  questionId: string;        // question.id
  totalMarks: number;        // question.totalMarks
  marksScored: number;       // Earned marks
  marksByType: Record<string, Record<string, number>>; // Per-step mark breakdown
  learningObjectiveScore: { learningObjectiveId: string; score: number }[];
  stepDetails: StepDetail[];  // Full per-step record
  analytics: ResultStats;     // Complete stats
}
```

Results are appended to the user's `results.solved[]` array in the Supabase `Users` table.

---

## 11. UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ReviseMate                              ← Back to Dashboard│
├─────────────────────────────────────────────────────────────┤
│  [10 marks] [easy] [25-30 mins]    [Formula Sheet] [Calc ✓]│
│                                                             │
│  "Last season, the number of goals scored by Arjun,         │
│   Simon, and Kath..."                                       │
├─────────────────────────────────────────────────────────────┤
│  ●━━━━━●━━━━━●━━━━━○━━━━━○━━━━━○━━━━━○  (progress dots)    │
├──────────────────────────────┬──────────────────────────────┤
│                              │  ┌──────────────────────┐   │
│   GUIDANCE PANEL (2/3 width) │  │ Your Progress        │   │
│                              │  │  2 / 3 marks         │   │
│   ① What key information...  │  └──────────────────────┘   │
│      [A] ✓ (green)           │                              │
│      [B] [C] [D] (dimmed)    │  ┌──────────────────────┐   │
│      ✅ Correct! Excellent...│  │ PLANNING SCREEN      │   │
│                              │  │ (purple tint)        │   │
│   ② Which approach...        │  │                      │   │
│      [A] Algebraic ✓         │  │ Content accumulates  │   │
│      [B] Numerical           │  │ here as steps are    │   │
│      ✅ Good choice!         │  │ answered correctly   │   │
│                              │  └──────────────────────┘   │
│   ③ (active step)            │                              │
│      [A] [B] [C] [D]        │  ┌──────────────────────┐   │
│                              │  │ ANSWER SCREEN        │   │
│      [Submit]                │  │ (green tint)         │   │
│                              │  │                      │   │
│                              │  │ Calculations and     │   │
│                              │  │ final answer build   │   │
│                              │  │ here                 │   │
│                              │  └──────────────────────┘   │
└──────────────────────────────┴──────────────────────────────┘
```

### Result Modal (shown on completion)

Two views toggled by a button:

1. **Summary Dashboard**: Understanding Score card, Marks Earned card, Curriculum LO breakdown, ReviseMate LO breakdown, Cognitive Level breakdown (5-column grid)
2. **Detailed Breakdown**: Step-by-step comparison — "Your Answer" vs "Correct Answer" for every step, plus a mark breakdown table

---

## 12. Worked Example: Full Walkthrough

Using the data from `new-mathematics-question.json`:

**Question**: "Last season, the number of goals scored by Arjun, Simon, and Kath for their football team were in the ratios 2:5:8. Simon scored 12 more goals than Arjun. Work out the number of goals scored by Kath."

### Step-by-step (Algebra pathway)

| Step | Flow | ID | Screen | Prompt | Correct | Marks | Panels Updated |
|---|---|---|---|---|---|---|---|
| 1 | `C1` | C1 | planning | "What key information do we need?" | A | 0 | Planning += "The ratio...and Simon scored 12 more" |
| 2 | `C2` | C2 | planning | "Which approach to use?" | A or B | 1 | Planning += "Method Selected: Algebraic Approach..." |
| 3 | `PQ` | Q1 | planning | "What does the ratio 2:5:8 mean?" | A | 0 | Planning += "For every 2 goals Arjun scores..." |
| 4 | `PQ` | Q2 | planning | "How to represent algebraically?" | A | 0 | Planning += "Arjun = 2x, Simon = 5x, Kath = 8x" |
| 5 | `PQ` | Q3 | planning | "Represent the difference in English?" | A | 0 | Planning += "Simon's goals - Arjun's goals = 12" |
| 6 | `PQ` | Q4 | planning | "Represent the difference algebraically?" | A | 0 | Planning += "5x - 2x = 12" |
| 7 | `PQ` | Q5 | answer | "Simplify and solve 5x - 2x = 12" | A | 0 | Answer += "3x = 12, so x = 4" |
| 8 | `PQ` | Q6 | answer | "Using x=4, calculate Kath's goals" | A | 1 | Answer += "Kath scored 8×4=32 goals [M1][A1]" |
| 9 | `C3` | C3 | planning | "What should we check to verify?" | C | 0 | Planning += "Verification checklist..." |
| 10 | `C4` | C4 | planning | "Determine Arjun's and Simon's goals" | A | 1 | Planning += "Arjun = 8, Simon = 20, Kath = 32" |
| 11 | `C5` | C5 | planning | "Do 8:20:32 maintain ratio 2:5:8?" | A | 0 | Planning += "✓ Ratio verified" |
| 12 | `C6` | C6 | planning | "Does 20-8 = 12?" | A | 0 | Planning += "✓ Difference verified" |

**Total**: 3 marks possible. Quiz complete → Result Dashboard.

### Same question, Numeric pathway

| Step | Flow | ID | Screen | Correct | Marks |
|---|---|---|---|---|---|
| 1 | `C1` | C1 | planning | A | 0 |
| 2 | `C2` | C2 | planning | B (numeric) | 1 |
| 3 | `PQ` | Q1 | planning | A (3 parts difference) | 0 |
| 4 | `PQ` | Q2 | answer | A (4 goals per part) | 0 |
| 5 | `PQ` | Q3 | answer | A (32 goals) | 1 |
| 6 | `C3` | C3 | planning | C | 0 |
| 7 | `C4` | C4 | planning | A | 1 |
| 8 | `C5` | C5 | planning | A | 0 |
| 9 | `C6` | C6 | planning | A | 0 |

Notice the numeric path has **3 questions** vs the algebra path's **6 questions**, but the common steps (C3–C6) are shared.

---

## 13. JSON Template

Use this as a starting point for creating new questions:

```json
{
  "id": "COURSE_ID_QN",
  "officialQuestion": "The full exam question text here.",
  "tags": ["Paper N", "X marks", "difficulty", "Topic Name"],
  "pathways": ["method-a", "method-b"],
  "allPath": "False",
  "flow": ["C1", "C2", "PQ", "C3"],
  "totalMarks": "3",
  "commonQuestions": [
    {
      "id": "C1",
      "screen": "planning",
      "text": "What key information should we extract?",
      "marks": "0",
      "lo": ["LO-X-Y.ZA"],
      "cognitive_level": ["Understand"],
      "options": [
        { "id": "A", "text": "Correct interpretation of the problem", "path": "" },
        { "id": "B", "text": "Common misreading 1", "path": "" },
        { "id": "C", "text": "Common misreading 2", "path": "" },
        { "id": "D", "text": "Common misreading 3", "path": "" }
      ],
      "correctAnswer": ["A"],
      "feedback": [
        { "id": "A", "text": "Correct! Explain why..." },
        { "id": "B", "text": "Socratic hint guiding to A..." },
        { "id": "C", "text": "Socratic hint guiding to A..." },
        { "id": "D", "text": "Socratic hint guiding to A..." }
      ],
      "screenUpdate": "Summary text added to planning panel"
    },
    {
      "id": "C2",
      "screen": "planning",
      "text": "Which method would you like to use?",
      "marks": "0",
      "lo": ["RM-method-selection"],
      "cognitive_level": ["Evaluate"],
      "options": [
        { "id": "A", "text": "Method A description", "path": "method-a" },
        { "id": "B", "text": "Method B description", "path": "method-b" },
        { "id": "C", "text": "Ineffective method 1", "path": "" },
        { "id": "D", "text": "Ineffective method 2", "path": "" }
      ],
      "correctAnswer": ["A", "B"],
      "feedback": [
        { "id": "A", "text": "Good choice! Method A works because..." },
        { "id": "B", "text": "Good choice! Method B works because..." },
        { "id": "C", "text": "Hint: consider a more systematic approach..." },
        { "id": "D", "text": "Hint: this adds unnecessary complexity..." }
      ],
      "screenUpdate": "Method Selected:"
    },
    {
      "id": "C3",
      "screen": "planning",
      "text": "How should we verify our answer?",
      "marks": "0",
      "lo": ["LO-X-Y.ZB"],
      "cognitive_level": ["Evaluate"],
      "options": [
        { "id": "A", "text": "Incomplete check", "path": "" },
        { "id": "B", "text": "Incomplete check", "path": "" },
        { "id": "C", "text": "Complete verification checking all conditions", "path": "" },
        { "id": "D", "text": "Irrelevant check", "path": "" }
      ],
      "correctAnswer": ["C"],
      "feedback": [
        { "id": "A", "text": "That only checks one condition. What else?" },
        { "id": "B", "text": "We need to be more specific..." },
        { "id": "C", "text": "Excellent! Both conditions must be verified." },
        { "id": "D", "text": "That wasn't given in the problem..." }
      ],
      "screenUpdate": "Verification: ✓ condition 1 ✓ condition 2"
    }
  ],
  "pathQuestions": [
    {
      "id": "method-a",
      "questions": [
        {
          "id": "Q1",
          "screen": "planning",
          "text": "First step of Method A?",
          "marks": "0",
          "lo": ["LO-X-Y.ZC"],
          "cognitive_level": ["Apply"],
          "options": [
            { "id": "A", "text": "Correct first step" },
            { "id": "B", "text": "Wrong approach" },
            { "id": "C", "text": "Wrong approach" },
            { "id": "D", "text": "Wrong approach" }
          ],
          "correctAnswer": ["A"],
          "feedback": [
            { "id": "A", "text": "Correct! Because..." },
            { "id": "B", "text": "Hint..." },
            { "id": "C", "text": "Hint..." },
            { "id": "D", "text": "Hint..." }
          ],
          "screenUpdate": "Step 1 result text"
        },
        {
          "id": "Q2",
          "screen": "answer",
          "text": "Calculate the final answer using Method A",
          "marks": "1",
          "lo": ["LO-X-Y.ZD"],
          "cognitive_level": ["Apply"],
          "markDetails": [
            { "type": "M1", "description": "Correct method setup" },
            { "type": "A1", "description": "Correct final answer" }
          ],
          "options": [
            { "id": "A", "text": "Correct calculation" },
            { "id": "B", "text": "Arithmetic error" },
            { "id": "C", "text": "Conceptual error" },
            { "id": "D", "text": "Different error" }
          ],
          "correctAnswer": ["A"],
          "feedback": [
            { "id": "A", "text": "Perfect! [explains calculation]" },
            { "id": "B", "text": "Check your arithmetic..." },
            { "id": "C", "text": "Reconsider the concept..." },
            { "id": "D", "text": "Look at the operation..." }
          ],
          "screenUpdate": "Final answer = X → [M1 earned] → [A1 earned]"
        }
      ]
    },
    {
      "id": "method-b",
      "questions": [
        {
          "id": "Q1",
          "screen": "answer",
          "text": "Solve using Method B",
          "marks": "1",
          "lo": ["LO-X-Y.ZE"],
          "cognitive_level": ["Apply"],
          "markDetails": [
            { "type": "M1", "description": "Correct method" },
            { "type": "A1", "description": "Correct answer" }
          ],
          "options": [
            { "id": "A", "text": "Correct answer" },
            { "id": "B", "text": "Error type 1" },
            { "id": "C", "text": "Error type 2" },
            { "id": "D", "text": "Error type 3" }
          ],
          "correctAnswer": ["A"],
          "feedback": [
            { "id": "A", "text": "Perfect!" },
            { "id": "B", "text": "Hint 1..." },
            { "id": "C", "text": "Hint 2..." },
            { "id": "D", "text": "Hint 3..." }
          ],
          "screenUpdate": "Answer = X → [M1 earned] → [A1 earned]"
        }
      ]
    }
  ]
}
```

### Key rules for authoring

1. **Common question IDs** must match entries in `flow` exactly: `"C1"`, `"C2"`, etc.
2. **Path question IDs** can be anything (typically `"Q1"`, `"Q2"`, etc.) — they are found by position within the path's `questions` array
3. **Every option must have a feedback entry** — `feedback` array must have one entry per option
4. **`correctAnswer` supports multiple values** — `["A", "B"]` means both are accepted
5. **Options with `path`** set the branching — only used in `commonQuestions`, not `pathQuestions`
6. **`screenUpdate`** is required — it controls what appears in the side panels
7. **`marks: "0"`** means the step teaches but doesn't award marks; `marks: "1"` means marks are available
8. **Pathways must be listed in `pathways` array** at the root level
9. **The `flow` array determines the total number of visual progress dots** in the UI progress bar
