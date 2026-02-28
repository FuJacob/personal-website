export type CardType = "about" | "experience" | "project" | "chat";
export type CardSection = "about" | "experiences" | "projects" | "chat";

// Media for card details - can be image or YouTube video
export interface CardMedia {
  type: "image" | "youtube";
  src: string; // image path or YouTube video ID
  caption?: string;
}

// Color scheme for cards - light version for light mode, dark for dark mode
export interface CardColors {
  light: string; // Background in light mode (lighter shade, works with dark text)
  dark: string; // Background in dark mode (darker shade, works with white text)
}

export interface BaseCard {
  id: string;
  type: CardType;
  section: CardSection;
  colors: CardColors;
}

export interface AboutCard extends BaseCard {
  type: "about";
  section: "about";
  name: string;
  avatar: string;
  summary?: string;
  education?: {
    school: string;
    program: string;
    logo: string;
  };
  status?: string;
  socials?: {
    linkedin: string;
    github: string;
    twitter: string;
    email: string;
  };
  media?: CardMedia;
}

export interface ExperienceCard extends BaseCard {
  type: "experience";
  section: "experiences";
  company: string;
  logo: string;
  role: string;
  period: string;
  location?: string;
  summary?: string;
  description: string;
  bullets: string[];
  technologies?: string[];
  media?: CardMedia;
}

export interface ProjectCard extends BaseCard {
  type: "project";
  section: "projects";
  title: string;
  tagline: string;
  image?: string;
  summary?: string;
  description: string;
  award?: string;
  technologies: string[];
  bullets: string[];
  githubUrl?: string;
  liveUrl?: string;
  devpostUrl?: string;
  media?: CardMedia;
}

export interface ChatCard extends BaseCard {
  type: "chat";
  section: "chat";
  title: string;
  subtitle: string;
  summary?: string;
}

export type CardItem = AboutCard | ExperienceCard | ProjectCard | ChatCard;

export interface CardSectionGroup {
  id: CardSection;
  label: string;
  cards: CardItem[];
}

// View switcher
export type ViewId = "home" | "writings" | "goals";

// Writings
export interface Writing {
  id: number;
  title: string;
  subtitle: string;
  created_at: string;
  content: string;
}

// Goals / Resolutions
export interface Goal {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}
