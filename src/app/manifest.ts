import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arun Mallikarjuna — Full-Stack & AI Platform Engineer",
    short_name: "Arun Mallikarjuna",
    description:
      "Portfolio of Arun Mallikarjuna, a Full-Stack & AI Platform Engineer building multi-tenant platforms, rule engines, and custom AI agents.",
    start_url: "/",
    display: "standalone",
    background_color: "#02010a",
    theme_color: "#02010a",
    lang: "en",
    categories: ["portfolio", "technology", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
