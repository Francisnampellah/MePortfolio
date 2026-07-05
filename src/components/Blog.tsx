"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { ImageSlot } from "./ImageSlot";
import { POSTS, BLOG_CATS } from "@/lib/data";

const CARD_W = 300; // px — also the arrow-scroll step

/**
 * One-row snap carousel (instead of a multi-row grid) so the section fits a
 * single screen at full type size. Cards keep the original blog-card design.
 */
export function Blog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const trackRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const visible = POSTS.filter(
    (p) =>
      (cat === "All" || p.cat === cat) &&
      (!q || `${p.title} ${p.excerpt} ${p.cat}`.toLowerCase().includes(q))
  );

  const nudge = (dir: number) =>
    trackRef.current?.scrollBy({ left: dir * (CARD_W + 14), behavior: "smooth" });

  return (
    <section
      id="blog"
      className="relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip border-t border-line bg-surface py-14 md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden md:py-0"
    >
      <div className="mx-auto w-full max-w-page px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-[18px]">
          <div>
            <SectionLabel>07 / writing</SectionLabel>
            <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
              From the blog
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-[13px] py-2">
            <Search className="h-3.5 w-3.5 text-muted3" strokeWidth={2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-[150px] border-none bg-transparent text-[13px] text-ink outline-none"
            />
          </div>
        </Reveal>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-[7px]">
            {BLOG_CATS.map((c) => {
              const on = cat === c;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className="rounded-[7px] border px-[13px] py-[7px] font-mono text-[12px] font-medium transition-all"
                  style={{
                    color: on ? "#fff" : "#3f3a35",
                    background: on ? "#1a1a1a" : "#fff",
                    borderColor: on ? "#1a1a1a" : "#e8e5e0",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => nudge(-1)}
              aria-label="Previous articles"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd9d3] bg-white text-ink transition-colors hover:border-accent"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Next articles"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#ddd9d3] bg-white text-ink transition-colors hover:border-accent"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-[46px] text-center text-[14px] text-muted3">
            No articles match your search.
          </div>
        ) : (
          <div
            ref={trackRef}
            className="-mx-6 mt-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((b, i) => (
              <Reveal
                key={b.id}
                as="article"
                delay={(i % 3) * 0.05}
                className="flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-line bg-white transition-colors hover:border-[#d6d1ca]"
              >
                <div className="relative aspect-video border-b border-line bg-surface2">
                  <ImageSlot id={`blog-${b.id}`} placeholder="Drop cover" alt={b.title} />
                </div>
                <Link href={`/blog/${b.id}`} className="flex flex-1 flex-col gap-2.5 p-[18px]">
                  <div className="flex items-center gap-2.5 font-mono text-[10.5px] text-muted3">
                    <span className="rounded-md bg-[#faf2ee] px-2 py-[3px] font-medium text-accent">{b.cat}</span>
                    <span>{b.date}</span>
                    <span>·</span>
                    <span>{b.read}</span>
                  </div>
                  <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.3] tracking-[-0.01em]">{b.title}</h3>
                  <p className="line-clamp-2 flex-1 text-[13px] leading-[1.55] text-muted">{b.excerpt}</p>
                  <span className="text-[12.5px] font-semibold text-accent">Read article →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
