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
  weight: ["400", "500", "700"],
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
  preload: false,
});

const averia = Averia_Serif_Libre({
  weight: ["400", "700"],
  variable: "--font-averia",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jacobfu.com"),
  title: {
    default: "Jacob Fu",
    template: "%s | Jacob Fu",
  },
  description:
    "CS student at UWaterloo. Previously engineering at HubSpot and Bridgewell.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jacobfu.com",
    title: "Jacob Fu",
    description: "CS student at UWaterloo. Previously engineering at HubSpot.",
    siteName: "Jacob Fu",
    images: ["/me.png"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fujacobb",
    // Next.js automatically inherits title/description from openGraph
    // so you don't need to duplicate them here.
  },
  // Removed explicit robots config since Next.js defaults to index/follow anyway
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
