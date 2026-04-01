import Image from "next/image";

interface FeatureCardProps {
  image: string;
  title: string;
  body: string;
  index?: number;
}

export default function FeatureCard({ image, title, body, index = 0 }: FeatureCardProps) {
  return (
    <div
      className="feature-card flex flex-col items-center text-center px-3 sm:px-6 py-6 sm:py-10 max-w-[300px]"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div
        className="feature-float mb-4 sm:mb-6 h-[80px] sm:h-[130px] flex items-end justify-center"
        style={{ animationDelay: `${index * 0.7}s` }}
      >
        <Image
          src={image}
          alt={title}
          width={130}
          height={130}
          className="object-contain max-h-[80px] sm:max-h-[130px] w-auto h-full"
        />
      </div>
      <h3 className="font-serif text-[1.1rem] sm:text-[1.55rem] font-normal text-dark mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-[0.8rem] sm:text-[0.95rem] leading-relaxed text-gray-rm">
        {body}
      </p>
    </div>
  );
}
