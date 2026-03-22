import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session.sessionClaims?.metadata?.onboardingComplete === true) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
