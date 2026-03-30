'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export async function completeOnboarding(onboardingData: Record<string, unknown>) {
  const { userId } = await auth()
  if (!userId) return { error: 'Not signed in' }

  const client = await clerkClient()

  try {
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        ...onboardingData,
      },
    })
    return { success: true }
  } catch {
    return { error: 'There was an error saving your data.' }
  }
}
