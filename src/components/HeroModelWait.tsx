"use client";

/** Soft wait UI while the hero 3D model loads — copy + progress only. */
export function HeroModelWait({
  progress = 8,
  message = "One moment…",
}: {
  progress?: number;
  message?: string;
}) {
  const pct = Math.min(100, Math.max(6, Math.round(progress)));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
      <p className="text-[16px] font-semibold tracking-[-0.015em] text-ink">{message}</p>
      <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-muted">
        Hang tight... something nice is loading.
      </p>

      <div className="mt-5 h-[3px] w-36 overflow-hidden rounded-full bg-[#efeae4]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-[10px] tabular-nums tracking-[0.06em] text-faint">{pct}%</p>
    </div>
  );
}
