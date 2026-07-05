"use client";

import { Home, Layers, FolderGit2, Newspaper, Mail, type LucideIcon } from "lucide-react";
import { useFullPageScroll } from "@/lib/fullPageScroll";

/**
 * Mobile-only (<md) bottom tab bar — the app-shell counterpart of the desktop
 * dot rail. Five shortcut tabs; sections without a tab of their own (experience,
 * testimonials, github) keep the nearest preceding tab lit while scrolled through,
 * the way an app section keeps its tab active on inner screens.
 */

const TABS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "tech", label: "Stack", Icon: Layers },
  { id: "projects", label: "Work", Icon: FolderGit2 },
  { id: "blog", label: "Blog", Icon: Newspaper },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function TabBar() {
  const { sectionIds, index, goToId } = useFullPageScroll();

  // Active tab = the last tab whose section is at or before the current one.
  let activeTab = 0;
  TABS.forEach((t, ti) => {
    const si = sectionIds.indexOf(t.id);
    if (si >= 0 && si <= index) activeTab = ti;
  });

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="grid h-14 grid-cols-5">
        {TABS.map(({ id, label, Icon }, ti) => {
          const active = ti === activeTab;
          return (
            <button
              key={id}
              onClick={() => goToId(id)}
              aria-current={active ? "true" : undefined}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {active ? (
                <span aria-hidden className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-accent" />
              ) : null}
              <Icon
                className={`h-[19px] w-[19px] transition-colors ${active ? "text-accent" : "text-muted2"}`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span
                className={`text-[10px] leading-none transition-colors ${
                  active ? "font-semibold text-accent" : "font-medium text-muted2"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
