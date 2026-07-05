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
  );
}
