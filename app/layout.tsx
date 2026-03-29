import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

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
  title: "ReviseMate",
  description: "Your revision companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable, instrumentSerif.variable)}>
      <body className="min-h-full flex flex-col">

          {children}
        
      </body>
    </html>
  );
}
