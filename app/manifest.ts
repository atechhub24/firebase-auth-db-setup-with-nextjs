import type { MetadataRoute } from "next";
import { marketingSite } from "@/lib/marketing-config";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = marketingSite.url;

  return {
    name: marketingSite.name,
    short_name: marketingSite.name.replace(" ⚡️", ""),
    description: marketingSite.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#667eea",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    categories: ["productivity", "business"],
    lang: "en",
    orientation: "portrait-primary",
    scope: "/",
    id: baseUrl,
  };
}
