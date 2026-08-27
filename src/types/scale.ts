/** Content contracts for the scale.com homepage clone. */

export interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface CustomerCard {
  /** Verbatim copy, split on the source's own line breaks. */
  lines: string[];
  company: string;
  logo: string;
  href: string;
}

export interface IndustryWord {
  word: string;
  /** Inline colour from the live markup. */
  color: string;
  /** Slide-in direction from the live markup's data-direction. */
  direction: "left" | "right";
  image: string;
  alt: string;
}

export interface BenchmarkCard {
  lines: string[];
  body: string[];
  cta: string;
  href: string;
}

export interface BlogPost {
  title: string;
  category?: string;
  /** Absent for text-only cards (scale.com renders those on a flat grey panel). */
  image?: string;
  href: string;
  alt?: string;
  featured?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}
