import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import {
  PROFILE,
  SKILLS,
  PROJECTS,
  SITE_URL,
} from "@/lib/data";
import SeoContent from "@/components/dom/SeoContent";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const TITLE =
  "Arun Mallikarjuna — Full-Stack & AI Platform Engineer | Node.js, React, AI Agents";
const DESCRIPTION =
  "Arun Mallikarjuna is a Full-Stack & AI Platform Engineer in Bengaluru, India. I build the engines and AI agents other people run — multi-tenant platforms, payroll engines, rule engines, and custom agent runtimes with Node.js, NestJS, Next.js, TypeScript, and the Claude & Gemini APIs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Arun Mallikarjuna",
  },
  description: DESCRIPTION,
  applicationName: "Arun Mallikarjuna Portfolio",
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  category: "technology",
  keywords: [
    "Arun Mallikarjuna",
    "Arun Mallikarjuna portfolio",
    "Full-Stack Engineer",
    "AI Platform Engineer",
    "AI Agents",
    "LLM Integration",
    "Node.js",
    "NestJS",
    "Next.js",
    "TypeScript",
    "React",
    "Microservices",
    "Multi-Tenant SaaS",
    "Rule Engine",
    "Payroll Engine",
    "Claude API",
    "Gemini API",
    "Bengaluru developer",
    "Tecnotree",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: PROFILE.firstName,
    lastName: "Mallikarjuna",
    username: "arunmallikarjun",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Arun Mallikarjuna Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02010a",
  colorScheme: "dark",
};

/**
 * Rich, linked structured data (schema.org @graph). Answer engines and AI
 * crawlers use this to understand who Arun is, what he does, and what
 * he has built — the backbone of AEO / AI-SEO. Built from the same content
 * data that drives the site so it never drifts out of sync.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      givenName: PROFILE.firstName,
      familyName: "Mallikarjuna",
      jobTitle: PROFILE.role,
      description: PROFILE.bio,
      url: `${SITE_URL}/`,
      email: `mailto:${PROFILE.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      worksFor: {
        "@type": "Organization",
        name: "Tecnotree Convergence",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: PROFILE.role,
        occupationLocation: {
          "@type": "City",
          name: "Bengaluru, India",
        },
        skills: SKILLS.map((s) => s.items).join(" · "),
      },
      knowsAbout: [
        "Full-Stack Development",
        "AI Agents",
        "LLM Integration",
        "System Prompt Engineering",
        "Node.js",
        "NestJS",
        "Next.js",
        "TypeScript",
        "React",
        "Microservices",
        "Distributed Systems",
        "Multi-Tenant Architecture",
        "Rule Engines",
        "Payroll Engines",
        "Prisma",
        "Redis",
        "Reliability & Scaling",
      ],
      sameAs: [
        PROFILE.socials.github,
        PROFILE.socials.linkedin,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Arun Mallikarjuna Portfolio",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#projects`,
      name: "Projects by Arun Mallikarjuna",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.title,
          headline: p.tagline,
          description: p.description,
          keywords: p.tags.join(", "),
          creator: { "@id": `${SITE_URL}/#person` },
          ...(p.link ? { url: p.link } : {}),
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        {children}
        {/* Text alternative to the WebGL experience — full, semantic content
            for screen readers and for AI/search crawlers that don't run JS. */}
        <SeoContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
