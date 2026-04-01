import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const inter = localFont({
  src: [
    { path: "../fonts/Inter/Inter-VariableFont_opsz,wght.ttf", style: "normal" },
    { path: "../fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    { path: "../fonts/Instrument_Serif/InstrumentSerif-Regular.ttf", style: "normal" },
    { path: "../fonts/Instrument_Serif/InstrumentSerif-Italic.ttf", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "ReviseMate — Exam Revision Platform for Students, Teachers & Parents",
  description: "ReviseMate is a smart revision platform backed by experienced tutors and data-driven insights. Empowering students, teachers, and parents to achieve exam success together.",
  openGraph: {
    title: "ReviseMate — Exam Revision Platform for Students, Teachers & Parents",
    description: "ReviseMate is a smart revision platform backed by experienced tutors and data-driven insights. Empowering students, teachers, and parents to achieve exam success together.",
    images: [
      {
        url: "/OG_image.png",
        width: 1200,
        height: 630,
        alt: "ReviseMate — a learning platform designed for Students, Teachers, and Parents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviseMate — Exam Revision Platform for Students, Teachers & Parents",
    description: "ReviseMate is a smart revision platform backed by experienced tutors and data-driven insights. Empowering students, teachers, and parents to achieve exam success together.",
    images: ["/OG_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("h-full antialiased", inter.variable, instrumentSerif.variable)}>
        <body className="min-h-full flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
