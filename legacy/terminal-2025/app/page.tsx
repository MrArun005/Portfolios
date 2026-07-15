import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Scene3DMount } from "@/components/Scene3DMount";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { Marquee } from "@/components/Marquee";
import { Capabilities } from "@/components/Capabilities";
import { Approach } from "@/components/Approach";
import { Cursor } from "@/components/Cursor";
import { Quake } from "@/components/Quake";
import { ResumeModalHost } from "@/components/ResumeModalHost";

export default function Home() {
  return (
    <>
      <Cursor />
      <ResumeModalHost />
      <Preloader />
      <SmoothScroll />

      {/* Immersive 3D world — starfield + engine core + terrain behind everything. */}
      <Scene3DMount />

      <Quake>
        <ScrollProgress />
        <Nav />
        <Hero />
        <Marquee />
        <main>
          <About />
          <Capabilities />
          <Experience />
          <Projects />
          <Approach />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </Quake>
    </>
  );
}
