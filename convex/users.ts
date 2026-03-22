import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveOnboardingData = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    role: v.string(),
    userName: v.string(),
    lastName: v.string(),
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
    teachType: v.optional(v.string()),
    teachSubjects: v.optional(v.array(v.string())),
    yearGroups: v.optional(v.array(v.string())),
    teacherGoals: v.optional(v.array(v.string())),
    childName: v.optional(v.string()),
    parentSubjects: v.optional(v.array(v.string())),
    parentGoals: v.optional(v.array(v.string())),
    goal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const clerkId = identity?.subject ?? args.clerkId;
    if (!clerkId) {
      throw new Error("No user identifier provided");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    const data = { ...args, clerkId, onboardingComplete: true as const };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("users", data);
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});
