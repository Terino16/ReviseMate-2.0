import Link from "next/link";
import Image from "next/image";

const socials = [
  { name: "Instagram", href: "#" },
  { name: "X", href: "#" },
  { name: "Linkedin", href: "#" },
  { name: "Dribble", href: "#" },
];

const pages = [
  { name: "Home", href: "#" },
  { name: "Works", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="pt-12 sm:pt-20 pb-8">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10 sm:gap-0 mb-12 sm:mb-20">
          <Image src="/Logo.svg" alt="ReviseMate Logo" width={150} height={150} className="h-8 w-auto sm:h-auto sm:w-auto" />

          <div className="flex gap-12 sm:gap-24">
            <div>
              <span className="text-gray-rm text-sm mb-3 sm:mb-4 block">Social</span>
              <ul className="flex flex-col gap-1.5 sm:gap-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    <Link href={s.href} className="font-serif text-[1.1rem] sm:text-[1.3rem] text-dark hover:text-gray-rm transition-colors">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-gray-rm text-sm mb-3 sm:mb-4 block">Pages</span>
              <ul className="flex flex-col gap-1.5 sm:gap-2">
                {pages.map((p) => (
                  <li key={p.name}>
                    <Link href={p.href} className="font-serif text-[1.1rem] sm:text-[1.3rem] text-dark hover:text-gray-rm transition-colors">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-bone pt-6">
          <p className="text-gray-rm text-xs">
            ©2026 ReviseMate All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
