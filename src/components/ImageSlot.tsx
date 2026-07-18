"use client";

type ImageSlotProps = {
  /** Stable id — kept for call-site compatibility. */
  id: string;
  placeholder?: string;
  className?: string;
  rounded?: "none" | "full" | "lg";
  alt?: string;
  /** Image shown by default (e.g. a real asset in /public). */
  defaultSrc?: string;
};

/**
 * Display-only image frame. Empty slots show a quiet placeholder —
 * no click-to-upload (that belonged to admin prototyping, not visitors).
 */
export function ImageSlot({
  placeholder = "Image",
  className = "",
  rounded = "none",
  alt = "",
  defaultSrc,
}: ImageSlotProps) {
  const radius =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-xl" : "";

  if (defaultSrc) {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-surface2 ${radius} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={defaultSrc} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden bg-surface2 ${radius} ${className}`}
      aria-label={placeholder}
    >
      <span className="font-mono text-[10.5px] uppercase tracking-wide text-faint">{placeholder}</span>
    </div>
  );
}
