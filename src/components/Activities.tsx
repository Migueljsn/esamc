"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_PROFILE = "https://www.instagram.com/escolasantaangelicapi/";

interface Activity {
  image: string;
  alt: string;
  category: string;
  title: string;
  date: string;
  postUrl: string;
}

const ACTIVITIES: Activity[] = [
  {
    image: "/atividades/copa-esa.jpg",
    alt: "Alunos participando da Copa ESA",
    category: "Esportes",
    title: "Copa ESA reúne os alunos em domingo de esportividade",
    date: "01 jul 2026",
    postUrl: "https://www.instagram.com/p/DaQ8QW8Fhvz/",
  },
  {
    image: "/atividades/festa-junina.jpg",
    alt: "Alunos na Festa Junina da escola",
    category: "Cultura",
    title: "Festa Junina: cores, comidas típicas e tradição",
    date: "30 jun 2026",
    postUrl: "https://www.instagram.com/p/DaNvZrllvGZ/",
  },
  {
    image: "/atividades/sitio-picapau.jpg",
    alt: "Projeto pedagógico Sítio do Picapau Amarelo",
    category: "Projeto Pedagógico",
    title: "O Sítio do Picapau Amarelo ganha vida na escola",
    date: "20 jun 2026",
    postUrl: "https://www.instagram.com/p/DZz5OpNhIP-/",
  },
  {
    image: "/atividades/aula-aberta-bale.jpg",
    alt: "Aula aberta de balé com as alunas",
    category: "Artes",
    title: "Aula Aberta de Balé emociona as famílias",
    date: "11 jun 2026",
    postUrl: "https://www.instagram.com/p/DZdcZQzhz4l/",
  },
  {
    image: "/atividades/salipi.jpg",
    alt: "Alunos visitando o SALIPI",
    category: "Leitura",
    title: "Alunos vivem experiência cultural no SALIPI",
    date: "10 jun 2026",
    postUrl: "https://www.instagram.com/p/DZbE1siJsnk/",
  },
  {
    image: "/atividades/procissao-mariana.jpg",
    alt: "Comunidade escolar na Procissão Mariana",
    category: "Comunidade",
    title: "Procissão Mariana fortalece nossa comunidade",
    date: "30 mai 2026",
    postUrl: "https://www.instagram.com/p/DY9izzDFhfU/",
  },
];

function ActivityCard({ item }: { item: Activity }) {
  return (
    <a
      href={item.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="activity-card group relative flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-secondary/40 hover:border-accent/30 transition-colors duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 82vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,11,24,0.85) 100%)" }}
        />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <span className="text-accent-light text-xs font-sans uppercase tracking-widest">{item.category}</span>
        <h3 className="font-display text-lg font-bold text-text leading-snug">{item.title}</h3>
        <span className="text-muted text-xs">{item.date}</span>
      </div>
    </a>
  );
}

export function Activities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".activities-label", {
        opacity: 0, x: -30, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });

      gsap.from(".activities-title-line", {
        y: "110%", duration: 1.0, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      });

      gsap.from(".activity-card", {
        opacity: 0, y: 60, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="atividades" className="py-24 md:py-36 px-6 relative overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #2563EB, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 px-0">
          <div className="activities-label flex items-center gap-2 mb-6 text-accent-light text-sm tracking-widest uppercase font-sans">
            <span className="w-8 h-px bg-accent" />
            Vida escolar
          </div>

          <div className="overflow-hidden">
            {["Atividades que", "marcam a infância."].map((line, i) => (
              <div key={i} className="clip-reveal">
                <h2
                  className={`activities-title-line font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-tight ${
                    i === 1 ? "text-accent-light" : "text-text"
                  }`}
                >
                  {line}
                </h2>
              </div>
            ))}
          </div>

          <p className="text-muted max-w-xl mt-6 leading-relaxed">
            Projetos, eventos e o dia a dia dos nossos alunos.
          </p>
        </div>

        {/* Mobile: carrossel manual com o próximo card parcialmente visível · Desktop: grade editorial de 3 colunas */}
        <div
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {ACTIVITIES.map((item) => (
            <div key={item.postUrl} className="snap-start flex-shrink-0 md:flex-shrink w-[82vw] md:w-auto">
              <ActivityCard item={item} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-border text-text/70 font-sans rounded-xl transition-all duration-700 hover:border-accent/50 hover:text-text"
          >
            Ver todas as atividades no Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
