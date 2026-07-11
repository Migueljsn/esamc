"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "40+", label: "Anos de tradição", detail: "Desde 1984 formando alunos" },
  { value: "4", label: "Segmentos", detail: "Infantil, Fund. I, Fund. II e Médio" },
  { value: "100%", label: "Comprometimento", detail: "Com o desenvolvimento de cada aluno" },
  { value: "TER", label: "Teresina, PI", detail: "Av. União, 2853 — Memorare" },
];

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-y border-border bg-secondary/50 py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-item bg-secondary/80 px-8 py-10 flex flex-col gap-1 text-center hover:bg-secondary transition-colors duration-700"
          >
            <span className="font-display text-4xl md:text-5xl font-extrabold text-accent-light leading-none">
              {stat.value}
            </span>
            <span className="font-display text-sm font-semibold text-text uppercase tracking-widest mt-2">
              {stat.label}
            </span>
            <span className="text-xs text-muted mt-1">{stat.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
