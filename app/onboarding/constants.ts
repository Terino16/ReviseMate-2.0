export const C = {
  pageBg: "#F8F8F6", white: "#FFFFFF", cream: "#F4F4F2", bone: "#E4E2DE",
  gray: "#78797A", grayMid: "#A8A8A6", grayLight: "#D4D2CE", grayFaint: "#F2F2F0",
  teal: "#004953", tealLight: "#1A6570", tealSoft: "#E6F0F1", tealTile: "#D0E6E9",
  cord: "#8C2F39", cordLight: "#A84050", cordSoft: "#FAEAEB",
  black: "#202833", dark: "#202833",
  green: "#004953", greenAcc: "#1A6B5A", greenSoft: "#E0EEEC",
  orange: "#8C2F39", orangeLight: "#A84050", orangeSoft: "#FAEAEB",
  purple: "#202833", purpleAcc: "#004953", purpleSoft: "#E6F0F1", purpleTile: "#D0E6E9",
  brown: "#202833", brownAcc: "#004953", brownSoft: "#F2F2F0", brownTile: "#E4E2DE",
  tiles: ["#E6F0F1","#FAEAEB","#F2F2F0","#E4E2DE","#D0E6E9","#F4F4F2","#EEF4F5","#F0EEEA","#E8F0EE","#E4E8EC","#EEF2F0","#F0EEF0","#EAF0EE","#EEF0EA"],
};

export const ROLES = [
  { id: "student", label: "Student", desc: "revising for exams", bg: C.purpleSoft, accent: C.teal },
  { id: "teacher", label: "Teacher / Tutor", desc: "supporting my class", bg: C.greenSoft, accent: C.teal },
  { id: "parent", label: "Parent", desc: "helping my child", bg: C.purpleSoft, accent: C.teal },
];

export const YEARS = [
  { label: "Year 7", grade: "Grade 6", value: "Year 7" },
  { label: "Year 8", grade: "Grade 7", value: "Year 8" },
  { label: "Year 9", grade: "Grade 8", value: "Year 9" },
  { label: "Year 10", grade: "Grade 9", value: "Year 10" },
  { label: "Year 11", grade: "Grade 10", value: "Year 11" },
  { label: "Year 12", grade: "Grade 11", value: "Year 12" },
  { label: "Year 13", grade: "Grade 12", value: "Year 13" },
];

export const BROAD_CURRICULA_BY_YEAR: Record<string, string[]> = {
  "Year 7":  ["ks3","ibmyp","other_curr"],
  "Year 8":  ["ks3","ibmyp","other_curr"],
  "Year 9":  ["ks3","ibmyp","other_curr"],
  "Year 10": ["igcse_gcse","ibmyp","other_curr"],
  "Year 11": ["igcse_gcse","ibmyp","other_curr"],
  "Year 12": ["ibdp","alevel","other_curr"],
  "Year 13": ["ibdp","alevel","other_curr"],
};

export const BROAD_CURRICULA_META: Record<string, { label: string; bg: string }> = {
  ks3:        { label: "British Curriculum (KS3 / Cambridge Lower Secondary)", bg: C.purpleSoft },
  ibmyp:      { label: "IB MYP", bg: C.greenSoft },
  igcse_gcse: { label: "IGCSE", bg: C.brownSoft },
  olevel:     { label: "O Level", bg: "#F0E8EE" },
  alevel:     { label: "International A Levels", bg: C.purpleSoft },
  ibdp:       { label: "IBDP", bg: C.greenSoft },
  btec:       { label: "BTEC", bg: "#EDECE5" },
  other_curr: { label: "Other", bg: C.grayFaint },
};

export const CURRICULA_BY_YEAR: Record<string, { id: string; label: string; bg: string }[]> = {
  "Year 7":  [{ id:"ks3", label:"British Curriculum (KS3 / Cambridge Lower Secondary)", bg:C.purpleSoft },{ id:"ibmyp", label:"IB MYP", bg:C.greenSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 8":  [{ id:"ks3", label:"British Curriculum (KS3 / Cambridge Lower Secondary)", bg:C.purpleSoft },{ id:"ibmyp", label:"IB MYP", bg:C.greenSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 9":  [{ id:"ks3", label:"British Curriculum (KS3 / Cambridge Lower Secondary)", bg:C.purpleSoft },{ id:"ibmyp", label:"IB MYP", bg:C.greenSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 10": [{ id:"igcse_gcse", label:"IGCSE", bg:C.brownSoft },{ id:"ibmyp", label:"IB MYP", bg:C.greenSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 11": [{ id:"igcse_gcse", label:"IGCSE", bg:C.brownSoft },{ id:"ibmyp", label:"IB MYP", bg:C.greenSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 12": [{ id:"ibdp", label:"IBDP", bg:C.greenSoft },{ id:"alevel", label:"International A Levels", bg:C.purpleSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
  "Year 13": [{ id:"ibdp", label:"IBDP", bg:C.greenSoft },{ id:"alevel", label:"International A Levels", bg:C.purpleSoft },{ id:"other_curr", label:"Other", bg:C.grayFaint }],
};

export const SUBJECTS = [
  { id: "bio", label: "Biology", emoji: "🧬", bg: C.tiles[0] },
  { id: "chem", label: "Chemistry", emoji: "⚗️", bg: C.tiles[1] },
  { id: "phys", label: "Physics", emoji: "⚛️", bg: C.tiles[2] },
  { id: "math", label: "Maths", emoji: "📐", bg: C.tiles[3] },
  { id: "cs", label: "Computer Science", emoji: "💻", bg: C.tiles[4] },
  { id: "englit", label: "English Literature", emoji: "📖", bg: C.tiles[5] },
  { id: "englang", label: "English Language", emoji: "✍️", bg: C.tiles[6] },
  { id: "geo", label: "Geography", emoji: "🌍", bg: C.tiles[7] },
  { id: "hist", label: "History", emoji: "📜", bg: C.tiles[8] },
  { id: "biz", label: "Business", emoji: "💼", bg: C.tiles[9] },
  { id: "econ", label: "Economics", emoji: "📊", bg: C.tiles[10] },
  { id: "french", label: "French", emoji: "🇫🇷", bg: C.tiles[11] },
  { id: "german", label: "German", emoji: "🇩🇪", bg: C.tiles[12] },
  { id: "spanish", label: "Spanish", emoji: "🇪🇸", bg: C.tiles[13] },
  { id: "art", label: "Art & Design", emoji: "🎨", bg: C.tiles[0] },
  { id: "music", label: "Music", emoji: "🎵", bg: C.tiles[1] },
  { id: "pe", label: "Physical Education", emoji: "🏃", bg: C.tiles[2] },
  { id: "dt", label: "Design & Technology", emoji: "🔧", bg: C.tiles[3] },
  { id: "re", label: "Religious Education", emoji: "🕊️", bg: C.tiles[4] },
  { id: "psych", label: "Psychology", emoji: "🧠", bg: C.tiles[5] },
  { id: "soc", label: "Sociology", emoji: "👥", bg: C.tiles[6] },
  { id: "fmath", label: "Further Maths", emoji: "➗", bg: C.tiles[7] },
  { id: "acc", label: "Accounting", emoji: "🧮", bg: C.tiles[8] },
  { id: "ict", label: "ICT", emoji: "🖥️", bg: C.tiles[9] },
];

export const SUBJECTS_BY_CURRICULUM: Record<string, string[]> = {
  ks3: ["math","englang","bio","chem","phys","geo","hist","french","art","pe","dt","music","re","ict"],
  ibmyp: ["math","englang","englit","bio","chem","phys","geo","hist","french","spanish","german","art","music","pe","dt"],
  igcse_gcse: ["math","bio","chem","phys","englit","englang","geo","hist","cs","biz","econ","french","german","spanish","art","acc","ict","psych","soc","re","dt"],
  alevel: ["math","fmath","bio","chem","phys","englit","englang","geo","hist","cs","biz","econ","french","german","spanish","art","psych","soc"],
  ibdp: ["math","bio","chem","phys","englit","geo","hist","cs","biz","econ","french","german","spanish","art","psych"],
};

export const SIMPLE_SUBJECTS_KS3 = [
  { id: "math", label: "Maths" },
  { id: "english", label: "English" },
  { id: "science", label: "Science" },
];

export const SIMPLE_SUBJECTS_GCSE = [
  { id: "math", label: "Maths" },
  { id: "englang", label: "English Language (First Language)" },
  { id: "bio", label: "Biology" },
  { id: "chem", label: "Chemistry" },
  { id: "phys", label: "Physics" },
];

export const SIMPLE_SUBJECTS_MYP = [
  { id: "math", label: "Maths" },
  { id: "english", label: "English Language & Literature" },
  { id: "science", label: "Science" },
];

export const IGCSE_CORE_COURSES = {
  caie: [
    { id: "fle_caie", label: "First Language English", code: "0500", cat: "eng" },
    { id: "englit_caie", label: "English Literature", code: "0475", cat: "englit" },
    { id: "math_caie", label: "Mathematics", code: "0580", cat: "math", sub: "Extended" },
    { id: "bio_caie", label: "Biology", code: "0610", cat: "bio" },
    { id: "chem_caie", label: "Chemistry", code: "0620", cat: "chem" },
    { id: "phys_caie", label: "Physics", code: "0625", cat: "phys" },
  ],
  edexcel_ig: [
    { id: "engla_edx", label: "English Language A", code: "4EA1", cat: "eng" },
    { id: "englit_edx", label: "English Literature", code: "4ET1", cat: "englit" },
    { id: "math_edx", label: "Mathematics A", code: "4MA1", cat: "math", sub: "Higher Tier" },
    { id: "bio_edx", label: "Biology", code: "4BI1", cat: "bio" },
    { id: "chem_edx", label: "Chemistry", code: "4CH1", cat: "chem" },
    { id: "phys_edx", label: "Physics", code: "4PH1", cat: "phys" },
  ],
};

export const ALEVEL_CORE_COURSES = {
  caie_al: [
    { id: "math_caie_al", label: "Mathematics", code: "9709", cat: "math", board: "Cambridge" },
    { id: "fmath_caie_al", label: "Further Mathematics", code: "9231", cat: "fmath", board: "Cambridge" },
    { id: "phys_caie_al", label: "Physics", code: "9702", cat: "phys", board: "Cambridge" },
    { id: "chem_caie_al", label: "Chemistry", code: "9701", cat: "chem", board: "Cambridge" },
    { id: "bio_caie_al", label: "Biology", code: "9700", cat: "bio", board: "Cambridge" },
    { id: "econ_caie_al", label: "Economics", code: "9708", cat: "econ", board: "Cambridge" },
    { id: "biz_caie_al", label: "Business", code: "9609", cat: "biz", board: "Cambridge" },
    { id: "psych_caie_al", label: "Psychology", code: "9990", cat: "psych", board: "Cambridge" },
    { id: "acc_caie_al", label: "Accounting", code: "9706", cat: "acc", board: "Cambridge" },
    { id: "hist_caie_al", label: "History", code: "9489", cat: "hist", board: "Cambridge" },
    { id: "englang_caie_al", label: "English Language", code: "9093", cat: "englang", board: "Cambridge" },
    { id: "enggp_caie_al", label: "English General Paper", code: "8021", cat: "enggp", board: "Cambridge" },
  ],
  edexcel_al: [
    { id: "math_edx_al", label: "Mathematics", code: "WMA", cat: "math", board: "Edexcel" },
    { id: "fmath_edx_al", label: "Further Mathematics", code: "WFM", cat: "fmath", board: "Edexcel" },
    { id: "phys_edx_al", label: "Physics", code: "WPH", cat: "phys", board: "Edexcel" },
    { id: "chem_edx_al", label: "Chemistry", code: "WCH", cat: "chem", board: "Edexcel" },
    { id: "bio_edx_al", label: "Biology", code: "WBI", cat: "bio", board: "Edexcel" },
    { id: "econ_edx_al", label: "Economics", code: "WEC", cat: "econ", board: "Edexcel" },
    { id: "biz_edx_al", label: "Business", code: "WBS", cat: "biz", board: "Edexcel" },
    { id: "psych_edx_al", label: "Psychology", code: "WPS", cat: "psych", board: "Edexcel" },
    { id: "acc_edx_al", label: "Accounting", code: "WAC", cat: "acc", board: "Edexcel" },
    { id: "hist_edx_al", label: "History", code: "WHI", cat: "hist", board: "Edexcel" },
    { id: "englang_edx_al", label: "English Language", code: "WEN", cat: "englang", board: "Edexcel" },
    { id: "englit_edx_al", label: "English Literature", code: "WET", cat: "englit", board: "Edexcel" },
  ],
};

export const CORE_SUBJECTS_ALEVEL = [...ALEVEL_CORE_COURSES.caie_al, ...ALEVEL_CORE_COURSES.edexcel_al];

export const CORE_SUBJECTS_IBDP = [
  { id: "math_ib", label: "Mathematics" },
  { id: "phys_ib", label: "Physics" },
  { id: "chem_ib", label: "Chemistry" },
  { id: "bio_ib", label: "Biology" },
  { id: "engall_ib", label: "English A: Language & Lit" },
  { id: "engalit_ib", label: "English A: Literature" },
];

export const IB_MATH_COURSES = {
  ibmyp: [{ id: "myp_math", label: "IB MYP Mathematics", sub: null, grading: "ib_17" }],
  ibdp: [
    { id: "ibdp_aa_sl", label: "Math: Analysis & Approaches", sub: "SL — Standard Level", grading: "ib_17" },
    { id: "ibdp_aa_hl", label: "Math: Analysis & Approaches", sub: "HL — Higher Level", grading: "ib_17" },
    { id: "ibdp_ai_sl", label: "Math: Applications & Interp.", sub: "SL — Standard Level", grading: "ib_17" },
    { id: "ibdp_ai_hl", label: "Math: Applications & Interp.", sub: "HL — Higher Level", grading: "ib_17" },
  ],
};

export const OTHER_CURRICULA = [
  { id: "gcse", label: "GCSE", region: "🇬🇧 UK" },
  { id: "alevels", label: "A Levels", region: "🇬🇧 UK" },
  { id: "ap", label: "AP (Advanced Placement)", region: "🇺🇸 US" },
  { id: "sat", label: "SAT Prep", region: "🇺🇸 US" },
  { id: "hkdse", label: "HKDSE", region: "🇭🇰 Hong Kong" },
  { id: "french_bac", label: "French Baccalauréat", region: "🇫🇷 France" },
  { id: "german_abitur", label: "German Abitur", region: "🇩🇪 Germany" },
  { id: "swiss_matura", label: "Swiss Matura", region: "🇨🇭 Switzerland" },
  { id: "dutch_vwo", label: "Dutch VWO / HAVO", region: "🇳🇱 Netherlands" },
  { id: "spanish_bach", label: "Spanish Bachillerato", region: "🇪🇸 Spain" },
  { id: "italian_esame", label: "Italian Esame di Stato", region: "🇮🇹 Italy" },
  { id: "australian_hsc", label: "Australian HSC / VCE / ATAR", region: "🇦🇺 Australia" },
  { id: "nz_ncea", label: "New Zealand NCEA", region: "🇳🇿 New Zealand" },
  { id: "canadian", label: "Canadian Provincial Curriculum", region: "🇨🇦 Canada" },
  { id: "indian_cbse", label: "Indian CBSE", region: "🇮🇳 India" },
  { id: "indian_icse", label: "Indian ICSE / ISC", region: "🇮🇳 India" },
  { id: "indian_state", label: "Indian State Board", region: "🇮🇳 India" },
  { id: "singapore_ol", label: "Singapore O Level / N Level", region: "🇸🇬 Singapore" },
  { id: "singapore_al", label: "Singapore A Level / H2", region: "🇸🇬 Singapore" },
  { id: "korean_suneung", label: "Korean Suneung (CSAT)", region: "🇰🇷 South Korea" },
  { id: "japanese", label: "Japanese National Curriculum", region: "🇯🇵 Japan" },
  { id: "chinese_gaokao", label: "Chinese Gaokao Prep", region: "🇨🇳 China" },
  { id: "malaysian_spm", label: "Malaysian SPM", region: "🇲🇾 Malaysia" },
  { id: "thai_national", label: "Thai National Curriculum", region: "🇹🇭 Thailand" },
  { id: "turkish_yks", label: "Turkish YKS", region: "🇹🇷 Turkey" },
  { id: "brazilian_enem", label: "Brazilian ENEM", region: "🇧🇷 Brazil" },
  { id: "south_african_nsc", label: "South African NSC / IEB", region: "🇿🇦 South Africa" },
  { id: "btec", label: "BTEC", region: "🇬🇧 UK" },
  { id: "scottish_nat", label: "Scottish Nationals / Highers", region: "🏴 Scotland" },
  { id: "american_hs", label: "US High School Diploma", region: "🇺🇸 US" },
  { id: "olevel", label: "O Levels", region: "🌍 International" },
];

export const TEACHER_GOALS = [
  { id: "marking", label: "Endless marking", desc: "I can't keep up with feedback for every student", bg: C.greenSoft, emoji: "✏️" },
  { id: "gaps", label: "Hidden gaps", desc: "gaps build up before I even notice", bg: C.purpleSoft, emoji: "🎯" },
  { id: "resources", label: "Prep overload", desc: "hours of prep for content that might not fit the spec", bg: C.brownSoft, emoji: "📚" },
  { id: "engagement", label: "Zero engagement", desc: "they ignore tasks and don't revise independently", bg: C.orangeSoft, emoji: "📵" },
  { id: "parents", label: "Parent pressure", desc: "progress reports take time I don't have", bg: C.greenSoft, emoji: "👨‍👩‍👧" },
  { id: "manage", label: "Scattered admin", desc: "no single place to set, track and manage it all", bg: C.purpleSoft, emoji: "🗂️" },
];

export const TEACHER_SUBJECTS = [
  { id: "t_mathematics", label: "Mathematics", emoji: "📐" },
  { id: "t_english", label: "English", emoji: "📖" },
  { id: "t_physics", label: "Physics", emoji: "⚡" },
  { id: "t_chemistry", label: "Chemistry", emoji: "🧪" },
  { id: "t_biology", label: "Biology", emoji: "🧬" },
];

export const PARENT_GOALS = [
  { id: "gaps", label: "Spot the gaps", desc: "know where they're struggling before it's too late", bg: C.purpleSoft, emoji: "🔍" },
  { id: "progress", label: "Track their progress", desc: "see if the hard work is actually paying off", bg: C.brownSoft, emoji: "📈" },
  { id: "revising", label: "Efficient revision", desc: "not just time spent, but time well spent", bg: C.greenSoft, emoji: "⏱️" },
  { id: "help", label: "Be able to help", desc: "understand enough to actually make a difference", bg: C.orangeSoft, emoji: "🤝" },
];

export const CHALLENGES = [
  { id: "procrastination", emoji: "⏰", label: "Procrastination", quote: "I always leave revision too late then panic", bg: C.tiles[0] },
  { id: "gaps", emoji: "🔍", label: "Knowledge Gaps", quote: "I don't know which specific topics I'm weak at", bg: C.tiles[1] },
  { id: "method", emoji: "🤷", label: "No Method", quote: "I don't know HOW to best revise — I just freeball it", bg: C.tiles[2] },
  { id: "pastpapers", emoji: "📝", label: "Past Papers Overwhelm", quote: "Past papers overwhelm me — don't know how to approach them", bg: C.tiles[3] },
  { id: "technique", emoji: "🎯", label: "Exam Technique", quote: "I need better exam technique to maximise my marks", bg: C.tiles[4] },
  { id: "retention", emoji: "🧠", label: "Retention", quote: "I forget everything I study within days", bg: C.tiles[5] },
];

export const CHALLENGES_Y78 = [
  { id: "forget", emoji: "", label: "Forget stuff I've learned", quote: "", bg: C.tiles[0] },
  { id: "method", emoji: "", label: "Don't know how to revise", quote: "", bg: C.tiles[1] },
  { id: "behind", emoji: "", label: "Feel like I'm falling behind", quote: "", bg: C.tiles[2] },
  { id: "stuck", emoji: "", label: "Get stuck on homework", quote: "", bg: C.tiles[3] },
  { id: "explanations", emoji: "", label: "Don't understand the concepts", quote: "", bg: C.tiles[4] },
  { id: "organised", emoji: "", label: "Notes everywhere, zero organisation", quote: "", bg: C.tiles[5] },
];

export const WHATS_NEXT_OPTIONS = [
  { id: "ibdp", label: "IBDP", bg: C.greenSoft },
  { id: "alevel", label: "International A Levels", bg: C.purpleSoft },
  { id: "other_unsure", label: "Other / Not sure yet", bg: C.grayFaint },
];

export const Y9_NEXT_OPTIONS = [
  { id: "igcse_gcse", label: "IGCSE / GCSE", bg: C.brownSoft },
  { id: "ibmyp", label: "IB MYP (continuing)", bg: C.greenSoft },
  { id: "other_unsure", label: "Other / Not sure yet", bg: C.grayFaint },
];

export const SCHOOLS_BY_CITY: Record<string, string[]> = {
  "Abu Dhabi": ["Brighton College Abu Dhabi","Cranleigh Abu Dhabi","The British School Al Khubairat (BSAK)","Abu Dhabi International School","Repton School Abu Dhabi"],
  "Dubai": ["Dubai College","Jumeirah English Speaking School (JESS)","Repton School Dubai","Brighton College Dubai","GEMS Wellington International School","GEMS Dubai American Academy","Kings' School Dubai","Dubai British School","Nord Anglia International School Dubai"],
  "Hong Kong": ["Harrow International School Hong Kong","Kellett School","Chinese International School (CIS)","Canadian International School of Hong Kong (CDNIS)","German Swiss International School","Hong Kong International School (HKIS)"],
  "London": ["Westminster School","St Paul's School","City of London School","Dulwich College","King's College School (KCS) Wimbledon","Latymer Upper School","Highgate School"],
  "Singapore": ["United World College of South East Asia (UWCSEA)","Tanglin Trust School","Singapore American School (SAS)","Canadian International School Singapore","GEMS World Academy Singapore"],
  "Shanghai": ["Shanghai American School (SAS)","Dulwich College Shanghai","Wellington College International Shanghai","Harrow International School Shanghai","British International School of Shanghai"],
  "Kuala Lumpur": ["Alice Smith School","International School of Kuala Lumpur (ISKL)","Garden International School","Marlborough College Malaysia","Epsom College in Malaysia"],
  "Bangkok": ["NIST International School","International School Bangkok (ISB)","Harrow International School Bangkok","Shrewsbury International School Bangkok","Bangkok Patana School"],
  "Mumbai": ["Oberoi International School","Dhirubhai Ambani International School","Ecole Mondiale World School","Jamnabai Narsee International School"],
  "New Delhi": ["The British School New Delhi","American Embassy School","Pathways School Gurgaon","Scottish High International School"],
  "Jakarta": ["Jakarta Intercultural School (JIS)","British School Jakarta (BSJ)","Australian Independent School Jakarta"],
  "Seoul": ["Seoul International School","Korea International School (KIS)","Dulwich College Seoul"],
  "Tokyo": ["The British School in Tokyo","American School in Japan (ASIJ)","St. Mary's International School"],
  "Doha": ["Doha College","Doha British School","Qatar Academy Doha","ACS Doha International School"],
};

export const CITIES = Object.keys(SCHOOLS_BY_CITY).sort();
