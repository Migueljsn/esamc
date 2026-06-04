"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuiz } from "@/context/QuizContext";

gsap.registerPlugin(ScrollTrigger);

const INCLUSIONS = [
  "Acesso a todas as aulas presenciais",
  "Simulados semanais com gabarito comentado",
  "Material didático exclusivo incluso",
  "Professores especializados em cada área do ENEM",
  "Acompanhamento personalizado de desempenho",
  "Redação corrigida com critérios oficiais do ENEM",
];

export function Pricing() {
  const { openQuiz } = useQuiz();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-label", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".pricing-title-line", {
        y: "110%",
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(cardRef.current, {
        opacity: 0,
        y: 80,
        scale: 0.95,
        duration: 1.0,
        ease: "expo.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".inclusion-item", {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="inscricao" className="py-24 md:py-36 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="pricing-label flex items-center justify-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
          <span className="w-8 h-px bg-accent" />
          Investimento
          <span className="w-8 h-px bg-accent" />
        </div>

        <div className="overflow-hidden">
          {["Tudo isso por apenas"].map((line, i) => (
            <div key={i} className="clip-reveal">
              <h2 className={`pricing-title-line font-display text-[clamp(2rem,5vw,4rem)] font-extrabold text-text`}>
                {line}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        ref={cardRef}
        className="relative rounded-3xl border border-accent/30 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1628, #0D2154)" }}
      >
        {/* Glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="grid md:grid-cols-2 gap-0">
          {/* Price side */}
          <div className="flex flex-col items-center justify-center p-12 text-center border-b md:border-b-0 md:border-r border-border">
            <p className="text-muted text-sm uppercase tracking-widest mb-4 font-sans">Mensalidade</p>
            <div className="flex items-start gap-2">
              <span className="font-display text-2xl font-bold text-accent-light mt-3">R$</span>
              <span className="font-display text-[6rem] font-extrabold leading-none text-text">70</span>
            </div>
            <p className="text-muted text-sm mt-2">/mês · sem taxa de matrícula</p>

            <button
              onClick={openQuiz}
              className="mt-10 w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-display font-semibold text-base rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-light hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]"
            >
              Garantir minha vaga →
            </button>

            <p className="text-muted/60 text-xs mt-4">Fale pelo WhatsApp para se matricular</p>
          </div>

          {/* Inclusions side */}
          <div className="p-12">
            <p className="font-display font-semibold text-text mb-8 text-lg">O que está incluso:</p>
            <ul className="space-y-4">
              {INCLUSIONS.map((item, i) => (
                <li key={i} className="inclusion-item flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-muted text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
