import { Reveal } from "./Reveal";
import { SectionLabel } from "./Section";
import { EXPERIENCE, EDUCATION } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="relative z-[1] mx-auto max-w-[920px] px-6 py-16">
      <Reveal>
        <SectionLabel>03 / journey</SectionLabel>
        <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
          Experience timeline
        </h2>
      </Reveal>

      <div className="relative mt-[38px] pl-[30px]">
        <div className="absolute bottom-1.5 left-[7px] top-1.5 w-px bg-line" />
        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.company} delay={i * 0.07} className="relative pb-[26px]">
            <span className="absolute -left-[30px] top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border border-accent bg-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <div className="rounded-xl border border-line bg-white px-5 py-[18px]">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-[11px]">
                  <span className="grid h-9 w-9 place-items-center rounded-[9px] border border-line bg-white font-mono text-[12px] font-semibold text-accent">
                    {e.icon}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold tracking-[-0.01em]">{e.role}</h3>
                    <div className="text-[13px] font-medium text-accent">{e.company}</div>
                  </div>
                </div>
                <span className="rounded-[7px] border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted2">
                  {e.period}
                </span>
              </div>
              <ul className="mt-[13px] flex list-disc flex-col gap-1.5 pl-[17px]">
                {e.points.map((pt) => (
                  <li key={pt} className="text-[13.5px] leading-[1.55] text-muted">
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-[13px] flex flex-wrap gap-1.5">
                {e.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line bg-surface px-2 py-[3px] font-mono text-[10.5px] text-[#7c776f]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Education & certifications */}
      <Reveal className="mt-5">
        <div className="mb-3.5 font-mono text-[11.5px] tracking-[0.04em] text-muted2">
          Education &amp; Certifications
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {EDUCATION.map((ed) => (
            <div key={ed.title} className="rounded-xl border border-line bg-white px-[18px] py-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-[14.5px] font-bold leading-[1.3]">{ed.title}</h4>
                <span className="shrink-0 font-mono text-[10.5px] text-faint">{ed.year}</span>
              </div>
              <div className="mt-1.5 text-[12.5px] font-medium text-accent">{ed.org}</div>
              <p className="mt-1.5 text-[12px] leading-[1.5] text-muted">{ed.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
