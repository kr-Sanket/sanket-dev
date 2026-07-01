import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ViewModeToggle } from "@/components/layout/ViewModeToggle";
import { siteConfig } from "@/data/site.config";

/**
 * Permanent top navigation shell. Server component; interactivity lives in the
 * client islands (DesktopNav, MobileNav, ThemeToggle, ViewModeToggle).
 * Navigation items are driven from `site.config.ts`.
 */
export function Navbar() {
  const { navLinks, brand } = siteConfig;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${brand} — home`}
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          {brand}
        </Link>

        <DesktopNav links={navLinks} className="hidden md:flex" />

        <div className="flex items-center gap-1">
          <ViewModeToggle />
          <ThemeToggle />
          <MobileNav links={navLinks} className="md:hidden" />
        </div>
      </Container>
    </header>
  );
}
