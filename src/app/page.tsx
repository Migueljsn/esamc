import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Activities } from "@/components/Activities";
import { Pricing } from "@/components/Pricing";
import { Approved } from "@/components/Approved";
import { CTASection } from "@/components/CTASection";
import { InstagramCTA } from "@/components/InstagramCTA";
import { Footer } from "@/components/Footer";
import { QuizProvider } from "@/context/QuizContext";
import { LeadQuiz } from "@/components/LeadQuiz";

export default function Home() {
  return (
    <QuizProvider>
      <main>
        <Hero />
        <Stats />
        <About />
        <Activities />
        <Pricing />
        <Approved />
        <CTASection />
        <InstagramCTA />
        <Footer />
      </main>
      <LeadQuiz />
    </QuizProvider>
  );
}
