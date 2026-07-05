import { Reveal } from "./Reveal";
import { SectionLabel, SECTION_INNER, SECTION_SLIDE_ROOT } from "./Section";
import { TESTIMONIALS } from "@/lib/data";

export function Testimonials() {
  return (
    <section id="testimonials" className={`${SECTION_SLIDE_ROOT} border-t border-line bg-surface`}>
      <div className={SECTION_INNER}>
      <Reveal>
        <SectionLabel>05 / references</SectionLabel>
        <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
          What colleagues say
        </h2>
      </Reveal>

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(min(340px,100%),1fr))] gap-3.5">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.name}
            as="figure"
            delay={(i % 3) * 0.06}
            className="m-0 flex flex-col gap-4 rounded-xl border border-line bg-white p-[22px]"
          >
            <blockquote className="m-0 text-[14.5px] leading-relaxed text-[#3f3a35] text-pretty">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-[11px] border-t border-line pt-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface font-mono text-[13px] font-semibold text-accent">
                {t.initials}
              </span>
              <div>
                <div className="text-[13.5px] font-semibold">{t.name}</div>
                <div className="font-mono text-[11px] text-muted2">{t.title}</div>
              </div>
            </figcaption>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
