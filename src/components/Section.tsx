import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Full-page slide root: one viewport tall at md+, mobile vertical breathing room. */
export const SECTION_SLIDE_ROOT =
  "relative z-[1] flex min-h-[calc(100dvh-4rem)] w-full shrink-0 scroll-mt-16 flex-col justify-center overflow-x-clip py-14 md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden md:py-0";

/** Inner content column inside a slide. */
export const SECTION_INNER = "mx-auto w-full max-w-page px-6";

/** Contact + Footer share one slide; wrapper carries the slide sizing. */
export const CONTACT_SLIDE_ROOT =
  "flex min-h-[calc(100dvh-4rem)] w-full shrink-0 flex-col overflow-x-clip md:h-[var(--slide-h)] md:min-h-0 md:overflow-hidden";

/** Mono section eyebrow, e.g. "02 / toolbox". */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[12.5px] tracking-[0.04em] text-accent">
      {children}
    </div>
  );
}

export function SectionHeading({
  label,
  title,
  blurb,
  center,
}: {
  label: string;
  title: string;
  blurb?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : undefined}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-2.5 text-[clamp(26px,3.4vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#141414]">
        {title}
      </h2>
      {blurb ? (
        <p
          className={`mt-3 max-w-[540px] text-[15.5px] leading-relaxed text-muted ${
            center ? "mx-auto" : ""
          }`}
        >
          {blurb}
        </p>
      ) : null}
    </Reveal>
  );
}
