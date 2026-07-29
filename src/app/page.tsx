import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { GithubActivity } from "@/components/GithubActivity";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ChatWidget } from "@/components/ChatWidget";
import { SlideHud } from "@/components/SlideHud";
import { TabBar } from "@/components/TabBar";
import { CONTACT_SLIDE_ROOT } from "@/components/Section";
import { FullPageScrollProvider, FullPageStage } from "@/lib/fullPageScroll";
import { SiteLoader } from "@/components/SiteLoader";
import { SiteReadyProvider } from "@/lib/siteReady";

/*
 * Homepage-only faces, standing in for Lusion's pairing: Satoshi for Aeonik
 * (licensed, can't be shipped), IBM Plex Mono exactly as they use it.
 *
 * Declared here rather than in layout.tsx so Next only emits the preload hints
 * on `/` — the blog and doc sites never download fonts they don't render.
 *
 * `display: block` rather than swap: this page is always behind the gated
 * SiteLoader, so there is no user-visible blank period, and it avoids the
 * loader's 176px counter reflowing mid-load when the real face arrives.
 */
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-satoshi",
  display: "block",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "block",
});

const SECTION_IDS = [
  "home",
  "about",
  "tech",
  "projects",
  "experience",
  "testimonials",
  "github",
  "blog",
  "contact",
];

export default function Home() {
  return (
    // `contents` so this carries the font variables without generating a box —
    // the full-page scroll layout and every fixed child are untouched.
    <div
      className={`contents type-homepage ${satoshi.variable} ${plexMono.variable}`}
    >
      <SiteReadyProvider>
        <SiteLoader />
        <FullPageScrollProvider sectionIds={SECTION_IDS}>
          <ScrollProgress />
          <Nav />
          <FullPageStage>
            <main className="contents">
              <Hero />
              <About />
              <TechStack />
              <Projects />
              <Experience />
              <Testimonials />
              <GithubActivity />
              <Blog />
              <div className={CONTACT_SLIDE_ROOT}>
                <Contact />
                <Footer />
              </div>
            </main>
          </FullPageStage>
          <SlideHud />
          <TabBar />
          <BackToTop />
          <ChatWidget />
        </FullPageScrollProvider>
      </SiteReadyProvider>
    </div>
  );
}
