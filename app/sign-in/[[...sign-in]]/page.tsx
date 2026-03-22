import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8F8F6',
      fontFamily: "'Sora', sans-serif",
    }}>
      <SignIn />
    </div>
  )
}
