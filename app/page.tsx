import { CardContainer } from "@/components/cards";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jacob Fu",
  url: "https://jacobfu.com",
  image: "https://jacobfu.com/og-image.png",
  jobTitle: "Software Engineer",
  email: "mailto:jjacobfu@gmail.com",
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

export default function Home() {
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
      <CardContainer />
    </>
  );
}
