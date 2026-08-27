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
  heading: "The world’s most important decisions need reliable AI systems.",
  scrollHint: "Scroll to explore",
  logos: [`${IMG}/hero-logo-1.png`, `${IMG}/logo-bp.png`, `${IMG}/hero-logo-2.png`, `${IMG}/hero-logo-3.png`, `${IMG}/hero-logo-4.png`],
};

/** Rendered word-by-word as the section scrubs past. */
export const SCROLLING_QUOTE = {
  lines: ["90% of the world's", "leading generative AI", "model builders are", "powered by Scale."],
  video: `${VIDEO}/quote-bg.mp4`,
};

/** Cycles in the centre while the image ring orbits behind it. */
export const INDUSTRY_WORDS: IndustryWord[] = [
  { word: "Artificial Intelligence" },
  { word: "Real" },
  { word: "Research",       image: `${IMG}/industry-research.png`,      alt: "Research image" },
  { word: "Life Science",   image: `${IMG}/industry-medicine.png`,      alt: "Medicine image" },
  { word: "Medicine",       image: `${IMG}/industry-decisions.png`,     alt: "Decisions image" },
  { word: "Energy",         image: `${IMG}/industry-energy.jpg`,        alt: "Energy image" },
  { word: "Infrastructure", image: `${IMG}/industry-impact.jpg`,        alt: "Impact image" },
  { word: "Sovereignty",    image: `${IMG}/industry-sovereignty.jpg`,   alt: "Sovereignty image" },
  { word: "Robotics",       image: `${IMG}/industry-robots.jpg`,        alt: "Robots image" },
  { word: "Defense",        image: `${IMG}/industry-capabilities.jpg`,  alt: "Capabilities image" },
  { word: "Operations",     image: `${IMG}/industry-supply-chains.jpg`, alt: "Supply chains image" },
  { word: "Healthcare",     image: `${IMG}/industry-consequences.jpg`,  alt: "Consequences image" },
  { word: "Autonomy",       image: `${IMG}/industry-driving.png`,       alt: "Driving image" },
  { word: "Logistics",      image: `${IMG}/industry-logistics.jpg`,     alt: "Logistics image" },
];

export const INDUSTRY_CTA = { label: "Get Started", href: "/demo" };
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

export const BLOG_FEATURED: BlogPost[] = [
  { title: "Introducing Scale Labs", image: `${IMG}/blog-scale-labs.png`, href: "/blog/scale-labs", featured: true },
  { title: "Mayo Clinic + Scale: Reliable AI for Better Healthcare", image: `${IMG}/blog-morgan-stanley.png`, href: "/blog/mayo-clinic-scale", featured: true },
];

export const BLOG_POSTS: BlogPost[] = [
  { category: "COMPANY", title: "How Morgan Stanley deploys AI that actually works (hint: it's evals) | Human in the Loop: Episode 13", image: `${IMG}/blog-morgan-stanley.png`, alt: "Scale and Morgan Stanley", href: "/blog/hitl-ep13-ai-evals-in-practice" },
  { category: "PUBLIC SECTOR", title: "The Next Phase of U.S. AI Policy: Governance, Implementation, and Global Leadership", image: `${IMG}/blog-ai-policy.jpg`, href: "/blog/next-phase-us-ai-policy" },
  { category: "PUBLIC SECTOR", title: "Scale AI and BAE Systems Combine Forces to Modernize the Tactical Edge", image: `${IMG}/blog-bae-systems.jpg`, alt: "Scale AI and BAE Systems company logos positioned side-by-side against a black background", href: "/blog/scale-bae-modernize-tactical-edge" },
  { category: "RESEARCH", title: "SWE-Bench Pro: Raising the Bar for Agentic Coding", image: `${IMG}/blog-swe-bench.png`, href: "/blog/swe-bench-pro" },
  { category: "COMPANY", title: "MCIT & Scale AI: Paving the Way for Qatar’s Digital Future", image: `${IMG}/blog-mcit-qatar.jpg`, href: "/blog/mcit-scale" },
  { category: "PRODUCT", title: "Expanding Our Data Engine for Physical AI", image: `${IMG}/blog-physical-ai.png`, alt: "Robotics", href: "/blog/physical-ai" },
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
