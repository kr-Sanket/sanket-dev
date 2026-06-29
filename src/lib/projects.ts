import { promises as fs } from "fs";
import path from "path";
import type { Project } from "@/types/project";

const PROJECTS_DIR = path.join(process.cwd(), "src", "data", "projects");

export async function loadProject(slug: string): Promise<Project | null> {
  try {
    const filePath = path.join(PROJECTS_DIR, `${slug}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Project;
  } catch {
    return null;
  }
}

export async function loadAllProjects(): Promise<Project[]> {
  try {
    const files = await fs.readdir(PROJECTS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const projects = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(PROJECTS_DIR, file), "utf-8");
        return JSON.parse(content) as Project;
      })
    );

    return projects.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function loadFeaturedProjects(): Promise<Project[]> {
  const all = await loadAllProjects();
  return all.filter((p) => p.featured);
}

export async function loadProjectSlugs(): Promise<string[]> {
  const all = await loadAllProjects();
  return all.filter((p) => p.status !== "planned").map((p) => p.slug);
}
