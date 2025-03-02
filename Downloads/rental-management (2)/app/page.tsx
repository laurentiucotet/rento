import { LandingNav } from "@/components/landing-nav"
import { LandingFooter } from "@/components/landing-footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { FAQSection } from "@/components/landing/faq-section"
import { RequestDemoSection } from "@/components/landing/request-demo-section"
import { VideoSection } from "@/components/landing/video-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <VideoSection />
        <TestimonialsSection />
        <FAQSection />
        <RequestDemoSection />
      </main>
      <LandingFooter />
    </div>
  )
}

