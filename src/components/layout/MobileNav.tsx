"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/data/site.config";
import { cn } from "@/lib/utils";
import { scrollToHash } from "@/lib/scroll";
import type { NavItem } from "@/components/layout/DesktopNav";

/**
 * Mobile navigation drawer (Base UI Sheet). The Sheet is controlled so that
 * in-page hash links close the drawer first and scroll only once it has
 * finished closing — Base UI releases its scroll lock by then, so the smooth
 * scroll isn't blocked. Scrolling imperatively (see `scrollToHash`) also means
 * repeated taps always scroll, even when the hash already matches. Route links
 * fall through to normal Next navigation.
 */
export function MobileNav({
  links,
  className,
}: {
  links: readonly NavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  function handleItemClick(href: string) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        event.preventDefault();
        setPendingHash(href);
      }
      setOpen(false);
    };
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen && pendingHash) {
          scrollToHash(pendingHash);
          setPendingHash(null);
        }
      }}
    >
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", className)}
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-mono">{siteConfig.brand}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-2 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleItemClick(link.href)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
