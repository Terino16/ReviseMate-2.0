import Image from "next/image";

const testimonials = [
  {
    name: "Sage Moreno",
    role: "Teacher",
    image: "/testimonial/user1.jpg",
    quote:
      "\"It gives me a much clearer view of how my students are progressing. I can quickly see where they're struggling and support them better.\"",
    nameColor: "bg-[#B22234] text-white",
    roleColor: "border-[#B22234] text-[#B22234]",
  },
  {
    name: "Julien Styles",
    role: "Student",
    image: "/testimonial/user2.jpg",
    quote:
      "\"It actually helps me understand what I'm doing, not just get the answer. I feel way more confident going into exams now.\"",
    nameColor: "bg-[#3B5068] text-white",
    roleColor: "border-[#3B5068] text-[#3B5068]",
  },
  {
    name: "Avery Wells",
    role: "Mother",
    image: "/testimonial/user3.jpg",
    quote:
      "\"I used to worry about how my child was doing, but now I can actually see their progress. It's made a big difference for both of us.\"",
    nameColor: "bg-[#5C1A3A] text-white",
    roleColor: "border-[#5C1A3A] text-[#5C1A3A]",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonial-section py-12 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <h2 className="testimonial-heading font-serif text-[2rem] sm:text-[2.8rem] md:text-[3.5rem] font-normal leading-tight mb-8 sm:mb-14">
          What people are saying
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div key={t.name} className="testimonial-card flex flex-col" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="relative mb-4">
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className={`absolute bottom-3 left-4 ${t.nameColor} text-sm font-medium px-4 py-1.5 rounded-md`}>
                  {t.name}
                </span>
              </div>

              <span className={`self-start border ${t.roleColor} text-xs font-medium px-3 py-1 rounded-full mb-4`}>
                {t.role}
              </span>

              <p className="font-serif italic text-[0.95rem] leading-relaxed text-dark">
                {t.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
