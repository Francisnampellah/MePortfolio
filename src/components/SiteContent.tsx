"use client";

import { createContext, useContext } from "react";
import type { PublishedSite } from "@/lib/published";
import {
  PROFILE,
  HERO_STATS,
  CLIENTS,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  TESTIMONIALS,
  POSTS,
  normalizeCapability,
  type CapabilitySource,
} from "@/lib/data";
import capabilitiesJson from "../../content/capabilities.json";
import heroJson from "../../content/hero.json";

const fallback: PublishedSite = {
  profile: PROFILE,
  hero: heroJson as PublishedSite["hero"],
  capabilities: capabilitiesJson as CapabilitySource[],
  projects: PROJECTS,
  experience: EXPERIENCE,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  testimonials: TESTIMONIALS,
  posts: POSTS,
};

const SiteContentContext = createContext<PublishedSite>(fallback);

export function SiteContentProvider({
  value,
  children,
}: {
  value: PublishedSite;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent(): PublishedSite {
  return useContext(SiteContentContext);
}

export function usePublishedCapabilities() {
  const { capabilities } = useSiteContent();
  const list = Array.isArray(capabilities) ? capabilities : (capabilitiesJson as CapabilitySource[]);
  return list.map(normalizeCapability);
}

export function usePublishedProfile() {
  return useSiteContent().profile;
}

export function usePublishedHero() {
  const { hero } = useSiteContent();
  return {
    stats: hero?.stats?.length ? hero.stats : HERO_STATS,
    clients: hero?.clients?.length ? hero.clients : CLIENTS,
  };
}
