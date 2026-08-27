import Link from "next/link";
import {
  BrandMark,
  LinkedInIcon,
  XIcon,
} from "@/components/sites/scale-com-31338bde/shared/icons";
import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  FOOTER_TAGLINE,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";

const LEGAL_ITEM =
  "font-mono text-[9px] uppercase tracking-[0.08em] text-scale-gray-60 transition-colors duration-200 ease-out hover:text-scale-gray-80";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-12 pt-8 pb-6 text-white bg-black md:gap-32">
      <div className="relative mb-8 top gap-y-10 grid-layout-mobile md:mb-0 md:grid-layout-desktop portrait:md:max-lg:gap-y-[40px]">
        <div className="col-span-8 md:col-span-1">
          <BrandMark className="size-5 text-white" aria-hidden="true" />
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav
            key={column.heading}
            aria-label={column.heading}
            className="col-span-4 md:col-span-2"
          >
            <h2 className="font-mono text-[10px] uppercase tracking-[0.1em] text-scale-gray-60">
              {column.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-[12px] leading-[1.6] text-white transition-colors duration-200 hover:text-scale-gray-80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="center grid-layout-mobile md:grid-layout-desktop">
        <h2 className="header1 col-span-8 font-normal text-white md:col-span-11 md:text-[116px] md:leading-[116px] md:tracking-[-1.16px]">
          {FOOTER_TAGLINE}
        </h2>
      </div>

      <div className="flex flex-col justify-between gap-12 md:items-center md:flex-row bottom grid-padding">
        <div className="flex items-center gap-4">
          <a
            href={FOOTER_LEGAL.linkedin}
            aria-label="Scale AI on LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-scale-gray-60 transition-colors duration-200 ease-out hover:text-white"
          >
            <LinkedInIcon className="size-4" aria-hidden="true" />
          </a>
          <a
            href={FOOTER_LEGAL.x}
            aria-label="Scale AI on X"
            target="_blank"
            rel="noopener noreferrer"
            className="text-scale-gray-60 transition-colors duration-200 ease-out hover:text-white"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <button
            type="button"
            aria-label={FOOTER_LEGAL.cookies}
            data-cookie-preferences=""
            className={`${LEGAL_ITEM} text-left md:text-right`}
          >
            {FOOTER_LEGAL.cookies}
          </button>
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-scale-gray-60">
            {FOOTER_LEGAL.copyright}{" "}
            <Link href={FOOTER_LEGAL.termsHref} className="underline underline-offset-2 hover:text-scale-gray-80">
              {FOOTER_LEGAL.terms}
            </Link>{" "}
            &amp;{" "}
            <Link href={FOOTER_LEGAL.privacyHref} className="underline underline-offset-2 hover:text-scale-gray-80">
              {FOOTER_LEGAL.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
