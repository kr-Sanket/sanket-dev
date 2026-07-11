import { Hero } from "@/sections/Hero";
import { EngineeringDashboard } from "@/sections/EngineeringDashboard";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import { Skills } from "@/sections/Skills";
import { EngineeringTimeline } from "@/sections/EngineeringTimeline";
import { About } from "@/sections/About";
import { Leadership } from "@/sections/Leadership";
import { Certifications } from "@/sections/Certifications";
import { Contact } from "@/sections/Contact";
import { GitHubHub } from "@/features/github/GitHubHub";

export default function Home() {
  return (
    <>
      <Hero />
      <EngineeringDashboard />
      <FeaturedProjects />
      <Skills />
      <EngineeringTimeline />
      <About />
      <Leadership />
      <Certifications />
      <Contact />
      <GitHubHub />
    </>
  );
}
