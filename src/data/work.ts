export type WorkEntry = {
  /** logo key — matches a filename in src/assets/companies (no extension) */
  logo: string;
  company: string;
  role: string;
  location: string;
  year: string;
  /** one-liner about the team / what you worked on */
  team: string;
  href?: string;
};

export const work: WorkEntry[] = [
  {
    logo: "ramp",
    company: "Ramp",
    role: "Software Engineer",
    location: "New York, NY",
    year: "2026",
    team: "Incoming Backend Engineering",
    href: "https://ramp.com",
  },
  {
    logo: "uber",
    company: "Uber",
    role: "Software Engineer",
    location: "Sunnyvale, CA",
    year: "2026",
    team: "Safety Media Platform, Applied AI",
    href: "https://uber.com",
  },
  {
    logo: "hubspot",
    company: "HubSpot",
    role: "Software Engineer",
    location: "Boston, MA",
    year: "2026",
    team: "AI Content Editor",
    href: "https://hubspot.com",
  },
  {
    logo: "hubspot",
    company: "HubSpot",
    role: "Software Engineer",
    location: "Boston, MA",
    year: "2025",
    team: "Sales Workspace",
    href: "https://hubspot.com",
  },
];
