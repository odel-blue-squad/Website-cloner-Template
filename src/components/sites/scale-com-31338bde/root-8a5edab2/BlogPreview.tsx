"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useTimelineScroll } from "@/components/sites/scale-com-31338bde/shared/useTimelineScroll";
import { pageTheme } from "@/components/sites/scale-com-31338bde/shared/pageTheme";
import {
  BLOG_FEATURED,
  BLOG_HEADING,
  BLOG_POSTS,
} from "@/components/sites/scale-com-31338bde/root-8a5edab2/content";
import type { BlogPost } from "@/types/scale";

const FEATURED_SIZES = "(min-width: 768px) 50vw, 100vw";
const POST_SIZES = "(min-width: 768px) 33vw, 100vw";

type CardRefSetter = (el: HTMLAnchorElement | null) => void;

interface BlogCardProps {
  post: BlogPost;
  setRef: CardRefSetter;
}

function FeaturedCard({ post, setRef }: BlogCardProps) {
  return (
    <Link
      ref={setRef}
      href={post.href}
      className="group col-span-8 block md:col-span-6"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-scale-gray-95">
        <Image
          src={post.image}
          alt={post.alt ?? ""}
          fill
          sizes={FEATURED_SIZES}
          className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
        />
      </div>
      <h3 className="header5-regular mt-4 text-scale-gray-10 transition-colors duration-300 ease-out group-hover:text-scale-gray-30 md:mt-6">
        {post.title}
      </h3>
    </Link>
  );
}

function PostCard({ post, setRef }: BlogCardProps) {
  return (
    <Link
      ref={setRef}
      href={post.href}
      className="group col-span-8 block md:col-span-4"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-scale-gray-95">
        <Image
          src={post.image}
          alt={post.alt ?? ""}
          fill
          sizes={POST_SIZES}
          className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.04]"
        />
      </div>
      {post.category ? (
        <p className="body3 mt-4 uppercase tracking-wider text-scale-gray-60">
          {post.category}
        </p>
      ) : null}
      <h3
        className={cn(
          "header6 text-scale-gray-10 transition-colors duration-300 ease-out group-hover:text-scale-gray-30",
          post.category ? "mt-2" : "mt-4",
        )}
      >
        {post.title}
      </h3>
    </Link>
  );
}

export function BlogPreview() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const registerCard = useCallback(
    (index: number): CardRefSetter =>
      (el) => {
        cardRefs.current[index] = el;
      },
    [],
  );

  const setupTimeline = useCallback((tl: gsap.core.Timeline) => {
    const cardEls = cardRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null,
    );
    if (cardEls.length === 0) return;
    tl.fromTo(
      cardEls,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.08, ease: "none" },
      0,
    );
  }, []);

  useTimelineScroll(rootRef, {
    start: "top bottom",
    end: "bottom 75%",
    scrub: true,
    setupTimeline,
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => pageTheme.set("light"),
      onEnterBack: () => pageTheme.set("light"),
    });
    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="BlogPreview overflow-hidden isolate w-full py-12 md:py-16 bg-white"
    >
      <div className="grid-layout-mobile md:grid-layout-desktop">
        <div className="col-span-8 md:col-span-12">
          <h2 className="header2 text-scale-gray-10">{BLOG_HEADING.lead}</h2>
          <p className="header3-regular mt-2 text-scale-gray-30 md:mt-3">
            {BLOG_HEADING.sub}
          </p>
        </div>
      </div>

      <div className="mt-10 gap-y-10 grid-layout-mobile md:mt-14 md:grid-layout-desktop md:gap-y-12">
        {BLOG_FEATURED.map((post, index) => (
          <FeaturedCard
            key={post.href}
            post={post}
            setRef={registerCard(index)}
          />
        ))}
      </div>

      <div className="mt-10 gap-y-10 grid-layout-mobile md:mt-16 md:grid-layout-desktop md:gap-y-12">
        {BLOG_POSTS.map((post, index) => (
          <PostCard
            key={post.href}
            post={post}
            setRef={registerCard(BLOG_FEATURED.length + index)}
          />
        ))}
      </div>
    </section>
  );
}
