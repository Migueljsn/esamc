"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(labelRef.current, { opacity: 0, x: -30, duration: 0.8 })
        .from(".about-title-line", { y: "110%", duration: 1.0, stagger: 0.15 }, "-=0.4")
        .from(".about-para", { opacity: 0, y: 30, duration: 0.8, stagger: 0.2 }, "-=0.6")
        .from(badgeRef.current, { opacity: 0, scale: 0.8, duration: 0.8, ease: "expo.out" }, "-=0.4");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="py-24 md:py-36 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center"
    >
      {/* Left */}
      <div>
        <div ref={labelRef} className="flex items-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
          <span className="w-8 h-px bg-accent" />
          Sobre o programa
        </div>

        <h2 ref={titleRef} className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-tight mb-8 text-text">
          {["O que é o", "ESA", "MasterClass?"].map((line, i) => (
            <div key={i} className="clip-reveal">
              <span className={`about-title-line block ${i === 1 ? "text-accent-light" : ""}`}>{line}</span>
            </div>
          ))}
        </h2>

        <div ref={badgeRef} className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-accent/10 border border-accent/20 mt-2">
          <span className="text-accent-light text-2xl font-display font-bold">R$70</span>
          <span className="text-muted text-sm">/mês · sem taxa de matrícula</span>
        </div>
      </div>

      {/* Right */}
      <div ref={textRef} className="space-y-6">
        {[
          "O ESA MasterClass é a turma premium de preparação para o ENEM do Colégio Santa Angélica — uma das instituições mais tradicionais de Teresina, ativa desde 1984.",
          "Nossa metodologia é construída sobre as questões reais do ENEM. Cada aula, cada exercício, cada simulado foi desenhado para maximizar sua pontuação nas cinco áreas de conhecimento.",
          "Aqui você não estuda para o vestibular em geral — você estuda especificamente para o ENEM, com professores que conhecem profundamente o exame e suas tendências.",
        ].map((text, i) => (
          <p key={i} className="about-para text-muted leading-relaxed text-base md:text-lg border-l-2 border-border pl-4 hover:border-accent transition-colors duration-700">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
