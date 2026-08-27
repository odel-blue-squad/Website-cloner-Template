import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Aeonik Pro is a commercial licence (CoType Foundry) and is deliberately NOT
 * vendored here. Switzer (Fontshare, ITF Free Font License) is used instead,
 * pinned to Aeonik's measured metrics so every line box lands identically:
 *
 *   Aeonik measured  → ascent 0.930  descent 0.230  cap 0.700  x-height 0.510
 *   Switzer natural  → ascent 0.980  descent 0.250  cap 0.680  x-height 0.531
 *   Aeonik/Switzer advance-width ratio (6 sample strings) → 0.9756
 *
 * To swap in real Aeonik: drop the woff2 files alongside these and change the
 * `src` paths — the overrides below can then be removed.
 */
const aeonik = localFont({
  src: [
    { path: "../../public/sites/scale-com-31338bde/shared/fonts/switzer-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/sites/scale-com-31338bde/shared/fonts/switzer-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/sites/scale-com-31338bde/shared/fonts/switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    { prop: "size-adjust", value: "97.56%" },
    { prop: "ascent-override", value: "95.33%" },
    { prop: "descent-override", value: "23.58%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const scaleMono = localFont({
  src: [{ path: "../../public/sites/scale-com-31338bde/shared/fonts/switzer-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-scale-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Reliable AI Systems for Critical Decisions | Scale AI",
  description:
    "The world's most important decisions need reliable AI systems. Scale delivers the frontier research, data, and deployment experience to build AI that works in the real world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${aeonik.variable} ${scaleMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
