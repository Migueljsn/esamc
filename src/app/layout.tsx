import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { QuizProvider } from "@/context/QuizContext";
import { LeadQuiz } from "@/components/LeadQuiz";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "ESA MasterClass — Foco Total no ENEM",
  description: "A turma de aprovação do Colégio Santa Angélica. Professores especializados no ENEM. Teresina, PI. R$70/mês.",
  keywords: ["ENEM", "MasterClass", "Colégio Santa Angélica", "ESA", "Teresina", "aprovação"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-primary text-text antialiased">
        <QuizProvider>
          <LenisProvider>
            {children}
            <LeadQuiz />
          </LenisProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
