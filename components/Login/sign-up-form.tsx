"use client"

import { SignUp } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col items-center gap-8", className)} {...props}>
      <div className="hero-in-1 text-center space-y-2">
        <h1 className="font-serif text-[2.5rem] font-normal leading-tight">
          Get started
        </h1>
        <p className="text-gray-rm text-[0.95rem]">
          Create your account to begin revising
        </p>
      </div>

      <div className="hero-in-2">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#670938",
              colorBackground: "#FFFFFF",
              colorForeground: "#202833",
              colorNeutral: "#78797A",
              colorBorder: "#E4E2DE",
              colorInput: "#F9F9F8",
              colorInputForeground: "#202833",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
              fontFamilyButtons: "inherit",
            },
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none",
              card: "w-full shadow-none border border-bone rounded-2xl bg-white p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "border-bone bg-white h-11 hover:bg-gray-faint/50 text-dark font-medium rounded-xl transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
              socialButtonsBlockButtonText: "text-sm font-medium",
              dividerLine: "bg-bone",
              dividerText: "text-gray-mid text-xs uppercase tracking-wider",
              formFieldLabel: "text-sm font-medium text-dark",
              formFieldInput:
                "rounded-xl border-bone bg-gray-faint/30 text-sm focus:border-[#004953] focus:ring-2 focus:ring-[#E6F0F1]",
              formButtonPrimary:
                "bg-[#670938] h-11 hover:bg-[#670938]/90 text-white font-medium rounded-xl shadow-none transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(103,9,56,0.5)]",
              footerAction: "hidden",
              footer: "hidden",
              formFieldAction: "text-xs text-gray-rm hover:text-[#8C2F39]",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>

      <p className="hero-in-3 text-center text-sm text-gray-rm">
        Already have an account?{" "}
        <a href="/sign-in" className="font-medium text-cord hover:text-cord-light transition-colors">
          Sign in
        </a>
      </p>

      <p className="hero-in-4 text-center text-xs text-gray-mid leading-relaxed">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-2 hover:text-dark transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-dark transition-colors">
          Privacy Policy
        </a>
      </p>
    </div>
  )
}
