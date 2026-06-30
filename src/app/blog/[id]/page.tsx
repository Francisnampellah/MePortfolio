import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { POSTS } from "@/lib/data";
import { ARTICLES } from "@/lib/articles";

type Params = { params: { id: string } };

export function generateStaticParams() {
  return POSTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = POSTS.find((p) => p.id === params.id);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} — Baraka Nampellah`,
    description: post.excerpt,
  };
}

export default function ArticlePage({ params }: Params) {
  const post = POSTS.find((p) => p.id === params.id);
  const article = ARTICLES[params.id];
  if (!post || !article) notFound();

  return (
    <main className="mx-auto max-w-[720px] px-6 pb-24 pt-14">
      <Link
        href="/#blog"
        className="inline-flex items-center gap-2 font-mono text-[12.5px] text-muted2 transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        all articles
      </Link>

      <article className="mt-8">
        <div className="flex items-center gap-2.5 font-mono text-[11.5px] text-muted3">
          <span className="rounded-md bg-[#faf2ee] px-2 py-1 font-medium text-accent">{post.cat}</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.read}</span>
          <span>·</span>
          <span>by Baraka N.</span>
        </div>

        <h1 className="mt-[18px] text-[clamp(28px,4.2vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414] text-balance">
          {post.title}
        </h1>
        <p className="mt-[18px] text-[18px] italic leading-relaxed text-[#54504a] text-pretty">
          {article.lede}
        </p>

        <hr className="my-7 border-line" />

        {article.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mt-[30px] text-[21px] font-bold tracking-[-0.02em] text-ink">{s.h}</h2>
            {s.paras.map((p, i) => (
              <p key={i} className="mt-[13px] text-[16px] leading-[1.72] text-[#3f3a35] text-pretty">
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-9 flex items-center gap-3.5 rounded-xl border border-line bg-surface px-[22px] py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/baraka.jpg"
            alt="Baraka Nampellah"
            className="h-[46px] w-[46px] shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="text-[14px] font-bold text-ink">Baraka Nampellah</div>
            <div className="text-[13px] leading-[1.45] text-muted">
              Writes code by day, writes jokes about code by night. Both compile about 70% of the time.
            </div>
          </div>
        </div>

        <Link
          href="/#blog"
          className="mt-6 inline-block rounded-[9px] bg-ink px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-black"
        >
          ← Back to all articles
        </Link>
      </article>
    </main>
  );
}
