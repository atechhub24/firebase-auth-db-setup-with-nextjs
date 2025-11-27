export const marketingSite = {
  name: "Firebase Auth + Realtime DB Starter ⚡️",
  title: "Firebase Auth + Realtime DB Starter ⚡️",
  description:
    "Public marketing pages showcasing auth updates, blog posts, & resources from atechhub.",
  tagline:
    "Next.js + Firebase starter for role-aware dashboards, attendance tooling, & blog powered by shadcn/ui.",
  url: "https://atechhub247.com",
  domain: "atechhub247.com",
  contactEmail: "info@atechhub247.com",
  contactPhone: "+1 (555) 247-0000",
  social: {
    twitter: "https://twitter.com/atechhub247",
    github: "https://github.com/atechhub24",
    linkedin: "https://www.linkedin.com/company/atechhub247",
    youtube: "https://www.youtube.com/@atechhub247",
    facebook: "https://www.facebook.com/atechhub247",
  },
  stack: [
    "Next.js App Router + React 19 + Turbopack",
    "Firebase Auth + Realtime Database (@atechhub/firebase)",
    "Zustand store + shadcn/ui (Radix) + Tailwind v4",
    "UploadThing, Leaflet, Recharts, Tiptap",
    "Biome for lint + format",
  ],
  highlights: [
    "Firebase-authenticated onboarding with reusable AuthForm",
    "Role-aware shell (admin/staff) with command palette support",
    "Attendance analytics, maps, and punch controls ready to ship",
    "Blog CMS spanning public marketing and secure admin CRUD",
    "Settings area for profile/password plus shared component kit",
  ],
  quickLinks: [
    {
      label: "Read the latest blog posts",
      href: "/blogs",
    },
    {
      label: "Setup Firebase project",
      href: "https://console.firebase.google.com/",
    },
    {
      label: "Convert Firebase config to env vars",
      href: "https://firebase.atechhub247.com/",
    },
  ],
  megaMenu: [
    {
      label: "Resources",
      href: "#resources",
      items: [
        {
          label: "Firebase Console",
          href: "https://console.firebase.google.com",
          icon: "Database",
          description:
            "Manage your Firebase projects, authentication, and database",
          featured: true,
        },
        {
          label: "Config Generator",
          href: "https://firebase.atechhub247.com",
          icon: "Settings",
          description: "Convert Firebase config to environment variables",
          featured: true,
        },
        {
          label: "Open Graph Preview",
          href: "https://opengraph.dev",
          icon: "Image",
          description:
            "Preview and generate Open Graph meta tags for social sharing",
          featured: false,
        },
        {
          label: "Favicon Generator",
          href: "https://favicon.io/favicon-converter",
          icon: "FileCode",
          description: "Generate favicons from images in multiple formats",
          featured: false,
        },
      ],
    },
  ],
} as const;

export type MarketingSite = typeof marketingSite;

