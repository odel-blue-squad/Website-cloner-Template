import { SmoothScrollProvider } from "@/components/sites/scale-com-31338bde/shared/SmoothScrollProvider";
import { AnnouncementBar } from "@/components/sites/scale-com-31338bde/root-8a5edab2/AnnouncementBar";
import { SiteHeader } from "@/components/sites/scale-com-31338bde/root-8a5edab2/SiteHeader";
import { HomeHero } from "@/components/sites/scale-com-31338bde/root-8a5edab2/HomeHero";
import { ScrollingQuote } from "@/components/sites/scale-com-31338bde/root-8a5edab2/ScrollingQuote";
import { IndustryRing } from "@/components/sites/scale-com-31338bde/root-8a5edab2/IndustryRing";
import { CustomerMarquee } from "@/components/sites/scale-com-31338bde/root-8a5edab2/CustomerMarquee";
import { BenchmarkCards } from "@/components/sites/scale-com-31338bde/root-8a5edab2/BenchmarkCards";
import { BlogPreview } from "@/components/sites/scale-com-31338bde/root-8a5edab2/BlogPreview";
import { CtaSection } from "@/components/sites/scale-com-31338bde/root-8a5edab2/CtaSection";
import { SiteFooter } from "@/components/sites/scale-com-31338bde/root-8a5edab2/SiteFooter";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main>
        <div className="relative overflow-x-hidden">
          <AnnouncementBar />
          <SiteHeader />
          <div className="CMSSliceRenderer rootPageRenderer relative">
            <HomeHero />
            <ScrollingQuote />
            <IndustryRing />
            <CustomerMarquee />
            <BenchmarkCards />
            <BlogPreview />
            <CtaSection />
          </div>
        </div>
        <SiteFooter />
      </main>
    </SmoothScrollProvider>
  );
}
