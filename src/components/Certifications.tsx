import { Reveal } from "./Reveal";
import { SectionHeading } from "./Section";
import { CERTIFICATIONS } from "@/lib/data";
import { Award, Download } from "lucide-react";

export function Certifications() {
  return (
    <section id="certifications" className="relative z-[1] mx-auto max-w-page px-6 py-16">
      <SectionHeading
        label="04 / credentials"
        title="Certifications"
        blurb="Verified coursework and credentials. Each links to the issuer and includes a downloadable certificate."
      />

      <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(min(500px,100%),1fr))] gap-3.5">
        {CERTIFICATIONS.map((c, i) => (
          <Reveal
            key={c.credId}
            delay={(i % 2) * 0.06}
            className="flex flex-col gap-3.5 rounded-xl border border-line bg-white p-5 transition-colors hover:border-[#d6d1ca]"
          >
            <div className="flex items-start gap-3.5">
              <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[10px] border border-line bg-surface font-mono text-[13px] font-semibold text-accent">
                {c.badge}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2.5">
                  <h3 className="text-[16px] font-bold leading-[1.25] tracking-[-0.01em]">{c.title}</h3>
                  <span className="shrink-0 rounded-md border border-line bg-surface px-2 py-[3px] font-mono text-[10.5px] text-faint">
                    {c.year}
                  </span>
                </div>
                <div className="mt-1 text-[13px] font-medium text-accent">{c.issuer}</div>
              </div>
            </div>

            <p className="text-[13px] leading-[1.55] text-muted">{c.note}</p>

            <div className="flex items-center gap-2 font-mono text-[10.5px] text-muted3">
              <Award className="h-3 w-3" strokeWidth={2} />
              ID: {c.credId}
            </div>

            <div className="mt-auto flex gap-2.5 pt-1">
              <a
                href={c.verify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-ink py-2.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-black"
              >
                Verify ↗
              </a>
              <a
                href={c.file}
                download={c.fileName}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#ddd9d3] bg-white py-2.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-accent"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                Certificate
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
