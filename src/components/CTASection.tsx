"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuiz } from "@/context/QuizContext";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const { openQuiz } = useQuiz();
  const sectionRef = useRef<HTMLElement>(null);

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

      tl.from(".cta-title-line", { y: "110%", duration: 1.0, stagger: 0.15 })
        .from(".cta-sub", { opacity: 0, y: 30, duration: 0.8 }, "-=0.4")
        .from(".cta-btn", { opacity: 0, y: 30, duration: 0.8 }, "-=0.4")
        .from(".cta-address", { opacity: 0, duration: 0.8 }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 overflow-hidden noise text-center"
      style={{
        background: "linear-gradient(180deg, #050B18 0%, #0A1628 40%, #0D2154 100%)",
      }}
    >
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="font-display text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-tight mb-8">
          {["Pronto para ser", "aprovado?"].map((line, i) => (
            <div key={i} className="clip-reveal">
              <span className={`cta-title-line block ${i === 1 ? "text-accent-light" : "text-text"}`}>{line}</span>
            </div>
          ))}
        </div>

        <p className="cta-sub text-muted text-lg max-w-xl mx-auto leading-relaxed mb-12">
          Garanta sua vaga no ESA MasterClass e comece sua jornada rumo à aprovação no ENEM com quem mais entende do assunto em Teresina.
        </p>

        <div className="cta-btn">
          <button
            onClick={openQuiz}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-accent text-white font-display font-bold text-xl rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-light hover:scale-105 hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]"
          >
            Fazer minha inscrição
            <span className="transition-transform duration-700 group-hover:translate-x-2">→</span>
          </button>
        </div>

        <div className="cta-address mt-16 flex flex-col items-center gap-2 text-muted/60 text-sm">
          <span className="font-semibold text-muted">Escola Santa Angélica</span>
          <span>Av. União, 2853 — Memorare · Teresina, PI · CEP 64009-500</span>
          <span className="text-muted/40 text-xs mt-1">CNPJ 07.239.791/0001-56</span>
        </div>
      </div>
    </section>
  );
}
