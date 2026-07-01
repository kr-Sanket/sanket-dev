import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Centered content wrapper used across every page/section.
 * Caps width at the 1280px (`max-w-7xl`) content container from the design spec
 * and applies responsive horizontal padding. Pass `className` to extend.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
