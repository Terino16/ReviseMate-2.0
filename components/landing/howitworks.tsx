const steps = [
  {
    number: "01",
    title: "Start practicing",
    body: "Choose your subject and level, then begin with guided questions tailored to your pace. Each step is designed to ease you into the process without feeling overwhelming.",
    bg: "bg-[#5C1A3A]",
  },
  {
    number: "02",
    title: "Get instant feedback",
    body: "Receive clear, immediate feedback as you work, helping you understand mistakes and learn the right approach while everything is still fresh.",
    bg: "bg-[#3B5068]",
  },
  {
    number: "03",
    title: "Track your progress",
    body: "Monitor your improvement over time with simple, visual insights that make it easy to see where you're growing and where to focus next.",
    bg: "bg-[#2A2A2A]",
  },
  {
    number: "04",
    title: "Stay connected",
    body: "Parents and teachers can follow progress in real time, making it easier to support students and stay aligned throughout the learning journey.",
    bg: "bg-[#B22234]",
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw-section py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="hiw-heading font-serif text-[3.5rem] font-normal text-center leading-tight mb-14">
          How It Works
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`${step.bg} hiw-card relative rounded-2xl p-10 min-h-[280px] flex flex-col justify-end text-white`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="absolute top-2 left-3 text-white text-xl">+</span>
              <span className="absolute top-2 right-3 text-white text-xl">+</span>
              <span className="absolute bottom-3 left-3 text-white text-xl">+</span>
              <span className="absolute bottom-3 right-3 text-white text-xl">+</span>

              <span className="text-white/50 text-sm mb-3">{step.number}</span>
              <h3 className="font-serif text-[1.7rem] font-normal mb-3">
                {step.title}
              </h3>
              <p className="text-[0.9rem] leading-relaxed text-white/75 max-w-[420px]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
