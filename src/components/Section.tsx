import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Mono section eyebrow, e.g. "01 / toolbox". */
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
