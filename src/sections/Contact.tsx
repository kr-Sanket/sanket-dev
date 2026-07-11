import {
  ArrowUpRight,
  Download,
  ExternalLink,
  FileText,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getContact } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Map content-layer icon names to lucide components (same pattern as Footer).
// Brand icons (github/linkedin) were removed from lucide-react, so they aren't
// mapped and fall back to `ExternalLink` via the `??` below — as does any
// unknown icon name.
const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  "file-text": FileText,
  download: Download,
};

/**
 * Per-link action metadata derived from the URL scheme — generic UI copy, not
 * fabricated content. Drives the button label, its icon, and external-link
 * attributes.
 */
function linkAction(url: string): {
  cta: string;
  Icon: LucideIcon;
  external: boolean;
} {
  if (url.startsWith("mailto:")) return { cta: "Send email", Icon: Mail, external: false };
  if (url.startsWith("http")) return { cta: "Visit", Icon: ArrowUpRight, external: true };
  return { cta: "Download", Icon: Download, external: false }; // local asset, e.g. /resume.pdf
}

/**
 * Contact — the closing section of the homepage. Renders every link from
 * `getContact()` as a card (icon + platform + label + external-link button).
 * Pure server component; reuses `Card` + `buttonVariants` and the Footer's
 * icon-name → lucide mapping with an `ExternalLink` fallback.
 */
export function Contact() {
  const { links } = getContact();

  if (links.length === 0) return null;

  return (
    <section id={SECTION_IDS.contact} className="border-b border-border/60">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Get in touch"
          title="Let's Connect"
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => {
            const PlatformIcon = ICON_MAP[link.icon] ?? ExternalLink;
            const { cta, Icon: ActionIcon, external } = linkAction(link.url);

            return (
              <Card
                key={link.platform}
                className="h-full gap-3 p-5 transition-colors hover:ring-foreground/20"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
                    aria-hidden
                  >
                    <PlatformIcon className="size-4" />
                  </span>
                  <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                    {link.platform}
                  </h3>
                </div>

                {link.label && (
                  <p className="text-sm break-words text-muted-foreground">
                    {link.label}
                  </p>
                )}

                <a
                  href={link.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={`${cta} — ${link.platform}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-auto w-fit"
                  )}
                >
                  {cta}
                  <ActionIcon />
                </a>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
