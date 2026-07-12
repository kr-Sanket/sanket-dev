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
import { CodingProfiles } from "@/features/coding-profiles/CodingProfiles";

export default function Home() {
  return (
    <>
      <Hero />
      <EngineeringDashboard />
      <FeaturedProjects />
      <GitHubHub />
      <Skills />
      <EngineeringTimeline />
      <About />
      <Leadership />
      <Certifications />
      <Contact />
      {/* Coding Profiles is parked after the defined flow; the next milestone
          moves it into place directly after GitHub Hub. */}
      <CodingProfiles />
    </>
  );
}
