import { Hero } from "@/sections/Hero";
import { EngineeringDashboard } from "@/sections/EngineeringDashboard";
import { FeaturedProjects } from "@/sections/FeaturedProjects";

export default function Home() {
  return (
    <>
      <Hero />
      <EngineeringDashboard />
      <FeaturedProjects />
    </>
  );
}
