"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";

import {
  ArrowRightIcon,
  BrandLogo,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/sites/scale-com-31338bde/shared/icons";
import { usePageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import { cn } from "@/lib/utils";

import { NAV_ITEMS } from "./content";

/** `style` payload carrying the two nav custom properties. */
type NavVars = CSSProperties & Record<"--nav-background" | "--nav-text", string>;

/**
 * The header never tweens colour in JS — it only swaps these custom properties
 * and lets `transition-colors` on the wrapper do the animating.
 */
const THEME_VARS: Record<"light" | "dark", NavVars> = {
  dark: {
    "--nav-background": "transparent",
    "--nav-text": "#ffffff",
  },
  light: {
    "--nav-background": "rgba(255, 255, 255, 0.8)",
    "--nav-text": "#000000",
  },
};

const LOGIN_HREF = "https://dashboard.scale.com/login";
const DEMO_HREF = "/demo";
const MOBILE_NAV_ID = "site-header-mobile-nav";
const DESKTOP_QUERY = "(min-width: 768px)";

export function SiteHeader() {
  const theme = usePageTheme();
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const desktopNavRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Escape closes whichever surface is open.
  useEffect(() => {
    if (!menuOpen && openNav === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenNav(null);
      setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, openNav]);

  // Pointer-down outside the desktop nav dismisses the dropdown.
  useEffect(() => {
    if (openNav === null) return;

    const onPointerDown = (event: PointerEvent) => {
      const nav = desktopNavRef.current;
      if (nav && event.target instanceof Node && nav.contains(event.target)) {
        return;
      }
      setOpenNav(null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openNav]);

  // Lock the page behind the mobile overlay.
  useEffect(() => {
    if (!menuOpen) return;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Growing past the md breakpoint retires the mobile overlay.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, []);

  // Move focus into the overlay on open and back to the toggle on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menuOpen) {
      closeRef.current?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  // Hide on scroll-down, reveal on scroll-up (visible in the reference capture:
  // the header is absent in every scrolled frame).
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (y < 80) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setOpenNav(null);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-[color,background-color,translate] duration-300 top-[var(--announcement-offset,0px)]",
          hidden && !menuOpen && "-translate-y-[calc(100%+var(--announcement-offset,0px))]",
        )}
      >
        <div
          style={THEME_VARS[theme]}
          className={cn(
            "relative shrink-0 transition-colors duration-200 delay-20 bg-(--nav-background) text-(--nav-text)",
            theme === "light" && "backdrop-blur-md",
          )}
        >
          <div className="relative z-100 py-3.75 md:py-6 oml:py-3">
            <div className="relative items-center flex gap-2 px-6 items-center justify-between md:grid-layout-desktop">
              {/* Logo */}
              <div className="relative z-20 col-span-1 flex min-w-0 shrink-0 items-center self-center md:shrink-0 text-(--nav-text)">
                <Link
                  href="/"
                  aria-label="Home"
                  className="relative w-max focus:outline-1 focus:outline-scale-skyblue"
                >
                  <BrandLogo className="h-[18px] w-auto max-w-[80px] shrink-0 xl:h-5" />
                </Link>
              </div>

              {/* Desktop navigation */}
              <nav
                ref={desktopNavRef}
                aria-label="Main"
                className="hidden md:col-span-8 md:flex md:items-center md:justify-start md:gap-1 md:pl-2"
              >
                {NAV_ITEMS.map((item) => {
                  const isOpen = openNav === item.label;
                  const hasPanel = Boolean(item.href);

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() =>
                        hasPanel ? setOpenNav(item.label) : undefined
                      }
                      onMouseLeave={() => setOpenNav(null)}
                      onFocus={() =>
                        hasPanel ? setOpenNav(item.label) : undefined
                      }
                      onBlur={onNavBlur}
                    >
                      <button
                        type="button"
                        aria-haspopup={hasPanel ? "menu" : undefined}
                        aria-expanded={hasPanel ? isOpen : undefined}
                        onClick={() =>
                          setOpenNav(hasPanel && !isOpen ? item.label : null)
                        }
                        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[14px] leading-5 font-medium whitespace-nowrap opacity-80 transition-opacity duration-200 hover:opacity-100 focus:outline-1 focus:outline-scale-skyblue"
                      >
                        {item.label}
                        <ChevronRightIcon
                          className={cn(
                            "size-3 shrink-0 transition-transform duration-200",
                            isOpen ? "-rotate-90" : "rotate-90",
                          )}
                        />
                      </button>

                      {item.href ? (
                        <div
                          className={cn(
                            // Tailwind v4 emits `translate-*` onto the standalone
                            // `translate` property, so that — not `transform` —
                            // is what has to be transitioned.
                            "absolute top-full left-1/2 z-30 w-56 -translate-x-1/2 pt-3 transition-[opacity,translate] duration-200 ease-out",
                            isOpen
                              ? "pointer-events-auto translate-y-0 opacity-100"
                              : "pointer-events-none -translate-y-1 opacity-0",
                          )}
                        >
                          <div className="rounded-xl border border-black/5 bg-white p-1.5 text-scale-gray-10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]">
                            <Link
                              href={item.href}
                              tabIndex={isOpen ? undefined : -1}
                              onClick={() => setOpenNav(null)}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[14px] leading-5 font-medium transition-colors duration-200 hover:bg-scale-gray-95 focus:outline-1 focus:outline-scale-skyblue"
                            >
                              {item.label}
                              <ArrowRightIcon className="size-3.5 shrink-0" />
                            </Link>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>

              {/* Desktop actions */}
              <div className="hidden md:col-span-3 md:flex md:items-center md:justify-end md:gap-5">
                <Link
                  href={LOGIN_HREF}
                  className="inline-flex items-center rounded-full border border-current/25 px-4 py-2 text-[13px] leading-5 font-medium whitespace-nowrap opacity-90 transition-opacity duration-200 hover:opacity-100 focus:outline-1 focus:outline-scale-skyblue"
                >
                  Log In
                </Link>
                <Link
                  href={DEMO_HREF}
                  className={cn(
                    "inline-flex items-center rounded-full px-4 py-2 text-[13px] leading-5 font-medium whitespace-nowrap transition-colors duration-200 delay-20 focus:outline-1 focus:outline-scale-skyblue",
                    // The pill inverts with the section theme; a white pill on
                    // the light (white/80) nav background would be invisible.
                    theme === "dark"
                      ? "bg-white text-black hover:bg-scale-gray-90"
                      : "bg-black text-white hover:bg-scale-gray-10",
                  )}
                >
                  Get Started
                </Link>
              </div>

              {/* Mobile toggle */}
              <button
                ref={toggleRef}
                type="button"
                aria-label="Open menu"
                aria-controls={MOBILE_NAV_ID}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className="relative z-20 -mr-2 flex size-10 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full focus:outline-1 focus:outline-scale-skyblue md:hidden"
              >
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay — a sibling of <header> so it also covers the
          announcement bar's stacking context. */}
      <div
        id={MOBILE_NAV_ID}
        aria-label="Mobile menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-[130] flex flex-col bg-scale-gray-10 text-white transition-[opacity,translate] duration-300 ease-out md:hidden",
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-6 py-3.75">
          <Link
            href="/"
            aria-label="Home"
            onClick={closeMenu}
            className="relative w-max focus:outline-1 focus:outline-scale-skyblue"
          >
            <BrandLogo className="h-[18px] w-auto max-w-[80px] shrink-0" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:text-white focus:outline-1 focus:outline-scale-skyblue"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 pt-4 pb-10"
        >
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between gap-3 border-b border-white/10 py-4 text-[22px] leading-7 font-medium transition-colors duration-200 hover:text-scale-skyblue focus:outline-1 focus:outline-scale-skyblue"
              >
                {item.label}
                <ChevronRightIcon className="size-4 shrink-0 opacity-50" />
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                className="flex cursor-pointer items-center justify-between gap-3 border-b border-white/10 py-4 text-left text-[22px] leading-7 font-medium transition-colors duration-200 hover:text-scale-skyblue focus:outline-1 focus:outline-scale-skyblue"
              >
                {item.label}
                <ChevronRightIcon className="size-4 shrink-0 opacity-50" />
              </button>
            ),
          )}

          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Link
              href={LOGIN_HREF}
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-5 py-3 text-[14px] leading-5 font-medium transition-colors duration-200 hover:border-white focus:outline-1 focus:outline-scale-skyblue"
            >
              Log In
            </Link>
            <Link
              href={DEMO_HREF}
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[14px] leading-5 font-medium text-black transition-opacity duration-200 hover:opacity-85 focus:outline-1 focus:outline-scale-skyblue"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
