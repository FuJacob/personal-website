import { CardContainer } from "@/components/cards";
import { getDb } from "@/lib/db";
import { Writing, Goal } from "@/lib/types";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jacob Fu",
  url: "https://jacobfu.com",
  image: "https://jacobfu.com/og-image.png",
  jobTitle: "Software Engineer",
  email: "mailto:hi@jacobfu.com",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Waterloo",
  },
  sameAs: [
    "https://github.com/fujacob",
    "https://www.linkedin.com/in/fujacob/",
    "https://x.com/fujacobb",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jacob Fu",
  url: "https://jacobfu.com",
  inLanguage: "en-US",
};

export default async function Home() {
  let writings: Writing[] = [];
  let goals: Goal[] = [];
  try {
    const sql = getDb();
    [writings, goals] = await Promise.all([
      sql`
        SELECT id, title, subtitle, created_at, content
        FROM writings
        ORDER BY created_at DESC
      ` as unknown as Promise<Writing[]>,
      sql`
        SELECT id, title, description, completed, created_at
        FROM goals
        ORDER BY created_at ASC
      ` as unknown as Promise<Goal[]>,
    ]);
  } catch {
    // Fall back to empty lists if DB is unavailable
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <CardContainer initialWritings={writings} initialGoals={goals} />
    </>
  );
}
