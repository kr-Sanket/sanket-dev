import { Circle, GitFork, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GitHubRepo } from "@/types/github";
import { formatShortDate } from "./github.service";

/**
 * A single repository card. Presentational; matches the site card language
 * (rounded-xl, ring-lift hover). The repo name is the external link.
 */
export function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <Card className="h-full gap-3 p-5 transition-colors hover:ring-foreground/20">
      <h3 className="font-heading text-base font-semibold tracking-tight">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground transition-colors hover:text-primary"
        >
          {repo.name}
        </a>
      </h3>

      {repo.description && (
        <p className="line-clamp-3 text-sm text-pretty text-muted-foreground">
          {repo.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <Circle className="size-2.5 fill-current" aria-hidden />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" aria-hidden />
          {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="size-3.5" aria-hidden />
          {repo.forks}
        </span>
        {repo.updatedAt && (
          <span className="ml-auto">Updated {formatShortDate(repo.updatedAt)}</span>
        )}
      </div>
    </Card>
  );
}
