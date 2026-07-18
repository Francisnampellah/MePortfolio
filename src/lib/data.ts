import type { IconName } from "./icons";
import profile from "../../content/profile.json";
import projectsJson from "../../content/projects.json";
import experienceJson from "../../content/experience.json";
import educationJson from "../../content/education.json";
import certificationsJson from "../../content/certifications.json";
import testimonialsJson from "../../content/testimonials.json";
import postsJson from "../../content/posts.json";

/* ----------------------------------------------------------------
   Personal / identity  (content/profile.json — editable in /admin)
----------------------------------------------------------------- */
export type Profile = {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  location: string;
  cvUrl: string;
  email: string;
  phone: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  website: string;
  tagline: string;
  intro: string;
  stackJson: string;
};

export const PROFILE = profile as Profile;

export const HERO_STATS = [
  { v: "2+", k: "years experience" },
  { v: "6", k: "microservices shipped" },
  { v: "200+", k: "livestock records synced" },
];

export const CLIENTS = [
  "Afya Ya Mnyama",
  "SmartINNO",
  "BeginnerTech",
  "Amani Land",
  "Freelance",
];

/* ----------------------------------------------------------------
   Navigation
----------------------------------------------------------------- */
export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "tech", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "github", label: "GitHub" },
  { id: "blog", label: "Blog" },
] as const;

/* ----------------------------------------------------------------
   Tech stack (accordion) — static
----------------------------------------------------------------- */
export type SkillItem = { name: string; level: number; label: string };
export type TechGroup = {
  icon: IconName;
  name: string;
  tagline: string;
  items: SkillItem[];
};

export const TECH_GROUPS: TechGroup[] = [
  {
    icon: "server",
    name: "Backend & APIs",
    tagline: "services built to scale",
    items: [
      { name: "NestJS (TypeScript)", level: 90, label: "advanced" },
      { name: "Django REST", level: 85, label: "advanced" },
      { name: "Express.js", level: 86, label: "advanced" },
      { name: "RBAC & Auth", level: 88, label: "advanced" },
    ],
  },
  {
    icon: "code",
    name: "Frontend",
    tagline: "clean, reusable UI",
    items: [
      { name: "React.js", level: 92, label: "expert" },
      { name: "Next.js", level: 88, label: "advanced" },
      { name: "Tailwind CSS", level: 90, label: "advanced" },
      { name: "Redux / Context", level: 85, label: "advanced" },
    ],
  },
  {
    icon: "smartphone",
    name: "Mobile",
    tagline: "cross platform apps",
    items: [
      { name: "Flutter", level: 86, label: "advanced" },
      { name: "React Native", level: 88, label: "advanced" },
      { name: "Responsive UI", level: 90, label: "advanced" },
      { name: "App delivery", level: 82, label: "proficient" },
    ],
  },
  {
    icon: "database",
    name: "Databases",
    tagline: "modeled & optimized",
    items: [
      { name: "PostgreSQL", level: 88, label: "advanced" },
      { name: "MySQL", level: 82, label: "proficient" },
      { name: "Django ORM", level: 85, label: "advanced" },
      { name: "Query tuning", level: 80, label: "proficient" },
    ],
  },
  {
    icon: "cloud",
    name: "Cloud & DevOps",
    tagline: "ship safely",
    items: [
      { name: "AWS (EC2)", level: 80, label: "proficient" },
      { name: "Docker", level: 85, label: "advanced" },
      { name: "CI/CD", level: 85, label: "advanced" },
      { name: "Git & Postman", level: 92, label: "expert" },
    ],
  },
  {
    icon: "sparkles",
    name: "Emerging Tech",
    tagline: "always learning",
    items: [
      { name: "Agentic AI", level: 74, label: "foundations" },
      { name: "Hyperledger Fabric", level: 72, label: "proficient" },
      { name: "Three.js", level: 76, label: "proficient" },
      { name: "Workflow automation", level: 80, label: "proficient" },
    ],
  },
];

/* ----------------------------------------------------------------
   Projects  (content/projects.json — editable in /admin)
----------------------------------------------------------------- */
export type Project = {
  no: string;
  title: string;
  role: string;
  tags: string[];
  desc: string;
  problem: string;
  outcome: string;
  tech: string[];
  github: string;
  demo: string;
  image?: string;
};

export const PROJECTS = projectsJson as Project[];
export const PROJECT_FILTERS = ["All", "Mobile", "Full Stack", "AI", "Agentic AI", "Frontend"];

/* ----------------------------------------------------------------
   Experience + education  (content/*.json — editable in /admin)
----------------------------------------------------------------- */
export type Job = {
  icon: string;
  role: string;
  company: string;
  period: string;
  points: string[];
  tech: string[];
};

export const EXPERIENCE = experienceJson as Job[];

export type Education = {
  title: string;
  org: string;
  year: string;
  note: string;
};

export const EDUCATION = educationJson as Education[];

/* ----------------------------------------------------------------
   Certifications  (content/certifications.json — editable in /admin)
----------------------------------------------------------------- */
export type Certification = {
  badge: string;
  title: string;
  issuer: string;
  year: string;
  note: string;
  credId: string;
  verify: string;
  file: string;
  fileName: string;
};

export const CERTIFICATIONS = certificationsJson as Certification[];

/* ----------------------------------------------------------------
   Skills (rings + bars) — static
----------------------------------------------------------------- */
export const SKILL_RINGS = [
  { label: "90", level: 90, name: "Backend", sub: "NestJS · Django · APIs" },
  { label: "88", level: 88, name: "Mobile", sub: "Flutter · React Native" },
  { label: "90", level: 90, name: "Frontend", sub: "React · Next.js" },
  { label: "84", level: 84, name: "DevOps", sub: "Docker · AWS · CI/CD" },
];

export const SKILL_BARS = [
  { name: "API & microservices", level: 90 },
  { name: "Mobile development", level: 88 },
  { name: "Database modeling", level: 85 },
  { name: "RBAC & security", level: 85 },
  { name: "Cloud & DevOps", level: 82 },
  { name: "UI / UX craft", level: 84 },
];

/* ----------------------------------------------------------------
   AI & automation — static
----------------------------------------------------------------- */
export type AiService = {
  icon: IconName;
  title: string;
  desc: string;
  metric: string;
  metricLabel: string;
};

export const AI_SERVICES: AiService[] = [
  {
    icon: "bot",
    title: "Agentic AI (foundations)",
    desc: "Building toward agent workflows that plan and call tools, backed by formal AI agents training.",
    metric: "Cert",
    metricLabel: "AI Agents Fundamentals",
  },
  {
    icon: "database",
    title: "AI training data",
    desc: "Mnyama Collector structures real field disease data into clean datasets ready for model training.",
    metric: "200+",
    metricLabel: "profiles captured",
  },
  {
    icon: "workflow",
    title: "Workflow automation",
    desc: "Automating data sync and operational flows so teams stop doing repetitive manual work.",
    metric: "Real time",
    metricLabel: "health data sync",
  },
  {
    icon: "share",
    title: "REST & API integration",
    desc: "Connecting services with well designed REST APIs, auth, and role based access control.",
    metric: "15+",
    metricLabel: "secured endpoints",
  },
  {
    icon: "box",
    title: "Blockchain logic",
    desc: "Hyperledger Fabric chaincode handling transaction validation on a permissioned network.",
    metric: "Permissioned",
    metricLabel: "Fabric network",
  },
  {
    icon: "layers",
    title: "3D & visualization",
    desc: "Interactive Three.js experiences: QR triggered 3D product views for virtual catalogs.",
    metric: "50+",
    metricLabel: "items visualized",
  },
];

/* ----------------------------------------------------------------
   Testimonials  (content/testimonials.json — editable in /admin)
----------------------------------------------------------------- */
export type Testimonial = {
  initials: string;
  name: string;
  title: string;
  quote: string;
};

export const TESTIMONIALS = testimonialsJson as Testimonial[];

/* ----------------------------------------------------------------
   GitHub activity — static sample data
----------------------------------------------------------------- */
export const GH_STATS = [
  { v: "900+", k: "Contributions" },
  { v: "30+", k: "Repositories" },
  { v: "6", k: "Microservices" },
  { v: "4", k: "Languages" },
];

export const LANGUAGES = [
  { name: "TypeScript", pct: 40, shade: 1 },
  { name: "Dart", pct: 24, shade: 0.55 },
  { name: "Python", pct: 18, shade: 0 },
  { name: "JavaScript", pct: 18, shade: -1 },
];

export const COMMITS = [
  {
    msg: "feat: subscription + notifications for Mnyama Check",
    repo: "mnyama-check",
    time: "2d ago",
  },
  {
    msg: "feat: video-conferencing microservice",
    repo: "smartinno-core",
    time: "1w ago",
  },
  { msg: "fix: OWASP scan result parsing", repo: "security-scan", time: "2w ago" },
];

export function buildContribGrid(): number[][] {
  const weeks: number[][] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let w = 0; w < 44; w++) {
    const days: number[] = [];
    for (let d = 0; d < 7; d++) {
      const r = rnd();
      let n = 0;
      if (r > 0.55) n = 1;
      if (r > 0.72) n = 2;
      if (r > 0.85) n = 3;
      if (r > 0.94) n = 4;
      days.push(n);
    }
    weeks.push(days);
  }
  return weeks;
}

/* ----------------------------------------------------------------
   Blog  (content/posts.json — editable in /admin, incl. article body)
----------------------------------------------------------------- */
export type ArticleSection = { h: string; paras: string[] };
export type Post = {
  id: string;
  cat: string;
  date: string;
  read: string;
  title: string;
  excerpt: string;
  lede: string;
  sections: ArticleSection[];
};

export const POSTS = postsJson as Post[];
export const BLOG_CATS = ["All", "Backend", "Mobile", "AI", "Blockchain"];

/* ----------------------------------------------------------------
   Contact + socials
----------------------------------------------------------------- */
export type ContactLink = {
  icon: IconName;
  label: string;
  value: string;
  href: string;
};

export const CONTACT_LINKS: ContactLink[] = [
  { icon: "mail", label: "email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: "phone", label: "phone", value: PROFILE.phone, href: "tel:+255742147567" },
  { icon: "github", label: "github", value: PROFILE.githubHandle, href: PROFILE.github },
  { icon: "linkedin", label: "linkedin", value: "baraka-nampellah", href: PROFILE.linkedin },
  { icon: "mappin", label: "location", value: PROFILE.location, href: "#" },
];

export const SOCIALS: { icon: IconName; label: string; href: string }[] = [
  { icon: "github", label: "GitHub", href: PROFILE.github },
  { icon: "linkedin", label: "LinkedIn", href: PROFILE.linkedin },
  { icon: "mail", label: "Email", href: `mailto:${PROFILE.email}` },
  { icon: "phone", label: "Phone", href: "tel:+255742147567" },
];

export const PROJECT_TYPES = [
  "Full-stack web app",
  "Mobile app (Flutter / React Native)",
  "Backend / microservices",
  "Automation / AI",
  "Something else",
];
