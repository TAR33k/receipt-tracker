import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TechnologySection,
  CTASection,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050506]">
      <AnimatedBackground />
      <Header isLandingPage={true} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechnologySection />
        <CTASection />
      </main>
      <Footer isLandingPage={true} />
    </div>
  );
}
