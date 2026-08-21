// ─── Coding Profiles ───
// Static, owner-configured profile links (ADR-015). The earlier stats-fetching
// shapes (CodingProfile/CodingProfilesData, Milestone 5.2) were removed with
// the service that consumed them — profiles are now pure config links with no
// fetched or fabricated statistics.

export interface CodingProfileLink {
  /** Display name, e.g. "LeetCode". */
  platform: string;
  username: string;
  /** Full profile URL (opens in a new tab). */
  url: string;
  /** One-line description of what the platform is used for. */
  description: string;
  /** Icon key resolved by the feature's platform-icon map. */
  icon: string;
  /** Official brand color — used ONLY on hover; monochrome by default. */
  brandColor: string;
}
