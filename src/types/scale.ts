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
  image?: string;
  alt?: string;
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
  image: string;
  href: string;
  alt?: string;
  featured?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}
