import type { Metadata } from "next";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Activities } from "@/components/Activities";
import { Approved } from "@/components/Approved";
import { InstagramCTA } from "@/components/InstagramCTA";
import { Footer } from "@/components/Footer";
import { QuizProvider } from "@/context/QuizContext";
import { Hero } from "./_components/Hero";
import { ScholarshipInfo } from "./_components/ScholarshipInfo";
import { CTASection } from "./_components/CTASection";
import { BolsaQuiz } from "./_components/BolsaQuiz";

export const metadata: Metadata = {
  title: "Teste Bolsa — Escola Santa Angélica",
  description:
    "Agende o Teste Bolsa da Escola Santa Angélica no dia 26 de setembro e concorra a uma bolsa de até 100% a partir do 2º ano do Ensino Fundamental.",
  keywords: [
    "Escola Santa Angélica", "ESA", "teste bolsa", "bolsa de estudos",
    "Ensino Fundamental", "Ensino Médio", "Teresina", "escola particular",
  ],
};

export default function TesteBolsaPage() {
  return (
    <QuizProvider>
      <main>
        <Hero />
        <Stats />
        <About />
        <Activities />
        <ScholarshipInfo />
        <Approved />
        <CTASection />
        <InstagramCTA />
        <Footer />
      </main>
      <BolsaQuiz />
    </QuizProvider>
  );
}
