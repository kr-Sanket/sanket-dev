"use client";

import { usePathname } from "next/navigation";
import { HashLink } from "@/components/shared/HashLink";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Desktop primary navigation. Active-state architecture is ready: route links
 * (`/foo`) resolve their active state from the pathname. In-page hash links
 * (`#foo`) use `HashLink`, which scrolls imperatively so repeated clicks always
 * scroll (see `scrollToHash`); they remain the future hook point for scrollspy.
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
          <HashLink
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              isActive && "text-foreground"
            )}
          >
            {link.label}
          </HashLink>
        );
      })}
    </nav>
  );
}
