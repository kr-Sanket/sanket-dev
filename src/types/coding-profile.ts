export interface CodingProfile {
  platform: "leetcode" | "codechef" | "hackerrank";
  username: string;
  profileUrl: string;
  stats: {
    problemsSolved?: number;
    rating?: number;
    badges?: number;
    streak?: number;
    ranking?: string;
    contestRating?: number;
  };
}

export interface CodingProfilesData {
  profiles: CodingProfile[];
}
