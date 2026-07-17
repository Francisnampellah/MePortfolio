import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { POSTS, PROFILE } from "@/lib/data";
import { ARTICLES } from "@/lib/articles";
import { ReadingProgress } from "./ReadingProgress";

type Params = { params: { id: string } };

// Book-style serif for the pull quotes — a deliberate contrast to the sans body.
const SERIF = "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif";

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = POSTS.find((p) => p.id === params.id);
  if (!post) return { title: "Article not found" };
  return { title: `${post.title} · Baraka Nampellah`, description: post.excerpt };
}

/**
 * Pull the closing line out of a section to set as a book-style quote: takes the
 * last sentence of the last paragraph (or the last two if it's very short), and
 * returns the remaining body so the line isn't printed twice.
 */
function splitPullQuote(paras: string[]): { bodyParas: string[]; quote: string } {
  const last = paras[paras.length - 1];
  const sentences = (last.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [last]).map((s) => s.trim());
  let take = sentences[sentences.length - 1].length < 24 && sentences.length > 1 ? 2 : 1;
  if (sentences.slice(-take).join(" ").length > 160) take = 1;

  const quote = sentences.slice(-take).join(" ").trim();
  const remainder = sentences.slice(0, sentences.length - take).join(" ").trim();
  const bodyParas = remainder ? [...paras.slice(0, -1), remainder] : paras.slice(0, -1);
  return { bodyParas, quote };
}

export default function ArticlePage({ params }: Params) {
  const post = POSTS.find((p) => p.id === params.id);
  const article = ARTICLES[params.id];
  if (!post || !article) notFound();

  return (
    <>
      <ReadingProgress />

      <main className="mx-auto max-w-[720px] px-6 pb-24 pt-14">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 font-mono text-[12.5px] text-muted2 transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          All articles
        </Link>

        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11.5px] text-muted3">
            <span className="rounded-md bg-[#faf2ee] px-2 py-1 font-medium text-accent">{post.cat}</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.read} read</span>
            <span>·</span>
            <span>by Baraka Nampellah</span>
          </div>

          <h1 className="mt-4 text-[clamp(28px,4.4vw,42px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#141414] text-balance">
            {post.title}
          </h1>

          <p className="mt-5 border-l-2 border-accent pl-4 text-[clamp(17px,2.2vw,20px)] leading-[1.55] text-[#54504a] text-pretty">
            {article.lede}
          </p>

          <hr className="my-8 border-line" />

          {article.sections.map((s) => {
            const { bodyParas, quote } = splitPullQuote(s.paras);
            return (
              <section key={s.h}>
                <h2 className="mt-9 text-[clamp(20px,2.6vw,24px)] font-bold tracking-[-0.02em] text-ink">{s.h}</h2>
                {bodyParas.map((p, i) => (
                  <p key={i} className="mt-3.5 text-[16.5px] leading-[1.75] text-[#3f3a35] text-pretty">
                    {p}
                  </p>
                ))}

                {quote ? (
                  <figure className="my-9 text-center">
                    <span aria-hidden className="mx-auto mb-4 block h-[2px] w-10 rounded-full bg-accent" />
                    <blockquote
                      className="mx-auto max-w-[600px] text-[clamp(20px,3vw,27px)] font-medium italic leading-[1.45] text-[#2a2118]"
                      style={{ fontFamily: SERIF }}
                    >
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </figure>
                ) : null}
              </section>
            );
          })}

          <div className="mt-12 flex items-center gap-4 rounded-xl border border-line bg-surface px-5 py-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/baraka.jpg" alt={PROFILE.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
            <div>
              <div className="text-[14.5px] font-bold text-ink">{PROFILE.name}</div>
              <div className="mt-0.5 text-[13px] leading-[1.5] text-muted">
                {PROFILE.role} · {PROFILE.location}
              </div>
            </div>
          </div>

          <Link
            href="/#blog"
            className="mt-6 inline-flex items-center gap-2 rounded-[9px] bg-ink px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-black"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to all articles
          </Link>
        </article>
      </main>
    </>
  );
}
