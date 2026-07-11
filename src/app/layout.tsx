import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { FacebookPixel } from "@/components/FacebookPixel";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Escola Santa Angélica — Matrículas Abertas",
  description: "Matrículas abertas na Escola Santa Angélica: da Educação Infantil ao Ensino Médio. Tradição desde 1984 em Teresina, PI.",
  keywords: ["Escola Santa Angélica", "ESA", "matrícula", "Educação Infantil", "Ensino Fundamental", "Ensino Médio", "Teresina", "escola particular"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-primary text-text antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
        <FacebookPixel />
      </body>
    </html>
  );
}
