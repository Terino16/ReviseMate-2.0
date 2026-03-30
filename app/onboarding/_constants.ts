export const YEARS = [
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13',
] as const

export type Year = (typeof YEARS)[number]

export const CURRICULUM_BY_YEAR: Record<Year, { id: string; label: string }[]> = {
  'Year 7': [
    { id: 'ks3', label: 'British Curriculum (KS3)' },
    { id: 'ibmyp', label: 'IB MYP' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 8': [
    { id: 'ks3', label: 'British Curriculum (KS3)' },
    { id: 'ibmyp', label: 'IB MYP' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 9': [
    { id: 'ks3', label: 'British Curriculum (KS3)' },
    { id: 'ibmyp', label: 'IB MYP' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 10': [
    { id: 'igcse_gcse', label: 'IGCSE / GCSE' },
    { id: 'ibmyp', label: 'IB MYP' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 11': [
    { id: 'igcse_gcse', label: 'IGCSE / GCSE' },
    { id: 'ibmyp', label: 'IB MYP' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 12': [
    { id: 'ibdp', label: 'IBDP' },
    { id: 'alevel', label: 'International A Levels' },
    { id: 'other_curr', label: 'Other' },
  ],
  'Year 13': [
    { id: 'ibdp', label: 'IBDP' },
    { id: 'alevel', label: 'International A Levels' },
    { id: 'other_curr', label: 'Other' },
  ],
}

export const Y9_NEXT_YEAR_OPTIONS = [
  { id: 'igcse_gcse', label: 'IGCSE / GCSE' },
  { id: 'ibmyp', label: 'IB MYP' },
  { id: 'other_curr', label: 'Other' },
  { id: 'not_sure', label: 'Not sure' },
]

export const Y11_WHATS_NEXT_OPTIONS = [
  { id: 'ibdp', label: 'IBDP' },
  { id: 'alevel', label: 'International A Levels' },
  { id: 'other_curr', label: 'Other' },
  { id: 'not_sure', label: 'Not sure yet' },
]

// ── Simple subject pools (KS3, MYP, Other, Y9→IGCSE) ──────────────────

export const SIMPLE_SUBJECT_POOLS: Record<string, { id: string; label: string; emoji: string }[]> = {
  ks3: [
    { id: 'math', label: 'Maths', emoji: '📐' },
    { id: 'english', label: 'English', emoji: '📝' },
    { id: 'science', label: 'Science', emoji: '🔬' },
  ],
  ibmyp: [
    { id: 'math', label: 'Maths', emoji: '📐' },
    { id: 'english_ll', label: 'English L&L', emoji: '📝' },
    { id: 'science', label: 'Science', emoji: '🔬' },
  ],
  other_curr: [
    { id: 'math', label: 'Maths', emoji: '📐' },
    { id: 'english', label: 'English', emoji: '📝' },
    { id: 'science', label: 'Science', emoji: '🔬' },
  ],
}

export const Y9_IGCSE_SUBJECTS = [
  { id: 'math', label: 'Maths', emoji: '📐' },
  { id: 'englang', label: 'English Language', emoji: '📝' },
  { id: 'bio', label: 'Biology', emoji: '🧬' },
  { id: 'chem', label: 'Chemistry', emoji: '⚗️' },
  { id: 'phys', label: 'Physics', emoji: '⚡' },
]

// ── Board-based subjects (IGCSE Y10-11) ────────────────────────────────

export const IGCSE_SUBJECTS = {
  Cambridge: [
    { id: 'math_caie', label: 'Mathematics', code: '0580' },
    { id: 'phys_caie', label: 'Physics', code: '0625' },
    { id: 'chem_caie', label: 'Chemistry', code: '0620' },
    { id: 'bio_caie', label: 'Biology', code: '0610' },
    { id: 'englang_caie', label: 'English Language', code: '0500' },
    { id: 'englit_caie', label: 'English Literature', code: '0475' },
    { id: 'hist_caie', label: 'History', code: '0470' },
    { id: 'geo_caie', label: 'Geography', code: '0460' },
    { id: 'cs_caie', label: 'Computer Science', code: '0478' },
    { id: 'econ_caie', label: 'Economics', code: '0455' },
    { id: 'bus_caie', label: 'Business Studies', code: '0450' },
  ],
  Edexcel: [
    { id: 'math_edx', label: 'Mathematics A', code: '4MA1' },
    { id: 'phys_edx', label: 'Physics', code: '4PH1' },
    { id: 'chem_edx', label: 'Chemistry', code: '4CH1' },
    { id: 'bio_edx', label: 'Biology', code: '4BI1' },
    { id: 'englang_edx', label: 'English Language A', code: '4EA1' },
    { id: 'englit_edx', label: 'English Literature', code: '4ET1' },
    { id: 'hist_edx', label: 'History', code: '4HI1' },
    { id: 'geo_edx', label: 'Geography', code: '4GE1' },
    { id: 'cs_edx', label: 'Computer Science', code: '4CP0' },
    { id: 'econ_edx', label: 'Economics', code: '4EC1' },
    { id: 'bus_edx', label: 'Business', code: '4BS1' },
  ],
}

// ── IBDP subjects (Y12-13) ─────────────────────────────────────────────

export const IBDP_SUBJECTS = [
  { id: 'math_ib', label: 'Mathematics' },
  { id: 'phys_ib', label: 'Physics' },
  { id: 'chem_ib', label: 'Chemistry' },
  { id: 'bio_ib', label: 'Biology' },
  { id: 'english_a_ib', label: 'English A' },
  { id: 'hist_ib', label: 'History' },
  { id: 'geo_ib', label: 'Geography' },
  { id: 'econ_ib', label: 'Economics' },
  { id: 'cs_ib', label: 'Computer Science' },
  { id: 'psych_ib', label: 'Psychology' },
]

// ── A-Level subjects (Y12-13) ──────────────────────────────────────────

export const ALEVEL_SUBJECTS = {
  Cambridge: [
    { id: 'math_caie_al', label: 'Mathematics', code: '9709' },
    { id: 'phys_caie_al', label: 'Physics', code: '9702' },
    { id: 'chem_caie_al', label: 'Chemistry', code: '9701' },
    { id: 'bio_caie_al', label: 'Biology', code: '9700' },
    { id: 'english_caie_al', label: 'English Language', code: '9093' },
    { id: 'hist_caie_al', label: 'History', code: '9489' },
    { id: 'econ_caie_al', label: 'Economics', code: '9708' },
    { id: 'cs_caie_al', label: 'Computer Science', code: '9618' },
    { id: 'psych_caie_al', label: 'Psychology', code: '9990' },
  ],
  Edexcel: [
    { id: 'math_edx_al', label: 'Mathematics', code: '9MA0' },
    { id: 'phys_edx_al', label: 'Physics', code: '9PH0' },
    { id: 'chem_edx_al', label: 'Chemistry', code: '9CH0' },
    { id: 'bio_edx_al', label: 'Biology', code: '9BI0' },
    { id: 'english_edx_al', label: 'English Language', code: '9EN0' },
    { id: 'hist_edx_al', label: 'History', code: '9HI0' },
    { id: 'econ_edx_al', label: 'Economics', code: '9EC0' },
    { id: 'cs_edx_al', label: 'Computer Science', code: '9CP0' },
    { id: 'psych_edx_al', label: 'Psychology', code: '9PS0' },
  ],
}

// ── Challenges ─────────────────────────────────────────────────────────

export const YOUNGER_CHALLENGES = [
  { id: 'forget', label: 'I forget stuff pretty quickly', emoji: '🧠' },
  { id: 'no_method', label: "I don't know how to revise", emoji: '❓' },
  { id: 'behind', label: "I'm falling behind", emoji: '🏃' },
  { id: 'stuck', label: 'I get stuck on homework', emoji: '😤' },
  { id: 'concepts', label: "I don't understand concepts", emoji: '🤯' },
  { id: 'notes', label: 'My notes are everywhere', emoji: '📝' },
]

export const OLDER_CHALLENGES = [
  { id: 'procrastination', label: 'I always leave revision too late then panic', emoji: '⏰' },
  { id: 'gaps', label: "I don't know which specific topics I'm weak at", emoji: '🎯' },
  { id: 'no_method', label: "I don't know HOW to best revise — I just freeball it", emoji: '🎲' },
  { id: 'pastpapers', label: "Past papers overwhelm me — don't know how to approach them", emoji: '📄' },
  { id: 'technique', label: 'I need better exam technique to maximise my marks', emoji: '✍️' },
  { id: 'retention', label: 'I forget everything I study within days', emoji: '💭' },
]

// ── Teacher data ───────────────────────────────────────────────────────

export const TEACHER_SUBJECTS = [
  { id: 't_mathematics', label: 'Mathematics', emoji: '📐' },
  { id: 't_english', label: 'English', emoji: '📝' },
  { id: 't_physics', label: 'Physics', emoji: '⚡' },
  { id: 't_chemistry', label: 'Chemistry', emoji: '⚗️' },
  { id: 't_biology', label: 'Biology', emoji: '🧬' },
  { id: 't_other', label: 'Other', emoji: '📚' },
]

export const TEACHER_CURRICULA = [
  { id: 'ks3', label: 'British Curriculum (KS3)' },
  { id: 'ibmyp', label: 'IB MYP' },
  { id: 'igcse_gcse', label: 'IGCSE' },
  { id: 'ibdp', label: 'IBDP' },
  { id: 'alevel', label: 'International A Levels' },
  { id: 'other_curr', label: 'Other' },
]

export const TEACHER_STRUGGLES = [
  { id: 'marking', label: 'Endless marking', description: "I can't keep up with feedback for every student", emoji: '✏️' },
  { id: 'gaps', label: 'Hidden gaps', description: 'Gaps build up before I even notice', emoji: '🎯' },
  { id: 'prep', label: 'Prep overload', description: "Hours of prep for content that might not fit the spec", emoji: '📚' },
  { id: 'engagement', label: 'Zero engagement', description: "They ignore tasks and don't revise independently", emoji: '📵' },
  { id: 'parents', label: 'Parent pressure', description: "Progress reports take time I don't have", emoji: '👨‍👩‍👧' },
  { id: 'admin', label: 'Scattered admin', description: 'No single place to set, track and manage it all', emoji: '🗂️' },
]

// ── Parent data ────────────────────────────────────────────────────────

export const PARENT_SUBJECTS = [
  { id: 't_mathematics', label: 'Mathematics', emoji: '📐' },
  { id: 't_english', label: 'English', emoji: '📝' },
  { id: 't_physics', label: 'Physics', emoji: '⚡' },
  { id: 't_chemistry', label: 'Chemistry', emoji: '⚗️' },
  { id: 't_biology', label: 'Biology', emoji: '🧬' },
  { id: 't_other', label: 'Other', emoji: '📚' },
]

export const PARENT_GOALS = [
  { id: 'gaps', label: 'Spot the gaps', description: "Know where they're struggling before it's too late", emoji: '🔍' },
  { id: 'progress', label: 'Track their progress', description: 'See if the hard work is actually paying off', emoji: '📈' },
  { id: 'efficient', label: 'Efficient revision', description: 'Not just time spent, but time well spent', emoji: '⏱️' },
  { id: 'help', label: 'Be able to help', description: 'Understand enough to actually make a difference', emoji: '🤝' },
]
