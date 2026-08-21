import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site.config";

/**
 * Site-wide Open Graph image, generated at build time from `siteConfig` —
 * no static image asset, no hardcoded copy. Mirrors the portfolio's design
 * language: flat near-black background, strong typographic hierarchy,
 * mono-style uppercase labels, hairline rules. (Colors are hex equivalents
 * of the dark-theme tokens — `ImageResponse` doesn't resolve CSS variables.)
 */

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  muted: "#a1a1a1",
  faint: "#525252",
  border: "#262626",
  accent: "#10b981",
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: COLORS.background,
          color: COLORS.foreground,
          padding: 72,
        }}
      >
        {/* Top: brand + availability (the site's status-panel idiom) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            {siteConfig.brand}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: COLORS.accent,
                display: "flex",
              }}
            />
            <div
              style={{
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.muted,
              }}
            >
              {siteConfig.status.availability}
            </div>
          </div>
        </div>

        {/* Center: role → name → tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: COLORS.muted }}>
            {siteConfig.role}
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 600,
              letterSpacing: -3,
              marginTop: 10,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              color: COLORS.muted,
              marginTop: 22,
              maxWidth: 940,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        {/* Bottom: focus areas + domain over a hairline rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 30,
          }}
        >
          <div style={{ fontSize: 24, color: COLORS.muted }}>
            {siteConfig.focusAreas.join("  ·  ")}
          </div>
          <div style={{ fontSize: 24, color: COLORS.faint }}>
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size
  );
}
