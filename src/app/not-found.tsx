import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES, SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Custom 404 — rendered inside the root layout (Navbar/Footer preserved) for
 * unmatched routes and `notFound()` calls (e.g. unknown project slugs via
 * `dynamicParams = false`).
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[60svh] items-center">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <p className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Error 404
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-5 text-pretty text-muted-foreground">
            This route doesn&apos;t resolve to anything — the page may have
            moved, or the URL has a typo.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.home}
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
            >
              <ArrowLeft />
              Back to Homepage
            </Link>
            <Link
              href={`/#${SECTION_IDS.projects}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 px-4"
              )}
            >
              View Projects
              <ArrowRight />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
