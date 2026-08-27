import { notFound } from "next/navigation";
import { SmoothScrollProvider } from "@/components/sites/scale-com-31338bde/shared/SmoothScrollProvider";
import { AnnouncementBar } from "@/components/sites/scale-com-31338bde/root-8a5edab2/AnnouncementBar";
import { SiteHeader } from "@/components/sites/scale-com-31338bde/root-8a5edab2/SiteHeader";
import { ScrollingQuote } from "@/components/sites/scale-com-31338bde/root-8a5edab2/ScrollingQuote";
import { IndustryRing } from "@/components/sites/scale-com-31338bde/root-8a5edab2/IndustryRing";
import { CustomerMarquee } from "@/components/sites/scale-com-31338bde/root-8a5edab2/CustomerMarquee";
import { BenchmarkCards } from "@/components/sites/scale-com-31338bde/root-8a5edab2/BenchmarkCards";
import { BlogPreview } from "@/components/sites/scale-com-31338bde/root-8a5edab2/BlogPreview";
import { CtaSection } from "@/components/sites/scale-com-31338bde/root-8a5edab2/CtaSection";
import { SiteFooter } from "@/components/sites/scale-com-31338bde/root-8a5edab2/SiteFooter";

/**
 * Development-only harness: renders one section at a time at the top of the
 * document so it can be inspected and screenshotted without scrolling to it.
 * Returns 404 in production.
 */
const SECTIONS = {
  quote: ScrollingQuote,
  industry: IndustryRing,
  customers: CustomerMarquee,
  benchmarks: BenchmarkCards,
  blog: BlogPreview,
  cta: CtaSection,
  footer: SiteFooter,
  header: SiteHeader,
} as const;

type SectionKey = keyof typeof SECTIONS;

export function generateStaticParams() {
  // Emit nothing in production so these never appear as real routes.
  if (process.env.NODE_ENV !== "development") return [];
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export default async function QaSectionPage({ params }: { params: Promise<{ section: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();

  const { section } = await params;
  const Section = SECTIONS[section as SectionKey];
  if (!Section) notFound();

  const chrome = section !== "header" && section !== "footer";

  return (
    <SmoothScrollProvider>
      <main>
        {chrome ? (
          <>
            <AnnouncementBar />
            <SiteHeader />
          </>
        ) : null}
        <div className="relative overflow-x-hidden">
          <div className="CMSSliceRenderer rootPageRenderer relative">
            <Section />
          </div>
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
