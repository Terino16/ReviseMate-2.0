import Image from "next/image";

export default function Pricing() {
  return (
    <section className="pricing-section py-12 sm:py-24 bg-cream">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="pricing-heading font-serif text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] font-normal leading-tight italic mb-3">
            Learn your way, at your pace
          </h2>
          <p className="text-gray-rm text-[0.9rem] sm:text-[0.95rem]">
            Start for free, or unlock more support as you go
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-[850px] mx-auto">
          <div className="pricing-card bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[340px] border border-bone">
            <div>
              <h3 className="font-serif text-[1.6rem] sm:text-[2rem] font-normal text-dark mb-3">
                Free
              </h3>
              <p className="text-[0.85rem] sm:text-[0.9rem] leading-relaxed text-gray-rm max-w-[300px]">
                Perfect for getting started with guided practice and building confidence over time.
              </p>
            </div>
            <div>
              <p className="mb-4 sm:mb-5">
                <span className="font-serif text-[2rem] sm:text-[2.5rem] text-dark">$0</span>
                <span className="text-gray-rm text-sm ml-1">/month</span>
              </p>
              <button className="bg-[#B22234] text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-[#9A1D2D] transition-colors">
                Get Started
              </button>
            </div>
          </div>

          <div className="pricing-card bg-[#7A1E34] rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[340px] relative overflow-hidden" style={{ animationDelay: "0.1s" }}>
            <div>
              <h3 className="font-serif text-[1.6rem] sm:text-[2rem] font-normal text-white mb-3">
                ReviseMate Plus <span className="text-white/80">+</span>
              </h3>
              <p className="text-[0.85rem] sm:text-[0.9rem] leading-relaxed text-white/70 max-w-[300px]">
                More insights, deeper practice, and better support for consistent progress.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-4 sm:mb-5">
                  <span className="font-serif text-[2rem] sm:text-[2.5rem] text-white">$10</span>
                  <span className="text-white/60 text-sm ml-1">/month</span>
                </p>
                <button className="bg-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-white/90 transition-colors">
                  Upgrade to Plus
                </button>
              </div>
              <Image
                src="/Card1.png"
                alt="Plus illustration"
                width={120}
                height={120}
                className="hidden sm:block object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
