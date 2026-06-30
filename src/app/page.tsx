import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Skills } from "@/components/Skills";
import { AiShowcase } from "@/components/AiShowcase";
import { Testimonials } from "@/components/Testimonials";
import { GithubActivity } from "@/components/GithubActivity";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <Experience />
        <Certifications />
        <Skills />
        <AiShowcase />
        <Testimonials />
        <GithubActivity />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ChatWidget />
    </>
  );
}
