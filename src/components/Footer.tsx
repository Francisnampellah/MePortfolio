import { ICONS } from "@/lib/icons";
import { PROFILE, SOCIALS } from "@/lib/data";
import { SECTION_INNER } from "./Section";

export function Footer() {
  return (
    <footer className={`${SECTION_INNER} shrink-0 pb-5`}>
      <div className="flex flex-wrap items-center justify-between gap-[18px] border-t border-line pt-4">
        <div className="flex items-center gap-[11px]">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[7px] bg-accent font-mono text-[11px] font-semibold text-white">
            {PROFILE.initials}
          </span>
          <div>
            <div className="text-[13px] font-semibold">{PROFILE.name}</div>
            <div className="font-mono text-[11px] text-muted3">
              Full-Stack Engineer · {PROFILE.location.split(",")[0]}, TZ
            </div>
          </div>
        </div>

        <div className="font-mono text-[11px] text-faint">© 2026 — built from scratch</div>

        <div className="flex gap-2">
          {SOCIALS.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-[#54504a] transition-colors hover:border-[#d6d1ca]"
              >
                <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
