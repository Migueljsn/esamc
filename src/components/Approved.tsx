"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const APPROVED = [
  { file: "/aluno-nicolly.webp",       alt: "Nicolly — Jornalismo UESPI" },
  { file: "/aluno-sildheyara.webp",    alt: "Sildheyara — Letras IFPI" },
  { file: "/aluno-jadson.webp",        alt: "Jadson — Direito UFRJ" },
  { file: "/aluno-helena.webp",        alt: "Helena — Turismo UESPI" },
  { file: "/aluno-yana.webp",          alt: "Yana Raika — Ciências Biológicas UESPI" },
  { file: "/aluno-gloria.webp",        alt: "Glória Maria — Letras UESPI" },
  { file: "/aluno-yorrana.webp",       alt: "Yorrana Karine — Jornalismo UFPI" },
  { file: "/aluno-anna-clara.webp",    alt: "Anna Clara — Fisioterapia UESPI" },
  { file: "/aluno-joao-antonio.webp",  alt: "João Antônio — Engenharia UFPI" },
  { file: "/aluno-luysa.webp",         alt: "Luysa — Engenharia Civil UESPI" },
];

// duplicate for seamless loop
const TRACK = [...APPROVED, ...APPROVED];

export function Approved() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const tweenRef    = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // section header reveal
      gsap.from(".approved-label", {
        opacity: 0, x: -30, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(".approved-title-line", {
        y: "110%", duration: 1.0, stagger: 0.15, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // marquee — scroll into view to start, pause on hover
      const track = trackRef.current;
      if (!track) return;
      const totalWidth = track.scrollWidth / 2; // half = one set

      tweenRef.current = gsap.to(track, {
        x: `-=${totalWidth}`,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      // pause/resume on hover
      track.addEventListener("mouseenter", () => tweenRef.current?.pause());
      track.addEventListener("mouseleave", () => tweenRef.current?.resume());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 overflow-hidden">
      {/* Header */}
      <div className="px-6 max-w-6xl mx-auto mb-16">
        <div className="approved-label flex items-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
          <span className="w-8 h-px bg-accent" />
          Resultados reais
        </div>
        <div className="overflow-hidden">
          {["Alunos que chegaram", "lá de verdade."].map((line, i) => (
            <div key={i} className="clip-reveal">
              <h2
                className={`approved-title-line font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight ${
                  i === 1 ? "text-accent-light" : "text-text"
                }`}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050B18, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050B18, transparent)" }} />

        <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
          {TRACK.map((a, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-colors duration-700"
              style={{ width: 260, aspectRatio: "3/4" }}
            >
              <Image
                src={a.file}
                alt={a.alt}
                fill
                className="object-cover object-top"
                sizes="260px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
