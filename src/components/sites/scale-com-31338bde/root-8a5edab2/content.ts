/**
 * Verbatim content from https://scale.com/ — text copied from the live DOM,
 * asset paths point at the namespaced local downloads.
 */
import type { BenchmarkCard, BlogPost, CustomerCard, FooterColumn, IndustryWord, NavItem } from "@/types/scale";

const IMG = "/sites/scale-com-31338bde/root-8a5edab2/images";
export const VIDEO = "/sites/scale-com-31338bde/root-8a5edab2/videos";
export const TEXTURE = "/sites/scale-com-31338bde/root-8a5edab2/textures";

export const NAV_ITEMS: NavItem[] = [
  { label: "Products" },
  { label: "Solutions" },
  { label: "Research" },
  { label: "Resources" },
];

export const ANNOUNCEMENT = {
  text: "Scale appoints Francis deSouza as the new CEO",
  cta: "Learn more",
  href: "/blog",
};

export const HERO = {
  /** Line break verbatim from the live render. */
  headingLines: ["The world’s most important decisions", "need reliable AI systems."],
  scrollHint: "Scroll to explore",
  logos: [`${IMG}/hero-logo-1.png`, `${IMG}/logo-bp.png`, `${IMG}/hero-logo-2.png`, `${IMG}/hero-logo-3.png`, `${IMG}/hero-logo-4.png`],
};

/**
 * Pull-apart copy stops, verbatim from the SSR HTML (hidden at load, revealed
 * at fixed scroll-progress windows). `align` matches the live layout.
 */
export const HERO_STOPS = [
  {
    eyebrow: null,
    heading: "Reliable AI has no shortcuts.",
    body: "Scale works across the AI stack, from the data that trains the models you rely on, to the systems that put them to work. Humans stay in the loop.",
    cta: null,
    href: null,
    align: "center" as const,
    range: [0.12, 0.34] as const,
  },
  {
    eyebrow: "Applications",
    heading: "AI systems that actually work.",
    body: "Most AI deployments in enterprise and government fail. We find the right use case, build the system, and own the outcome.",
    cta: "For Enterprise",
    href: "/enterprise/agentic-solutions",
    align: "left" as const,
    range: [0.38, 0.62] as const,
  },
  {
    eyebrow: "Data",
    heading: "The data powering the world's best AI.",
    body: "The models at the frontier run on Scale data. We source contributors with precision (25% have advanced degrees) and deliver at the bar frontier AI demands.",
    cta: "Explore Data Engine",
    href: "/data-engine",
    align: "right" as const,
    range: [0.66, 0.97] as const,
  },
];

/** Rendered word-by-word as the section scrubs past. */
export const SCROLLING_QUOTE = {
  lines: ["90% of the world's", "leading generative AI", "model builders are", "powered by Scale."],
  video: `${VIDEO}/quote-bg.mp4`,
};

/**
 * The headline is static ("Artificial Intelligence / Real ___"); only the word
 * after "Real" cycles. Colour and slide direction are verbatim from the SSR
 * markup's inline styles and data-direction attributes.
 */
export const INDUSTRY_STATIC = { line1: "Artificial Intelligence", line2: "Real" };

export const INDUSTRY_WORDS: IndustryWord[] = [
  { word: "Research",       color: "#A8927C", direction: "left",  image: `${IMG}/industry-research.png`,      alt: "Research image" },
  { word: "Life Science",   color: "#A8927C", direction: "left",  image: `${IMG}/industry-medicine.png`,      alt: "Medicine image" },
  { word: "Medicine",       color: "#193A29", direction: "right", image: `${IMG}/industry-decisions.png`,     alt: "Decisions image" },
  { word: "Energy",         color: "#A8927C", direction: "left",  image: `${IMG}/industry-energy.jpg`,        alt: "Energy image" },
  { word: "Infrastructure", color: "#193A29", direction: "right", image: `${IMG}/industry-impact.jpg`,        alt: "Impact image" },
  { word: "Sovereignty",    color: "#193A29", direction: "right", image: `${IMG}/industry-sovereignty.jpg`,   alt: "Sovereignty image" },
  { word: "Robotics",       color: "#79648C", direction: "left",  image: `${IMG}/industry-robots.jpg`,        alt: "Robots image" },
  { word: "Defense",        color: "#A8927C", direction: "left",  image: `${IMG}/industry-capabilities.jpg`,  alt: "Capabilities image" },
  { word: "Operations",     color: "#79648C", direction: "left",  image: `${IMG}/industry-supply-chains.jpg`, alt: "Supply chains image" },
  { word: "Healthcare",     color: "#A8927C", direction: "left",  image: `${IMG}/industry-consequences.jpg`,  alt: "Consequences image" },
  { word: "Autonomy",       color: "#A8927C", direction: "left",  image: `${IMG}/industry-driving.png`,       alt: "Driving image" },
  { word: "Logistics",      color: "#193A29", direction: "right", image: `${IMG}/industry-logistics.jpg`,     alt: "Logistics image" },
];

export const INDUSTRY_CTA = { label: "Get started", href: "/demo" };
export const CUSTOMERS_HEADING = "Proven across every industry.";

export const CUSTOMERS: CustomerCard[] = [
  { lines: ["Turning raw, classified data", "into actionable intelligence."], company: "CDAO", logo: `${IMG}/logo-cdao.png`, href: "/public-sector" },
  { lines: ["Partnering to accelerate", "Meta's LLM and Generative AI."], company: "Meta", logo: `${IMG}/logo-meta.png`, href: "/enterprise" },
  { lines: ["Reducing physician cognitive", "load by turning complex patient", "records into clinical intelligence."], company: "Mayo Clinic", logo: `${IMG}/logo-mayo-clinic.png`, href: "/enterprise/healthcare" },
  { lines: ["Powering an interactive AI", "experience that brings a", "century of journalism to life."], company: "Time", logo: `${IMG}/logo-time.png`, href: "/customers/time" },
  { lines: ["Accelerating real estate", "development revenue", "and operations."], company: "Howard Hughes", logo: `${IMG}/logo-howard-hughes.png`, href: "/enterprise" },
  { lines: ["Fuelling the next generation", "of robotic foundation models", "with real-world training data."], company: "Physical Intelligence", logo: `${IMG}/logo-physical-intel.png`, href: "/physical-ai" },
  { lines: ["Enabling scalable,", "real-world Physical AI", "for industrial robotics."], company: "Universal Robots", logo: `${IMG}/logo-universal-robots.png`, href: "/physical-ai" },
  { lines: ["Benchmarking the frontier", "of AI capability with", "expert-level evaluations."], company: "Center for AI Safety", logo: `${IMG}/logo-cais.png`, href: "https://labs.scale.com/" },
  { lines: ["Accelerating enterprise AI", "adoption across global", "energy operations."], company: "British Petroleum", logo: `${IMG}/logo-bp.png`, href: "/enterprise" },
  { lines: ["Enabling smarter, more", "personalized learning", "experiences for students", "and educators at scale."], company: "Cengage", logo: `${IMG}/logo-cengage.png`, href: "/enterprise" },
  { lines: ["Building agentic AI that", "drives EBITDA gains across", "PE portfolio companies."], company: "Shore Capital", logo: `${IMG}/logo-shore-capital.png`, href: "/enterprise" },
];

export const BENCHMARK_HEADING = "We set the benchmark for what’s possible with AI";

export const BENCHMARK_CARDS: BenchmarkCard[] = [
  {
    lines: ["10 years powering the", "world's biggest AI", "breakthroughs."],
    body: ["Since 2016, we've been at the", "forefront; from autonomous", "vehicles to frontier models solving", "the world's hardest problems."],
    cta: "Learn More", href: "/about",
  },
  {
    lines: ["The standard every", "frontier model is", "measured against."],
    body: ["Our leaderboards run private", "benchmarks for the most ambitious", "AI companies to improve model", "capabilities."],
    cta: "Learn More", href: "https://labs.scale.com/leaderboard",
  },
  {
    lines: ["Behind the model.", "Behind the mission.", "Behind it all."],
    body: ["Only Scale has the frontier research,", "world’s best data, and deployment", "experience to build AI that works in", "the real world."],
    cta: "Learn More", href: "/generative-ai-data-engine",
  },
];

export const BLOG_HEADING = { lead: "From the Lab to the real world.", sub: "The latest from Scale." };

/**
 * Mosaic layout verbatim from the reference capture. `variant` picks the card
 * treatment; `cols` is the desktop 12-column placement.
 */
export const BLOG_MOSAIC = [
  { variant: "panel" as const,   cols: "md:col-span-6", height: "h-[210px]", chip: "Labs", chipColor: "#193a29",
    title: "Introducing Scale Labs", href: "/blog/scale-labs" },
  { variant: "overlay" as const, cols: "md:col-span-6", height: "h-[280px]", chip: null, chipColor: null,
    title: "Mayo Clinic + Scale: Reliable AI for Better Healthcare", titleColor: "#9fd9ac",
    image: `${IMG}/blog-mayo-clinic.png`, href: "/blog/mayo-clinic-scale" },
  { variant: "caption" as const, cols: "md:col-span-6", height: "h-[280px]", chip: "Company", chipColor: "#373737",
    title: "How Morgan Stanley deploys AI that actually works (hint: it's evals) | Human in the Loop: Episode 13",
    image: `${IMG}/blog-morgan-stanley.png`, alt: "Scale and Morgan Stanley", href: "/blog/hitl-ep13-ai-evals-in-practice" },
  { variant: "caption" as const, cols: "md:col-span-3", height: "h-[160px]", chip: "Public Sector", chipColor: "#a8543f",
    title: "The Next Phase of U.S. AI Policy: Governance, Implementation, and Global Leadership",
    image: `${IMG}/blog-ai-policy.jpg`, href: "/blog/next-phase-us-ai-policy" },
  { variant: "caption" as const, cols: "md:col-span-3", height: "h-[160px]", chip: "Public Sector", chipColor: "#a8543f",
    title: "Scale AI and BAE Systems Combine Forces to Modernize the Tactical Edge",
    image: `${IMG}/blog-bae-systems.jpg`,
    alt: "Scale AI and BAE Systems company logos positioned side-by-side against a black background",
    href: "/blog/scale-bae-modernize-tactical-edge" },
  { variant: "caption" as const, cols: "md:col-span-3", height: "h-[150px]", chip: "Research", chipColor: "#79648C",
    title: "SWE-Bench Pro: Raising the Bar for Agentic Coding",
    image: `${IMG}/blog-swe-bench.png`, href: "/blog/swe-bench-pro" },
  { variant: "overlay" as const, cols: "md:col-span-6", height: "h-[220px]", chip: "Company", chipColor: "#373737",
    title: "MCIT & Scale AI: Paving the Way for Qatar\u2019s Digital Future", titleColor: "#ffffff",
    image: `${IMG}/blog-mcit-qatar.jpg`, href: "/blog/mcit-scale" },
  { variant: "caption" as const, cols: "md:col-span-3", height: "h-[150px]", chip: "Product", chipColor: "#193a29",
    title: "Expanding Our Data Engine for Physical AI",
    image: `${IMG}/blog-physical-ai.png`, alt: "Robotics", href: "/blog/physical-ai" },
];

export const CTA = {
  lines: ["Our legacy,", "your success."],
  body: ["Book a demo today and see how Scale can", "build reliable AI for your organization."],
  cta: "Get Started",
  href: "/demo",
  video: `${VIDEO}/cta-bg.mp4`,
};

export const FOOTER_COLUMNS: FooterColumn[] = [
  { heading: "PRODUCTS", links: [
    { label: "Scale Data Engine", href: "/data-engine" },
    { label: "Scale GenAI Pofolio", href: "/genai-platform" },
    { label: "Scale Donovan", href: "/donovan" } ] },
  { heading: "SOLUTIONS", links: [
    { label: "Enterprise", href: "/enterprise/agentic-solutions" },
    { label: "Insurance", href: "/enterprise/insurance" },
    { label: "Healthcare", href: "/enterprise/healthcare" },
    { label: "US Public Sector", href: "/public-sector" },
    { label: "Global Public Sector", href: "/global-public-sector" } ] },
  { heading: "COMPANY", links: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Security", href: "/security" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Modern Slavery Statement", href: "/legal/modern-slavery-statement" } ] },
  { heading: "RESOURCES", links: [
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/demo" },
    { label: "Events", href: "/events" },
    { label: "Documentation", href: "/docs" },
    { label: "Data Partnerships", href: "/data-partnership" },
    { label: "Brand Guidelines", href: "https://brand.scale.com/" } ] },
  { heading: "GUIDES", links: [
    { label: "Data Labeling", href: "/guides/data-labeling-annotation-guide" },
    { label: "ML Model Training", href: "/guides/model-training-building" },
    { label: "Diffusion Models", href: "/guides/diffusion-models-guide" },
    { label: "Guide To AI For ECommerce", href: "/guides/ai-for-ecommerce" },
    { label: "Computer Vision Applications", href: "/guides/computer-vision" },
    { label: "Large Language Models", href: "/guides/large-language-models" } ] },
];

export const FOOTER_TAGLINE = "Reliable AI for the world’s most important decisions";
export const FOOTER_LEGAL = {
  cookies: "MANAGE YOUR COOKIE PREFERENCES",
  copyright: "COPYRIGHT © 2026 SCALE AI, INC. ALL RIGHTS RESERVED",
  terms: "TERMS OF USE", termsHref: "/legal/terms",
  privacy: "PRIVACY POLICY", privacyHref: "/legal/privacy",
  linkedin: "https://www.linkedin.com/company/scaleai",
  x: "https://x.com/scale_ai",
};
