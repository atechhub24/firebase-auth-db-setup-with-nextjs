export const marketingSite = {
  name: "Firebase Auth + Realtime DB Starter (Next.js 15) ⚡️",
  title: "Firebase Auth + Realtime DB Starter (Next.js 15) ⚡️",
  description:
    "Public marketing pages showcasing product updates, blog posts, and resources from atechhub.",
  tagline:
    "Next.js 15.5 + Firebase starter for role-aware dashboards, attendance tooling, and blog CMS—powered by shadcn/ui and Turbopack.",
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
} as const;

export type MarketingSite = typeof marketingSite;
