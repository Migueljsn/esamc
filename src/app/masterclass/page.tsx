import type { Metadata } from "next";
import { Approved } from "@/components/Approved";
import { Footer } from "@/components/Footer";
import { MasterclassQuizProvider } from "./_lib/QuizContext";
import { Hero } from "./_components/Hero";
import { Stats } from "./_components/Stats";
import { About } from "./_components/About";
import { Teachers } from "./_components/Teachers";
import { Pricing } from "./_components/Pricing";
import { CTASection } from "./_components/CTASection";
import { LeadQuiz } from "./_components/LeadQuiz";

export const metadata: Metadata = {
  title: "ESA MasterClass — Foco Total no ENEM",
  description: "A turma de aprovação do Colégio Santa Angélica. Professores especializados no ENEM. Teresina, PI. R$70/mês.",
  keywords: ["ENEM", "MasterClass", "Colégio Santa Angélica", "ESA", "Teresina", "aprovação"],
};

export default function MasterclassPage() {
  return (
    <MasterclassQuizProvider>
      <main>
        <Hero />
        <Stats />
        <About />
        <Teachers />
        <Pricing />
        <Approved />
        <CTASection />
        <Footer />
      </main>
      <LeadQuiz />
    </MasterclassQuizProvider>
  );
}
