export type WorkStint = {
  /** one-liner about the team / what you worked on */
  team: string;
  year: string;
};

export type WorkEntry = {
  /** logo key — matches a filename in src/assets/companies (no extension) */
  logo: string;
  company: string;
  location: string;
  /** one row per stint at this company, newest first */
  stints: WorkStint[];
  href?: string;
};

export const work: WorkEntry[] = [
  {
    logo: "ramp",
    company: "Ramp",
    location: "New York, NY",
    stints: [{ team: "Incoming Backend Engineering", year: "2026" }],
    href: "https://ramp.com",
  },
  {
    logo: "uber",
    company: "Uber",
    location: "Sunnyvale, CA",
    stints: [{ team: "Safety Media Platform, Applied AI", year: "2026" }],
    href: "https://uber.com",
  },
  {
    logo: "hubspot",
    company: "HubSpot",
    location: "Boston, MA",
    stints: [
      { team: "AI Content Editor", year: "2026" },
      { team: "Sales Workspace", year: "2025" },
    ],
    href: "https://hubspot.com",
  },
];
