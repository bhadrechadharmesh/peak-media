import { Navbar } from "@/components/peak/navbar";
import { CursorGlow } from "@/components/peak/cursor-glow";
import { LoadingScreen } from "@/components/peak/loading-screen";
import { Hero } from "@/components/peak/sections/hero";
import { ClientMarquee } from "@/components/peak/sections/marquee";
import { Kpis } from "@/components/peak/sections/kpis";
import { Services } from "@/components/peak/sections/services";
import { GrowthProcess } from "@/components/peak/sections/timeline";
import { CampaignDashboard } from "@/components/peak/sections/dashboard";
import { CaseStudies } from "@/components/peak/sections/case-studies";
import { Portfolio } from "@/components/peak/sections/portfolio";
import { WhyChoose } from "@/components/peak/sections/why-choose";
import { Testimonials } from "@/components/peak/sections/testimonials";
import { Pricing } from "@/components/peak/sections/pricing";
import { Contact } from "@/components/peak/sections/contact";
import { Faq } from "@/components/peak/sections/faq";
import { Newsletter } from "@/components/peak/sections/newsletter";
import { Footer } from "@/components/peak/sections/footer";
import { LiveChat } from "@/components/peak/live-chat";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Peak Media",
  description:
    "Premium digital marketing agency specializing in branding, SEO, social media marketing, paid advertising, web design, and content creation.",
  url: "https://peakmedia.agency",
  email: "hello@peakmedia.agency",
  areaServed: "Worldwide",
  serviceType: [
    "Branding",
    "SEO",
    "Social Media Marketing",
    "Paid Advertising",
    "Web Design",
    "Content Creation",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "120",
  },
};

export default function Home() {
  return (
    <div id="top" className="relative flex min-h-screen flex-col overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background layers */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-electric/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40vh] w-[40vw] rounded-full bg-[#2b6bff]/10 blur-[120px]" />
      </div>

      <LoadingScreen />
      <CursorGlow />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <ClientMarquee />
        <Kpis />
        <Services />
        <GrowthProcess />
        <CampaignDashboard />
        <CaseStudies />
        <Portfolio />
        <WhyChoose />
        <Testimonials />
        <Pricing />
        <Contact />
        <Faq />
        <Newsletter />
      </main>

      <Footer />
      <LiveChat />
    </div>
  );
}
