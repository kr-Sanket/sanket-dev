import Link from "next/link";
import {
  Download,
  ExternalLink,
  FileText,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { getContact } from "@/lib/content";
import { siteConfig } from "@/data/site.config";

// Map content-layer icon names to available lucide icons. Brand icons
// (github/linkedin) were removed from lucide-react, so those fall back to a
// generic external-link glyph rather than a misleading icon.
const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  "file-text": FileText,
  download: Download,
};

function isExternal(url: string) {
  return url.startsWith("http");
}

/**
 * Permanent site footer. Consumes contact links from the content layer and
 * site metadata from `site.config.ts`.
 */
export function Footer() {
  const { links } = getContact();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-tight text-foreground"
          >
            {siteConfig.brand}
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            {siteConfig.tagline}
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-3"
        >
          {links.map((link) => {
            const Icon = ICON_MAP[link.icon] ?? ExternalLink;
            const external = isExternal(link.url);

            return (
              <a
                key={link.platform}
                href={link.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </a>
            );
          })}
        </nav>
      </Container>

      <div className="border-t border-border/60">
        <Container className="flex flex-col gap-1 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.role}</p>
        </Container>
      </div>
    </footer>
  );
}
