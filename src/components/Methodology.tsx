"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Educação Infantil",
    description: "Primeiros passos da alfabetização com acolhimento, rotina estruturada e estímulo ao desenvolvimento integral da criança.",
    icon: "🧸",
  },
  {
    number: "02",
    title: "Ensino Fundamental I",
    description: "Consolidação da leitura, escrita e raciocínio lógico, com acompanhamento próximo em cada etapa do 1º ao 5º ano.",
    icon: "📘",
  },
  {
    number: "03",
    title: "Ensino Fundamental II",
    description: "Aprofundamento do conteúdo e preparação para a autonomia dos estudos, do 6º ao 9º ano.",
    icon: "📗",
  },
  {
    number: "04",
    title: "Ensino Médio",
    description: "Formação sólida com foco em aprovação nas melhores universidades, apoiada em mais de 40 anos de tradição.",
    icon: "🎓",
  },
  {
    number: "05",
    title: "Acompanhamento personalizado",
    description: "Identificamos as necessidades de cada aluno e direcionamos o ensino para que ele evolua no seu próprio ritmo.",
    icon: "🎯",
  },
];

export function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".method-label", {
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

      gsap.from(".method-title-line", {
        y: "110%",
        duration: 1.0,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".method-title",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".step-card", {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".steps-grid",
          start: "top 75%",
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
      style={{ background: "linear-gradient(180deg, #050B18 0%, #0A1628 50%, #050B18 100%)" }}
    >
      {/* Background accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="method-label flex items-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
            <span className="w-8 h-px bg-accent" />
            Segmentos
          </div>

          <div className="method-title overflow-hidden">
            {["Da Educação Infantil", "ao Ensino Médio"].map((line, i) => (
              <div key={i} className="clip-reveal">
                <h2 className={`method-title-line font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight ${i === 1 ? "text-accent-light" : "text-text"}`}>
                  {line}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Steps grid */}
        <div className="steps-grid grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`step-card group relative p-8 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary/80 hover:border-accent/30 transition-all duration-700 cursor-default ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{step.icon}</span>
                <span className="font-display text-5xl font-extrabold text-accent/20 group-hover:text-accent/40 transition-colors duration-700 leading-none">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-text mb-3">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.description}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.05), transparent)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
