'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (formData: Record<string, unknown>) => {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'No signed-in user' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        ...formData,
      },
    })
    return { message: res.publicMetadata }
  } catch {
    return { error: 'There was an error updating the user metadata.' }
  }
}
