import { Reveal } from "./Reveal";
import { SectionHeading } from "./Section";
import { ICONS } from "@/lib/icons";
import { AI_SERVICES } from "@/lib/data";

export function AiShowcase() {
  return (
    <section id="ai" className="relative z-[1] mx-auto max-w-page px-6 py-16">
      <SectionHeading
        label="06 / automation & ai"
        title="Systems that do real work"
        blurb="From microservices and data pipelines to blockchain logic and 3D experiences — a growing focus on automation and agentic AI."
      />

      <div className="mt-[34px] grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {AI_SERVICES.map((a, i) => {
          const Icon = ICONS[a.icon];
          return (
            <Reveal
              key={a.title}
              delay={(i % 3) * 0.05}
              className="rounded-xl border border-line bg-white p-5 transition-colors hover:border-[#d6d1ca]"
            >
              <Icon className="h-6 w-6 text-accent" strokeWidth={2} />
              <h3 className="mt-3.5 text-[16.5px] font-bold tracking-[-0.01em]">{a.title}</h3>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-muted">{a.desc}</p>
              <div className="mt-3.5 flex items-center gap-2 border-t border-line pt-[13px]">
                <span className="text-[17px] font-extrabold text-[#141414]">{a.metric}</span>
                <span className="font-mono text-[11px] leading-[1.3] text-muted2">{a.metricLabel}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
