"use client";

/** Shared wait UI used while the hero 3D chunk / textures load. */
export function HeroModelWait({
  progress = 8,
  message = "Winding the spring…",
}: {
  progress?: number;
  message?: string;
}) {
  const pct = Math.min(100, Math.max(4, Math.round(progress)));

  return (
    <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-center">
      <div className="mx-4 flex w-full max-w-[280px] flex-col items-center gap-4 rounded-2xl border border-line bg-white/90 px-6 py-7 text-center shadow-[0_18px_50px_rgba(20,18,15,.12)] backdrop-blur-md">
        <div className="relative grid h-14 w-14 place-items-center">
          <span aria-hidden className="absolute inset-0 rounded-full border-2 border-[#e8e2da]" />
          <span
            aria-hidden
            className="absolute inset-1 rounded-full border border-[color-mix(in_srgb,var(--accent)_35%,transparent)]"
            style={{ animation: "hero-clock-spin 8s linear infinite" }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[18px] w-[2px] origin-bottom rounded-full bg-accent"
            style={{ animation: "hero-clock-hand 3s linear infinite" }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[12px] w-[2px] origin-bottom rounded-full bg-ink"
            style={{ animation: "hero-clock-hand 36s linear infinite" }}
          />
          <span aria-hidden className="relative h-1.5 w-1.5 rounded-full bg-ink" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Loading 3D</p>
          <p className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-ink">{message}</p>
          <p className="mt-1.5 text-[12.5px] leading-snug text-muted">
            Worth a short wait. The model is high-res.
          </p>
        </div>

        <div className="w-full">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-muted2">
            <span>progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#efeae4]">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
