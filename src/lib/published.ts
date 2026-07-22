import { cache } from "react";
import { readCollection } from "./cms";
import { supabaseConfigured } from "@/utils/supabase/service";
import {
  PROFILE,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  TESTIMONIALS,
  POSTS,
  type Profile,
  type CapabilitySource,
  type Project,
  type Job,
  type Education,
  type Certification,
  type Testimonial,
  type Post,
} from "./data";
import capabilitiesJson from "../../content/capabilities.json";
import heroJson from "../../content/hero.json";

export type PublishedHero = {
  stats: { v: string; k: string }[];
  clients: string[];
};

export type PublishedSite = {
  profile: Profile;
  hero: PublishedHero;
  capabilities: CapabilitySource[];
  projects: Project[];
  experience: Job[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  posts: Post[];
};

const staticHero = heroJson as PublishedHero;
const staticCapabilities = capabilitiesJson as CapabilitySource[];

async function safeRead<T>(id: string, fallback: T): Promise<T> {
  try {
    const data = await readCollection(id as Parameters<typeof readCollection>[0]);
    if (data == null) return fallback;
    return data as T;
  } catch {
    return fallback;
  }
}

/** Server-only published content (Supabase cms_docs, else content/*.json). */
export const getPublishedSite = cache(async (): Promise<PublishedSite> => {
  // Always try readCollection — it falls back to JSON when Supabase is empty/unconfigured.
  void supabaseConfigured;
  const [profile, hero, capabilities, projects, experience, education, certifications, testimonials, posts] =
    await Promise.all([
      safeRead("profile", PROFILE),
      safeRead("hero", staticHero),
      safeRead("capabilities", staticCapabilities),
      safeRead("projects", PROJECTS),
      safeRead("experience", EXPERIENCE),
      safeRead("education", EDUCATION),
      safeRead("certifications", CERTIFICATIONS),
      safeRead("testimonials", TESTIMONIALS),
      safeRead("posts", POSTS),
    ]);

  return {
    profile,
    hero: {
      stats: Array.isArray(hero?.stats) ? hero.stats : staticHero.stats,
      clients: Array.isArray(hero?.clients) ? hero.clients : staticHero.clients,
    },
    capabilities: Array.isArray(capabilities) ? capabilities : staticCapabilities,
    projects: Array.isArray(projects) ? projects : PROJECTS,
    experience: Array.isArray(experience) ? experience : EXPERIENCE,
    education: Array.isArray(education) ? education : EDUCATION,
    certifications: Array.isArray(certifications) ? certifications : CERTIFICATIONS,
    testimonials: Array.isArray(testimonials) ? testimonials : TESTIMONIALS,
    posts: Array.isArray(posts) ? posts : POSTS,
  };
});
