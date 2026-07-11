"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useMasterclassQuiz } from "../_lib/QuizContext";
import { trackLead } from "@/components/FacebookPixel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nome: string;
  whatsapp: string;
  email: string;
  bairro: string;
  dificuldade: string;
  curso: string;
  quando_comecar: string;
}

const INITIAL: FormData = {
  nome: "", whatsapp: "", email: "", bairro: "",
  dificuldade: "", curso: "", quando_comecar: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskPhone(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2)  return `(${n}`;
  if (n.length <= 7)  return `(${n.slice(0,2)}) ${n.slice(2)}`;
  if (n.length <= 11) return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`;
  return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7,11)}`;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v: string) {
  return v.replace(/\D/g, "").length >= 10;
}

function getSessionPayload(data: FormData) {
  const params = new URLSearchParams(window.location.search);
  return {
    ...data,
    produto:      "masterclass",
    utm_source:   params.get("utm_source")   ?? "",
    utm_medium:   params.get("utm_medium")   ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_term:     params.get("utm_term")     ?? "",
    utm_content:  params.get("utm_content")  ?? "",
    utm_id:       params.get("utm_id")       ?? "",
    page_url:         window.location.href,
    referrer:         document.referrer || "direct",
    screen_resolution:`${screen.width}x${screen.height}`,
    viewport:         `${window.innerWidth}x${window.innerHeight}`,
    language:         navigator.language,
    timezone:         Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform:         navigator.platform,
    connection_type:  (navigator as any).connection?.effectiveType ?? "",
    timestamp:        new Date().toISOString(),
    user_agent:       navigator.userAgent,
  };
}

async function sendToSheets(data: FormData) {
  try {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getSessionPayload(data)),
    });
  } catch { /* silent — never block the user flow */ }
}

function buildWhatsAppUrl(data: FormData) {
  const phone = "5586995248350";
  const msg = `Olá! Me chamo ${data.nome} 👋\n\nAcabei de me cadastrar no site do ESA MasterClass e quero saber mais sobre o programa.\n\n🎓 Curso que quero fazer: ${data.curso}\n📚 Minha maior dificuldade no ENEM: ${data.dificuldade}\n📍 Bairro: ${data.bairro}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

// ─── Step data ────────────────────────────────────────────────────────────────

const DIFICULDADES = [
  { label: "Redação", emoji: "✍️" },
  { label: "Matemática", emoji: "📐" },
  { label: "Ciências da Natureza", emoji: "🔬" },
  { label: "Ciências Humanas", emoji: "🌎" },
  { label: "Linguagens", emoji: "📚" },
];

const QUANDO = [
  { label: "Agora mesmo", emoji: "🔥", sub: "Estou pronto para começar!" },
  { label: "Próximo mês", emoji: "📅", sub: "Quase lá..." },
  { label: "Ainda pesquisando", emoji: "🤔", sub: "Só quero entender melhor" },
];

const TOTAL_DATA_STEPS = 7; // steps 1–7

// ─── Main Component ───────────────────────────────────────────────────────────

export function LeadQuiz() {
  const { isOpen, closeQuiz } = useMasterclassQuiz();
  const overlayRef   = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const stepRef      = useRef<HTMLDivElement>(null);
  const dirRef       = useRef<"fwd" | "back">("fwd");
  const busyRef      = useRef(false);

  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState<FormData>(INITIAL);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown]   = useState(3);

  // ── overlay open/close animation ─────────────────────────────────────────

  useEffect(() => {
    if (!overlayRef.current || !cardRef.current) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(cardRef.current,    { scale: 0.94, y: 24 }, { scale: 1, y: 0, duration: 0.8, ease: "expo.out" });
    } else {
      document.body.style.overflow = "";
      gsap.to(cardRef.current,    { scale: 0.94, y: 24, duration: 0.35, ease: "power3.in" });
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.45, ease: "power3.in", delay: 0.1,
        onComplete: () => {
          gsap.set(overlayRef.current!, { display: "none" });
          setStep(0); setForm(INITIAL); setError(""); setSubmitting(false); setCountdown(3);
        },
      });
    }
  }, [isOpen]);

  // ── step transition ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!stepRef.current) return;
    const fromX = dirRef.current === "fwd" ? 48 : -48;
    gsap.fromTo(stepRef.current,
      { x: fromX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", onComplete: () => { busyRef.current = false; } }
    );
  }, [step]);

  // ── ESC to close ─────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeQuiz(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeQuiz]);

  // ── countdown on success step ─────────────────────────────────────────────

  useEffect(() => {
    if (step !== 8) return;
    if (countdown <= 0) { window.open(buildWhatsAppUrl(form), "_blank"); closeQuiz(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown, form, closeQuiz]);

  // ── navigation ────────────────────────────────────────────────────────────

  const animateTo = useCallback((target: number, dir: "fwd" | "back") => {
    if (busyRef.current) return;
    busyRef.current = true;
    dirRef.current = dir;
    setError("");
    const exitX = dir === "fwd" ? -48 : 48;
    gsap.to(stepRef.current, {
      x: exitX, opacity: 0, duration: 0.35, ease: "power3.in",
      onComplete: () => setStep(target),
    });
  }, []);

  const validate = (): boolean => {
    switch (step) {
      case 1: {
        const partes = form.nome.trim().split(/\s+/);
        if (partes.length < 2 || partes[1].length < 2) { setError("Informe nome e sobrenome."); return false; }
        break;
      }
      case 2: if (!isValidPhone(form.whatsapp)) { setError("Insira um WhatsApp válido com DDD."); return false; } break;
      case 3: if (!isValidEmail(form.email)) { setError("Insira um e-mail válido."); return false; } break;
      case 4: if (form.bairro.trim().length < 2) { setError("Por favor, informe seu bairro."); return false; } break;
      case 6: if (form.curso.trim().length < 2) { setError("Informe o curso que deseja fazer."); return false; } break;
    }
    return true;
  };

  const next = async () => {
    if (!validate()) return;
    if (step === 7) {
      setSubmitting(true);
      sendToSheets(form);
      trackLead({ curso: form.curso, dificuldade: form.dificuldade });
      setSubmitting(false);
      animateTo(8, "fwd");
      return;
    }
    animateTo(step + 1, "fwd");
  };

  const back = () => { if (step > 0) animateTo(step - 1, "back"); };

  const pick = (field: keyof FormData, value: string, autoNext = true) => {
    // Compute updated form locally — setForm é async, então form ainda tem valor antigo
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (!autoNext) return;
    if (step === 7) {
      sendToSheets(updated);
      trackLead({ curso: updated.curso, dificuldade: updated.dificuldade });
      setTimeout(() => animateTo(8, "fwd"), 400);
    } else {
      setTimeout(() => animateTo(step + 1, "fwd"), 400);
    }
  };

  const progress = step >= 1 && step <= TOTAL_DATA_STEPS ? (step / TOTAL_DATA_STEPS) * 100 : step === 8 ? 100 : 0;

  // ── render step content ───────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      // ── 0: welcome ──────────────────────────────────────────────────────
      case 0:
        return (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎓</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-text mb-3">
              Vamos encontrar o plano ideal para você
            </h2>
            <p className="text-muted max-w-sm mx-auto mb-10 leading-relaxed">
              Rápido e fácil — algumas perguntas para nossa equipe te atender de forma personalizada.
            </p>
            <button onClick={() => animateTo(1, "fwd")} className={BTN}>
              Começar agora <span>→</span>
            </button>
          </div>
        );

      // ── 1: nome ─────────────────────────────────────────────────────────
      case 1:
        return (
          <StepLayout
            question="Como você se chama?"
            hint="Informe nome e sobrenome — assim nossa equipe te identifica corretamente"
            error={error}
          >
            <input
              autoFocus
              type="text"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="Nome e sobrenome"
              className={INPUT}
            />
          </StepLayout>
        );

      // ── 2: whatsapp ──────────────────────────────────────────────────────
      case 2:
        return (
          <StepLayout
            question="Qual é o seu WhatsApp?"
            hint="Nossa equipe vai entrar em contato por aqui"
            error={error}
          >
            <input
              autoFocus
              type="tel"
              inputMode="numeric"
              value={form.whatsapp}
              onChange={e => setForm(f => ({ ...f, whatsapp: maskPhone(e.target.value) }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="(86) 99999-9999"
              maxLength={15}
              className={INPUT}
            />
          </StepLayout>
        );

      // ── 3: email ─────────────────────────────────────────────────────────
      case 3:
        return (
          <StepLayout
            question="E o seu melhor e-mail?"
            hint="Para enviarmos o material informativo do programa"
            error={error}
          >
            <input
              autoFocus
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="seu@email.com"
              className={INPUT}
            />
          </StepLayout>
        );

      // ── 4: bairro ────────────────────────────────────────────────────────
      case 4:
        return (
          <StepLayout
            question="Em qual bairro você mora?"
            hint="Queremos entender como você está próximo de nós"
            error={error}
          >
            <input
              autoFocus
              type="text"
              value={form.bairro}
              onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="Ex: Centro, Fátima, Jóquei..."
              className={INPUT}
            />
          </StepLayout>
        );

      // ── 5: dificuldade (SUGESTÃO COMERCIAL) ──────────────────────────────
      case 5:
        return (
          <StepLayout
            question="Qual área você quer arrasar no ENEM?"
            hint="Isso nos ajuda a personalizar o seu atendimento"
            error={error}
          >
            <div className="grid grid-cols-1 gap-3 mt-2">
              {DIFICULDADES.map(d => (
                <button
                  key={d.label}
                  onClick={() => pick("dificuldade", d.label)}
                  className={`${CARD_BTN} ${form.dificuldade === d.label ? CARD_BTN_ACTIVE : ""}`}
                >
                  <span className="text-xl">{d.emoji}</span>
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </StepLayout>
        );

      // ── 6: curso ─────────────────────────────────────────────────────────
      case 6:
        return (
          <StepLayout
            question="Qual curso você quer fazer?"
            hint="Escreva livremente — pode ser qualquer área!"
            error={error}
          >
            <input
              autoFocus
              type="text"
              value={form.curso}
              onChange={e => setForm(f => ({ ...f, curso: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="Ex: Medicina, Engenharia, Direito..."
              className={INPUT}
            />
          </StepLayout>
        );

      // ── 7: urgência (SUGESTÃO COMERCIAL) ─────────────────────────────────
      case 7:
        return (
          <StepLayout
            question="Quando você quer começar?"
            hint="Isso nos ajuda a reservar sua vaga"
            error={error}
          >
            <div className="flex flex-col gap-3 mt-2">
              {QUANDO.map(q => (
                <button
                  key={q.label}
                  onClick={() => pick("quando_comecar", q.label)}
                  className={`${CARD_BTN} ${form.quando_comecar === q.label ? CARD_BTN_ACTIVE : ""}`}
                >
                  <span className="text-xl">{q.emoji}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{q.label}</span>
                    <span className="text-xs text-muted">{q.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </StepLayout>
        );

      // ── 8: sucesso ────────────────────────────────────────────────────────
      case 8:
        return (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M7 18l8 8L29 10" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-text mb-3">
              Incrível, {form.nome.split(" ")[0]}! 🎉
            </h2>
            <p className="text-muted max-w-sm mx-auto mb-10 leading-relaxed">
              Você será redirecionado para nosso WhatsApp em{" "}
              <span className="text-accent-light font-bold">{countdown}s</span>
              {" "}para finalizar sua matrícula.
            </p>
            <button
              onClick={() => { window.open(buildWhatsAppUrl(form), "_blank"); closeQuiz(); }}
              className={BTN}
            >
              Falar agora no WhatsApp <span>→</span>
            </button>
            <p className="text-muted/50 text-xs mt-4">
              Nossa equipe está aguardando você 💬
            </p>
          </div>
        );
    }
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 hidden items-center justify-center p-4"
      style={{ background: "rgba(5, 11, 24, 0.92)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === overlayRef.current) closeQuiz(); }}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-lg bg-secondary rounded-3xl border border-border overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(37,99,235,0.12), 0 32px 64px rgba(0,0,0,0.6)" }}
      >
        {/* Progress bar */}
        {step >= 1 && step <= TOTAL_DATA_STEPS && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-border">
            <div
              className="h-full bg-accent-light transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {step === 8 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500/60" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="ESA" width={80} height={32} className="object-contain opacity-90" />
            {step >= 1 && step <= TOTAL_DATA_STEPS && (
              <span className="text-xs text-muted font-sans tracking-widest">
                {step}/{TOTAL_DATA_STEPS}
              </span>
            )}
          </div>
          <button
            onClick={closeQuiz}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-text hover:bg-border transition-all duration-300"
            aria-label="Fechar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-8 overflow-hidden min-h-[360px] flex flex-col">
          <div ref={stepRef} className="flex flex-col flex-1">
            {renderStep()}
          </div>
        </div>

        {/* Footer navigation (steps 1-7, not on card-selection steps that auto-advance) */}
        {step >= 1 && step <= 7 && step !== 5 && step !== 7 && (
          <div className="flex items-center justify-between px-6 pb-6">
            <button onClick={back} className="text-sm text-muted hover:text-text transition-colors duration-300 flex items-center gap-1">
              <span>←</span> Voltar
            </button>
            <button onClick={next} disabled={submitting} className={`${BTN} py-3 px-6 text-base`}>
              {submitting ? "Enviando..." : step === 6 ? "Ver resumo →" : "Continuar →"}
            </button>
          </div>
        )}
        {step === 5 && (
          <div className="flex items-center justify-start px-6 pb-6">
            <button onClick={back} className="text-sm text-muted hover:text-text transition-colors duration-300 flex items-center gap-1">
              <span>←</span> Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepLayout({
  question, hint, error, children,
}: { question: string; hint: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-text mb-2">{question}</h2>
      <p className="text-muted text-sm mb-6 leading-relaxed">{hint}</p>
      {children}
      {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-1"><span>⚠️</span> {error}</p>}
    </div>
  );
}

import { ReactNode } from "react";

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT =
  "w-full bg-primary border border-border rounded-xl px-4 py-4 text-text text-lg placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors duration-300 font-sans";

const BTN =
  "inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-display font-semibold text-lg rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-light hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-60 disabled:pointer-events-none";

const CARD_BTN =
  "flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border border-border bg-primary text-text font-sans text-sm text-left transition-all duration-300 hover:border-accent/60 hover:bg-accent/5";

const CARD_BTN_ACTIVE =
  "!border-accent bg-accent/10 text-accent-light";
