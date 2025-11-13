# Firebase Auth + Realtime DB Starter (Next.js 15) ⚡️

Next.js 15.5 + Firebase starter for role-aware dashboards, attendance tooling, and blog CMS—powered by shadcn/ui and Turbopack.

## 🧰 Stack

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" title="Next.js App Router" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React 19" title="React 19" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" title="TypeScript" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" title="JavaScript (Turbopack runtime)" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" title="Tailwind CSS v4" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" alt="Firebase" title="Firebase Auth + Realtime DB" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" title="App Router HTML streaming" height="48" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS3" title="Tailwind preflight + custom styles" height="48" />
</p>

- Next.js App Router + React 19 + Turbopack
- Firebase Auth + Realtime Database (`@atechhub/firebase`)
- Zustand store + shadcn/ui (Radix) + Tailwind v4
- UploadThing, Leaflet, Recharts, Tiptap
- Biome for lint + format

## ✨ Highlights

- 🔐 Firebase auth with reusable `<AuthForm />`
- 🧭 Role-aware shell (`admin`, `staff`) + command palette
- 🕒 Attendance analytics, maps, punch controls
- 📰 Blog CMS (public marketing + admin CRUD)
- 🛠 Settings for profile/password + shared UI kit
- 🧱 Service + types layers ready for expansion

## 🗂 Project Structure

```text
app/
  (auth)/           # Public auth routes & shared auth form
  (marketing)/      # Public marketing pages (blogs, slug detail)
  [role]/           # Role-guarded dashboard shell (admin/staff)
    attendance/     # Attendance analytics + calendar + maps
    blogs/          # Admin blog CRUD (list/create/edit)
    dashboard/      # Role landing page
    settings/       # Profile & password settings
    staffs/         # Staff directory + CRUD surfaces
  api/uploadthing/  # UploadThing handlers
components/
  core/             # Command palette, breadcrumb, profile dropdown
  layout/           # Sidebar + header wrappers
  providers/        # Firebase + theme providers
  ui/               # shadcn/ui exports (accordion, dialog, etc.)
hooks/              # Zustand store, auth guard, menu items, mobile detection
lib/
  env.ts            # Type-safe env validation + Firebase config
  services/         # Attendance/blog/staff service helpers
  types/            # Shared TypeScript types
  utils/            # Breadcrumb, date, motion, upload helpers
public/             # Static assets (icons, illustrations)
```

## 🚀 Quick Start

```bash
bun install
bun run dev         # next dev --turbopack on http://localhost:3000
```

Need to target a specific role? Navigate to `/admin/...` or `/staff/...` — layouts and menu items adapt based on the stored user role.

## 🌍 Share Your Local Build

Use an SSH reverse tunnel to expose the dev server for external validators:

```bash
ssh srv.us -R 1:localhost:3000
```

That command returns a publicly reachable HTTPS URL (for example, `https://<random>.srv.us`) pointing to your local port `3000`. Keep the tunnel running while you:

- Validate Open Graph/Twitter cards from a real internet origin.
- Test webhook callbacks or integrations that need a public endpoint.
- Share in-progress work with teammates without deploying.

## 🔑 Environment Variables

Create `.env.local` at the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://xxx.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxx:web:xxx
NEXT_PUBLIC_FIREBASE_AUTH_URL=https://<cloud-function-host>/auth
UPLOADTHING_TOKEN=optional_uploadthing_token
```

`lib/env.ts` validates this schema at runtime; missing keys throw a descriptive error during boot so you catch misconfiguration early.

## 🛠 Firebase Setup Helper

1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a Web app inside your project. Copy the generated `firebaseConfig` object.
2. Open the companion tool at [firebase.atechhub247.com](https://firebase.atechhub247.com/) and paste the config into the **Firebase Config → .env Converter**. Select the **Next.js** output, then copy the generated `.env.local` snippet.
3. Paste those values into your local `.env.local` file (matching the keys listed above) and restart the dev server so the new env vars load.

This workflow keeps secrets consistent while avoiding typos in your environment files. The converter also exposes a Vite format if you need to reuse the same Firebase project elsewhere.

## Firebase Authentication Flow

- `components/providers/firebase-provider.tsx` initializes Firebase (once) and `configureAuth` from `@atechhub/firebase`.
- Auth state changes subscribe to the Realtime Database (`users/{uid}`) and hydrate `useAppStore`.
- `useAuthGuard` redirects authenticated users away from `/signin`.
- Role-based menu items come from `hooks/use-menu-items.ts`, matching `UserRole` types at `lib/types/user.type.ts`.

## Attendance & Staff Modules

- `app/[role]/attendance` bundles analytics, map, calendar, and punch widgets, reusing service helpers from `lib/services/attendance.service.ts`.
- Staff management surfaces modals/dialogs (`components/ui`) for CRUD workflows, backed by `lib/services/staff.service.ts`.
- Charts map to Recharts components via `components/ui/chart.tsx`.

## Blog & Marketing Surface

- Public marketing index under `app/(marketing)/blogs/page.tsx` with filters (`author-combobox`, `tags-multi-select`).
- Admin CRUD pages reuse shared forms (`blog-form.tsx`) and UploadThing integration for media.
- Tiptap rich text editor (`components/ui/rich-text-editor.tsx`) powers content editing/rendering.

## 🖼 Meta & Asset Validation

- **Open Graph preview**: capture the tunnel URL from above and drop it into [opengraph.dev](https://opengraph.dev/). The tool fetches your page as social bots do, letting you verify titles, descriptions, and OG images quickly.
- **Favicon generation**: export high-res artwork (SVG or PNG) and feed it to [favicon.io/favicon-converter](https://favicon.io/favicon-converter/). It outputs favicon.ico plus platform-specific PNGs you can place under `public/`.

## 🧪 Scripts & Tooling

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `bun run dev`    | Start Next.js with Turbopack |
| `bun run build`  | Production build (Turbopack) |
| `bun run start`  | Serve production build       |
| `bun run lint`   | Run Biome checks             |
| `bun run format` | Format with Biome            |

BIome doubles as linter and formatter; keep CI happy by running `bun run format && bun run lint` before pushing.

## 🧩 Customization Notes

- Tailwind CSS v4 config lives in `postcss.config.mjs`; utility classes lean on semantic slots rather than custom theme tokens.
- Command palette + sidebar structure lives in `components/layout` and `components/core` — adjust navigation there.
- UploadThing routes expect a token; disable by omitting `UPLOADTHING_TOKEN` or replacing handlers under `app/api/uploadthing`.
- For deployment (Vercel, Firebase Hosting, etc.), ensure env vars are present and public URLs are whitelisted in your Firebase console.
