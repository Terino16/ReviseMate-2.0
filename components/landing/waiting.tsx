import Image from "next/image"
import Link from "next/link"

export default function Waiting() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F2EDEC] px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <Image src="/favicon.svg" alt="ReviseMate" width={48} height={48} className="mb-6" />

        <h1 className="font-serif text-[2.5rem] sm:text-[3.5rem] font-normal leading-tight text-dark">
          Something <span className="italic">great</span> is coming
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-bodytext">
          We&apos;re putting the finishing touches on ReviseMate. Sign up to be the first to know when we launch.
        </p>

        <div className="mt-8 flex items-center gap-3 w-full max-w-sm">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-xl border border-bone bg-white px-4 py-3 text-sm text-dark placeholder:text-gray-mid focus:border-cord focus:ring-2 focus:ring-cord-soft outline-none transition"
          />
          <button
            type="button"
            className="shrink-0 rounded-xl bg-cord px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-[0_4px_16px_rgba(140,47,57,0.4)]"
          >
            Notify Me
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-mid">No spam, just one email when we&apos;re live.</p>

        <div className="mt-12 flex items-center gap-6 text-sm text-gray-rm">
          <Link href="/sign-in" className="underline underline-offset-2 transition-colors hover:text-dark">
            Sign in
          </Link>
          <span className="text-bone">|</span>
          <Link href="/sign-up" className="underline underline-offset-2 transition-colors hover:text-dark">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
