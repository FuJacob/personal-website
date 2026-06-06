export type EducationEntry = {
  /** logo key — matches a filename in src/assets/companies (no extension) */
  logo: string;
  school: string;
  /** shown in the sub-bullet */
  program: string;
  location: string;
  href?: string;
};

export const education: EducationEntry[] = [
  {
    logo: "waterloo",
    school: "University of Waterloo",
    program: "Bachelor of Computer Science",
    location: "Waterloo, ON",
    href: "https://uwaterloo.ca",
  },
];
