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

      
      </div>
    </div>
  )
}
