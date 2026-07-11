import type { ReactNode } from "react";
import {
  Code2,
  ExternalLink,
  FolderGit2,
  GitCommitHorizontal,
  Star,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site.config";
import { SECTION_IDS } from "@/lib/constants";
import {
  getGitHubData,
  isGitHubDataEmpty,
  totalStars,
} from "./github.service";
import { ContributionHeatmap } from "./ContributionHeatmap";
import { LanguageBar } from "./LanguageBar";
import { RepoCard } from "./RepoCard";
import { ActivityFeed } from "./ActivityFeed";

const MAX_REPO_CARDS = 6;

/**
 * GitHub Hub — a live, ISR-cached section (revalidated hourly by the service).
 * Async server component. Profile summary reuses the shared `MetricCard`; every
 * sub-block hides when its data is unavailable, and a full API failure shows a
 * graceful placeholder (never a crash, never fake numbers).
 */
export async function GitHubHub() {
  const data = await getGitHubData();
  const profileUrl = siteConfig.social.github;
  const username = siteConfig.githubUsername;

  const { repos, languages, events, contributions } = data;
  const languageCount = Object.keys(languages).length;

  return (
    <section id={SECTION_IDS.github} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Open source"
          title="GitHub Activity"
          description={`Live from @${username} — repositories, languages, and recent activity.`}
          className="mb-8"
        />

        {isGitHubDataEmpty(data) ? (
          <UnavailablePlaceholder profileUrl={profileUrl} />
        ) : (
          <div className="flex flex-col gap-10">
            {/* Profile summary — derived stats (reuses MetricCard) */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricCard icon={FolderGit2} value={repos.length} label="Repositories" />
              <MetricCard icon={Star} value={totalStars(repos)} label="Total Stars" />
              <MetricCard icon={Code2} value={languageCount} label="Languages" />
              {contributions && (
                <MetricCard
                  icon={GitCommitHorizontal}
                  value={contributions.totalContributions}
                  label="Contributions"
                />
              )}
            </div>

            {contributions && (
              <Block title="Contributions">
                <ContributionHeatmap calendar={contributions} />
              </Block>
            )}

            {languageCount > 0 && (
              <Block title="Languages">
                <LanguageBar languages={languages} />
              </Block>
            )}

            {repos.length > 0 && (
              <Block title="Top Repositories">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {repos.slice(0, MAX_REPO_CARDS).map((repo) => (
                    <RepoCard key={repo.name} repo={repo} />
                  ))}
                </div>
              </Block>
            )}

            {events.length > 0 && (
              <Block title="Recent Activity">
                <Card className="p-5">
                  <ActivityFeed events={events} />
                </Card>
              </Block>
            )}

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-fit"
              )}
            >
              View full profile
              <ExternalLink />
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}

/** Sub-section wrapper with a consistent quiet `<h3>` label. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function UnavailablePlaceholder({ profileUrl }: { profileUrl: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <FolderGit2 className="size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">
        GitHub activity is temporarily unavailable
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Live data couldn&apos;t be loaded right now. Visit the profile directly
        for the latest.
      </p>
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-1")}
      >
        View GitHub profile
        <ExternalLink />
      </a>
    </Card>
  );
}
