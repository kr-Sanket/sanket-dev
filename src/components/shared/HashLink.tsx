"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToHash } from "@/lib/scroll";

/**
 * A `next/link` that reliably scrolls to in-page sections. For hash hrefs
 * (`#section`) it intercepts the click and scrolls imperatively (see
 * `scrollToHash`), so repeated clicks always scroll regardless of the current
 * hash or scroll position. Route hrefs (`/projects`) fall through to normal
 * Next navigation untouched. Any caller-provided `onClick` still runs first.
 */
export function HashLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      !event.defaultPrevented &&
      typeof href === "string" &&
      scrollToHash(href)
    ) {
      event.preventDefault();
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
