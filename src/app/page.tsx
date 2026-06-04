import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Teachers } from "@/components/Teachers";
import { Pricing } from "@/components/Pricing";
import { Approved } from "@/components/Approved";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
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
  );
}
