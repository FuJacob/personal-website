import type { Metadata, Viewport } from "next";
import {
  Sour_Gummy,
  Lacquer,
  Averia_Serif_Libre,
  Space_Mono,
} from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FontProvider } from "@/components/FontProvider";
import "./globals.css";

const sourGummy = Sour_Gummy({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sour-gummy",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const lacquer = Lacquer({
  weight: ["400"],
  variable: "--font-lacquer",
  subsets: ["latin"],
  display: "swap",
});

const averia = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  variable: "--font-averia",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jacob Fu",
    template: "%s | Jacob Fu",
  },
  description:
    "Jacob Fu is a Computer Science student at University of Waterloo building products that people actually use. Previously at HubSpot and Bridgewell.",
  keywords: [
    "Jacob Fu",
    "Software Engineer",
    "University of Waterloo",
    "HubSpot",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Jacob Fu" }],
  creator: "Jacob Fu",
  applicationName: "Jacob Fu Portfolio",
  category: "technology",
  alternates: {
    canonical: "https://jacobfu.com",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacobfu.com",
    title: "Jacob Fu | Software Engineer",
    description:
      "CS student at UWaterloo. Building products that people actually use.",
    siteName: "Jacob Fu",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jacob Fu | Software Engineer",
    description:
      "CS student at UWaterloo. Building products that people actually use.",
    creator: "@fujacobb",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  metadataBase: new URL("https://jacobfu.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourGummy.variable} ${lacquer.variable} ${averia.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <FontProvider>{children}</FontProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
