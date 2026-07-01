"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Desktop primary navigation. Active-state architecture is ready: route links
 * (`/foo`) resolve their active state from the pathname. In-page hash links
 * (`#foo`) render normally today and are the future hook point for scrollspy.
 */
export function DesktopNav({
  links,
  className,
}: {
  links: readonly NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("items-center gap-1", className)}>
      {links.map((link) => {
        const isRoute = link.href.startsWith("/");
        const isActive =
          isRoute &&
          (link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              isActive && "text-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
