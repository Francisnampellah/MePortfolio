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
   Toolbox capabilities — outcome-first (no self-ratings)
----------------------------------------------------------------- */
export type CapabilityAction =
  | { kind: "project"; projectNo: string; label?: string }
  | { kind: "blog"; href: string; label?: string };

/** Plain text or an inline link inside an evidence line. */
export type EvidencePart = string | { label: string; href: string };

export type Capability = {
  name: string;
  short: string;
  tagline: string;
  /** Exactly two display lines. */
  evidence: [EvidencePart[], EvidencePart[]];
  tools: string[];
  action: CapabilityAction;
};

export const CAPABILITIES: Capability[] = [
  {
    name: "System Design",
    short: "Design",
    tagline: "Shaping how the whole product fits together",
    evidence: [
      ["I design for scale, reliability, and clarity before the first line of code."],
      ["Every choice is a tradeoff I can explain, not a stack I default to."],
    ],
    tools: ["CAP", "Scalability", "Availability", "Consistency", "Caching", "Tradeoffs"],
    action: { kind: "project", projectNo: "03" },
  },
  {
    name: "APIs & Microservices",
    short: "APIs",
    tagline: "Services designed to grow without rewrites",
    evidence: [
      ["Six services live in production and stay open to change."],
      ["Built so new features do not force a rewrite."],
    ],
    tools: ["NestJS", "Express", "Django REST", "PostgreSQL"],
    action: { kind: "project", projectNo: "06" },
  },
  {
    name: "Identity",
    short: "Identity",
    tagline: "Access that stays clear as the product grows",
    evidence: [
      ["Role based access across APIs so the right people see the right things."],
      ["Patterns I use day to day ", { label: "on the blog", href: "/blog/rbac" }, "."],
    ],
    tools: ["JWT", "RBAC", "OAuth", "Sessions", "Guards"],
    action: { kind: "blog", href: "/blog/rbac" },
  },
  {
    name: "Payment Integration",
    short: "Payments",
    tagline: "Mobile money flows for real Tanzanian transactions",
    evidence: [
      ["Subscription and payment flows built around Tanzanian mobile money."],
      ["Checkout and recurring billing that match how people actually pay."],
    ],
    tools: ["M-Pesa", "Webhooks", "Payment windows"],
    action: { kind: "project", projectNo: "03" },
  },
  {
    name: "Data & Infrastructure",
    short: "Data",
    tagline: "Databases designed well, deployments that ship themselves",
    evidence: [
      ["Relational and non relational stores for apps that need to grow."],
      ["Automated deploy, test, and security checks on every push."],
    ],
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS EC2", "Azure", "Nginx"],
    action: { kind: "project", projectNo: "06" },
  },
  {
    name: "Emerging Tech",
    short: "Emerging",
    tagline: "Exploring what comes next, carefully, in real projects",
    evidence: [
      ["Blockchain ledgers, smart contracts, and 3D web experiences."],
      ["Used when the problem calls for them ", { label: "chaincode notes", href: "/blog/chaincode" }, "."],
    ],
    tools: ["Hyperledger Fabric", "Three.js", "Blockchain"],
    action: { kind: "blog", href: "/blog/chaincode" },
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
