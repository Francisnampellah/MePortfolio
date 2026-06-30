"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";

type ImageSlotProps = {
  /** Stable id — the dropped image persists in localStorage under this key. */
  id: string;
  placeholder?: string;
  className?: string;
  rounded?: "none" | "full" | "lg";
  alt?: string;
  /** Image shown by default (e.g. a real asset in /public). Still replaceable. */
  defaultSrc?: string;
};

/**
 * Drag-and-drop / click-to-upload image placeholder.
 * Stores the chosen image as a data URL in localStorage so it survives reloads.
 * Replace with <Image /> + real assets for production.
 */
export function ImageSlot({
  id,
  placeholder = "Drop or click to add image",
  className = "",
  rounded = "none",
  alt = "",
  defaultSrc,
}: ImageSlotProps) {
  const [src, setSrc] = useState<string | null>(defaultSrc ?? null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const key = `imgslot:${id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setSrc(saved);
    } catch {
      /* ignore */
    }
  }, [key]);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setSrc(result);
      try {
        localStorage.setItem(key, result);
      } catch {
        /* quota — ignore */
      }
    };
    reader.readAsDataURL(file);
  };

  const radius =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-xl" : "";

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`group relative grid h-full w-full place-items-center overflow-hidden bg-surface2 ${radius} ${className}`}
      style={{ boxShadow: over ? "inset 0 0 0 2px var(--accent)" : undefined }}
      aria-label={placeholder}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-1.5 px-2 text-center">
          <ImagePlus className="h-4 w-4 text-faint" strokeWidth={1.6} />
          <span className="font-mono text-[10.5px] uppercase tracking-wide text-faint">
            {placeholder}
          </span>
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleFile(e.target.files?.[0])
        }
      />
    </button>
  );
}
