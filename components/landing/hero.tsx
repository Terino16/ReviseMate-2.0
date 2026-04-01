import { Button } from "@/components/ui/button"
import Image from "next/image"
import Navbar from "@/components/landing/navbar"

export default function Hero() {
    return (
        <div
            className="relative w-full overflow-clip"
            style={{
                backgroundImage: "url('/BG.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute inset-0 bg-white/40" />
            <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-20 h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 mt-[100px] sm:mt-[80px]">
                    <h1 className="hero-in-1 text-[3rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-serif text-center font-light leading-[120%] sm:leading-[115%] px-2">
                        ReviseMate is a learning <br className="hidden sm:block" /> platform designed for:
                    </h1>

                    <div className="hero-in-2 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                        <Button className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base tracking-tight" variant="gray">
                            Students
                        </Button>
                        <Button className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base tracking-tight" variant="purple">
                            Teachers
                        </Button>
                        <Button className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base tracking-tight" variant="orange">
                            Parents
                        </Button>
                    </div>
                </div>

                {/* Dashboard image flush to bottom, slightly elevated */}
                <div className="hero-in-3 absolute bottom-[-60px] mt-16 sm:mt-16  w-full px-2 flex items-end">
                    <Image
                        src="/Dashboard_Image.png"
                        alt="Hero Image"
                        width={1000}
                        height={1400}
                        className="w-full h-auto object-cover object-top rounded-t-2xl shadow-2xl"
                    />
                </div>
            </div>
        </div>
    )
}