"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Navbar() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    return (
        <div className="absolute top-0 left-0 right-0 z-50">
            <nav
                className={`flex items-center justify-between p-4 px-4 sm:px-8 max-w-[1200px] mx-auto transition-all duration-700 ease-out ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
            >
                <div className="flex items-center gap-2">
                    <Image src="/Logo.svg" alt="ReviseMate Logo" width={150} height={150} className="h-8 w-auto sm:h-full sm:w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="purple" className="">
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button className="hidden  sm:inline-flex">
                        <Link href="/sign-up">Sign up</Link>
                    </Button>
                </div>
            </nav>
        </div>
    )
}
