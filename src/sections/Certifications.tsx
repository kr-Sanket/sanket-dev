import { existsSync } from "fs";
import path from "path";
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCertifications } from "@/lib/content";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Does a `/public`-relative image path actually exist on disk? Runs at build
 * time (SSG) so we never render a broken image for a not-yet-added asset — the
 * same guard used by the project-detail gallery.
 */
function imageExists(src: string): boolean {
  return Boolean(src) && existsSync(path.join(process.cwd(), "public", src));
}

/**
 * Certifications — cards driven entirely by `getCertifications()`. Pure server
 * component (cert content isn't dual-mode). Visually matches Leadership/Skills:
 * same `Card` grid, `SectionHeader` `h2`, spacing, radius, and ring-lift hover.
 *
 * Graceful handling of the known-sparse data: a missing image file renders a
 * tasteful placeholder panel (never a broken image); an empty `date` hides the
 * badge; an empty `url` hides the credential button.
 */
export function Certifications() {
  const { certifications } = getCertifications();

  if (certifications.length === 0) return null;

  return (
    <section
      id={SECTION_IDS.certifications}
      className="border-b border-border/60"
    >
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Credentials"
          title="Certifications"
          className="mb-8"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => {
            const hasImage = imageExists(cert.image);

            return (
              <Card
                key={`${cert.title}-${cert.issuer}`}
                className="h-full gap-0 overflow-hidden p-0 transition-colors hover:ring-foreground/20"
              >
                {/* Visual: real image when present, tasteful placeholder otherwise */}
                {hasImage ? (
                  <div className="relative aspect-video">
                    <Image
                      src={cert.image}
                      alt={`${cert.title} — ${cert.issuer} certificate`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center border-b border-border/60 bg-muted/50">
                    <Award className="size-8 text-muted-foreground" aria-hidden />
                  </div>
                )}

                <div className="flex flex-col gap-3 p-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                      {cert.title}
                    </h3>
                    {cert.issuer && (
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                    )}
                  </div>

                  {cert.date && (
                    <Badge
                      variant="outline"
                      className="w-fit font-mono text-muted-foreground"
                    >
                      {cert.date}
                    </Badge>
                  )}

                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "mt-1 w-fit"
                      )}
                    >
                      View credential
                      <ExternalLink />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
