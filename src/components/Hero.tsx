"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuiz } from "@/context/QuizContext";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { openQuiz } = useQuiz();
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Tag line
      tl.from(tagRef.current, { opacity: 0, y: 20, duration: 0.8 }, 0.2)
        // Headline lines (each wrapped in .clip-reveal)
        .from(".hero-line", { y: "110%", duration: 1.0, stagger: 0.15 }, 0.5)
        // Subtitle
        .from(subRef.current, { opacity: 0, y: 30, duration: 0.8 }, 1.0)
        // CTA
        .from(ctaRef.current, { opacity: 0, y: 30, duration: 0.8 }, 1.2)
        // Scroll indicator
        .from(scrollIndicatorRef.current, { opacity: 0, duration: 0.8 }, 1.6);

      // Fade out scroll indicator on scroll
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=200",
          scrub: true,
        },
      });

      // Parallax on hero content
      gsap.to(headlineRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise"
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/VTESA.webm" type="video/webm" />
        <source src="/VTESA.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay para contraste de texto */}
      <div className="absolute inset-0 bg-primary/70" />

      {/* Gradient top/bottom para fundir com o resto da página */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #050B18 0%, transparent 20%, transparent 80%, #050B18 100%)",
        }}
      />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#60A5FA 1px, transparent 1px), linear-gradient(90deg, #60A5FA 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #2563EB, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
        {/* Tag */}
        <div
          ref={tagRef}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-sm tracking-widest uppercase font-sans"
        >
          <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
          Escola Santa Angélica · Desde 1984
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="mb-6">
          <div className="clip-reveal">
            <h1 className="hero-line font-display text-[clamp(3rem,10vw,8rem)] font-extrabold leading-none tracking-tight text-text">
              MASTERCLASS
            </h1>
          </div>
          <div className="clip-reveal">
            <h1 className="hero-line font-display text-[clamp(3rem,10vw,8rem)] font-extrabold leading-none tracking-tight text-accent-light">
              ENEM
            </h1>
          </div>
        </div>

        {/* Sub */}
        <div ref={subRef} className="mb-10">
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-muted max-w-xl mx-auto leading-relaxed">
            Professores especializados em aprovação. Metodologia focada nas
            questões do ENEM.
            <br className="hidden sm:block" />
            <span className="text-text/70"> Teresina, PI · A partir de </span>
            <span className="text-accent-light font-semibold">R$70/mês</span>
          </p>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={openQuiz}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-display font-semibold text-lg rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-light hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]"
          >
            Quero minha vaga
            <span className="transition-transform duration-700 group-hover:translate-x-1">
              →
            </span>
          </button>
          <a
            href="#sobre"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-text/70 font-sans rounded-xl transition-all duration-700 hover:border-accent/50 hover:text-text"
          >
            Saiba mais
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted tracking-widest uppercase">
          scroll
        </span>
        <div className="animate-bounce-slow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3v14M4 13l6 6 6-6"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
