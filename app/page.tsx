import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
