"use client"

import { SignUpForm } from "@/components/login/sign-up-form"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F2EDEC]">
      <nav className="hero-nav flex items-center justify-between p-4 px-6 sm:px-8 max-w-[1200px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.svg" alt="ReviseMate Logo" width={150} height={150} />
        </Link>
        <Link
          href="/"
          className="text-sm text-gray-rm hover:text-dark transition-colors"
        >
          Back to home
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[420px]">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
