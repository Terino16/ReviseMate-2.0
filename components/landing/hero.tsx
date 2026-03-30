import { Button } from "@/components/ui/button"
import Image from "next/image"
import Navbar from "@/components/Landing/navbar"

export default function Hero() {
    return (
        <div className="max-w-[1100px] mx-auto py-20">
            <Navbar />
            <div className="flex flex-col items-center justify-center space-y-8 mt-[100px]">
                <h1 className="hero-in-1 text-[4.5rem] font-serif text-center font-light leading-[115%]">
                    ReviseMate is a learning <br /> platform designed for:
                </h1>

                <div className="hero-in-2 flex items-center justify-center gap-4">
                    <Button className="px-6 py-3 tracking-tight" variant="gray">
                        Students
                    </Button>
                    <Button className="px-6 py-3 tracking-tight" variant="purple">
                        Teachers
                    </Button>
                    <Button className="px-6 py-3 tracking-tight" variant="orange">
                        Parents
                    </Button>
                </div>

                <div className="hero-in-3 mt-6">
                    <Image src="/Dashboard.png" alt="Hero Image" width={1000} height={1000} className="h-full w-full" />
                </div>
            </div>
        </div>
    )
}