export type Project = {
  /** logo key — matches a filename in src/assets/projects (no extension) */
  logo: string;
  name: string;
  description: string;
  /** one-liner detail shown below the project */
  detail: string;
  href?: string;
};

export const projects: Project[] = [
  {
    logo: "tabby",
    name: "Cotabby",
    description: "AI autocomplete for macOS",
    detail: "6k+ downloads, 700+ stars, YC S26 interview",
    href: "https://cotabby.app",
  },
  {
    logo: "riley",
    name: "Riley",
    description: "AI family assistant on iMessage",
    detail: "1st Place Browser Use Prize, YC 2026 Hackathon",
    href: "https://rileyapp.vercel.app/",
  },
  {
    logo: "rbveal",
    name: "RBveal",
    description: "AI bank phishing simulator",
    detail: "1st Place RBC Prize, UofT 2025 Hackathon",
    href: "https://github.com/FuJacob/rbveal",
  },
  {
    logo: "metroapocalypse",
    name: "Metro Apocalypse",
    description: "Multiplayer zombie tag .IO game",
    detail: "248k+ users, 4.2M+ plays, $2.5k+ revenue",
    href: "https://www.patreon.com/amuletio",
  },
];
