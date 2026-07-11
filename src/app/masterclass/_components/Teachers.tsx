"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEACHERS = [
  { name: "André Isac",     photo: "/prof-andre-matematica.webp",  color: "#3b82f6" },
  { name: "Leandro Sousa",  photo: "/prof-leandro-redacao.webp",   color: "#a855f7" },
  { name: "Ranulfo Jr.",    photo: "/prof-ranulfo-linguagens.webp", color: "#f59e0b" },
  { name: "Marcos Josué",   photo: "/prof-josue-natureza.webp",    color: "#22c55e" },
];

export function Teachers() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".teachers-label", {
        opacity: 0, x: -30, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".teachers-title-line", {
        y: "110%", duration: 1.0, stagger: 0.15, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".teacher-card", {
        opacity: 0, y: 80, duration: 0.9,
        stagger: 0.15, ease: "expo.out",
        scrollTrigger: {
          trigger: ".teachers-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-36 px-6 relative overflow-hidden"
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="teachers-label flex items-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
            <span className="w-8 h-px bg-accent" />
            Nosso time
          </div>

          <div className="overflow-hidden">
            {["Professores que", "entendem o ENEM."].map((line, i) => (
              <div key={i} className="clip-reveal">
                <h2
                  className={`teachers-title-line font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight ${
                    i === 1 ? "text-accent-light" : "text-text"
                  }`}
                >
                  {line}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="teachers-grid grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TEACHERS.map((t) => (
            <div
              key={t.name}
              className="teacher-card group relative rounded-2xl overflow-hidden cursor-default"
              style={{
                border: `1px solid rgba(255,255,255,0.06)`,
                aspectRatio: "3/4",
              }}
            >
              {/* Foto com enquadramento uniforme — object-cover + object-top */}
              <Image
                src={t.photo}
                alt={t.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Glow colorido no hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${t.color}28, transparent 65%)`,
                }}
              />

              {/* Borda colorida no hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1.5px ${t.color}50` }}
              />

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
