import Image from "next/image";
import FeatureCard from "./featurecard";

const features = [
  {
    image: "/Card_1.png",
    title: "Guided Practice",
    body: "Step-by-step support that helps you understand, not just answer.",
  },
  {
    image: "/Card_2.png",
    title: "Instant Feedback",
    body: "Know what's right, what's not, and how to improve — instantly.",
  },
  {
    image: "/Card_3.png",
    title: "Track Progress",
    body: "See your improvement over time with clear, simple insights.",
  },
  {
    image: "/Card_4.png",
    title: "Shared Progress",
    body: "Keep parents and teachers informed, without extra effort.",
  },
];

export default function Feature() {
  return (
    <>
    <section className="feature-section py-20">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="feature-heading font-serif text-[3.5rem] font-normal text-center leading-tight mb-14">
          Built to help you learn better,
          <br />
          every step of the way.
        </h2>

        <div className="grid grid-cols-4 gap-2 justify-items-center items-start">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              image={feature.image}
              title={feature.title}
              body={feature.body}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>

    <section className="relative h-[640px] overflow-hidden">
      <Image
        src="/Student_background.jpg"
        alt="Students learning together"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <h2 className="font-serif text-white text-[3.5rem] font-normal text-center leading-tight">
          Built to help you learn better,
          <br />
          every step of the way.
        </h2>
      </div>
    </section>

    <section className="py-24">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-20 px-6">
        {/* Row 1: Text left, Image right */}
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-[2.2rem] font-normal leading-snug text-dark mb-5">
              Learn with clarity, not confusion
            </h2>
            <p className="text-[1rem] leading-relaxed text-gray-rm max-w-[400px]">
              Guided practice helps break down complex problems into simple steps, so students can
              focus on understanding the process — not just getting the answer right.
            </p>
          </div>
          <div className="flex items-center justify-center bg-cream rounded-2xl p-10">
            <Image src="/Card1.png" alt="Guided practice illustration" width={400} height={400} className="object-contain" />
          </div>
        </div>

        {/* Row 2: Image left, Text right */}
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="flex items-center justify-center bg-cream rounded-2xl p-10">
            <Image src="/Card2.png" alt="Feedback illustration" width={400} height={400} className="object-contain" />
          </div>
          <div>
            <h2 className="font-serif text-[2.2rem] font-normal leading-snug text-dark mb-5">
              Feedback that moves you forward
            </h2>
            <p className="text-[1rem] leading-relaxed text-gray-rm max-w-[400px]">
              Instant feedback highlights mistakes and explains why they happen, helping students
              correct themselves and build confidence as they go.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
