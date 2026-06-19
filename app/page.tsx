import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { Marquee } from "@/components/Marquee";
import { PullQuote } from "@/components/PullQuote";

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <AnimatedBackground />

      {/* Ambient colored glows — break the flat charcoal with soft amber/teal washes. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[8%] top-[-10%] h-[640px] w-[640px] rounded-full bg-amber/[0.07] blur-[140px]" />
        <div className="absolute left-[-10%] top-[42%] h-[560px] w-[560px] rounded-full bg-teal/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-10%] left-1/3 h-[520px] w-[700px] rounded-full bg-amber/[0.05] blur-[140px]" />
      </div>

      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee />
      <main>
        <About />
        <Experience />
        <PullQuote />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
