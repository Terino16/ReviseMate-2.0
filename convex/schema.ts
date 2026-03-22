import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    role: v.string(),
    userName: v.string(),
    lastName: v.string(),

    // Student fields
    school: v.optional(v.string()),
    year: v.optional(v.string()),
    broadCurriculum: v.optional(v.string()),
    curriculum: v.optional(v.string()),
    customCurrText: v.optional(v.string()),
    y9NextYear: v.optional(v.string()),
    whatsNext: v.optional(v.string()),
    mathCourse: v.optional(v.string()),
    simpleSubjects: v.optional(v.array(v.string())),
    freeSubjects: v.optional(v.array(v.string())),
    otherSubjects: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      board: v.optional(v.string()),
      code: v.optional(v.string()),
      level: v.optional(v.string()),
      sub: v.optional(v.string()),
    }))),
    challenges: v.optional(v.array(v.string())),
    parentEmail: v.optional(v.string()),

    // Teacher fields
    teachType: v.optional(v.string()),
    teachSubjects: v.optional(v.array(v.string())),
    yearGroups: v.optional(v.array(v.string())),
    teacherGoals: v.optional(v.array(v.string())),

    // Parent fields
    childName: v.optional(v.string()),
    parentSubjects: v.optional(v.array(v.string())),
    parentGoals: v.optional(v.array(v.string())),
    goal: v.optional(v.string()),

    onboardingComplete: v.boolean(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"]),
});
