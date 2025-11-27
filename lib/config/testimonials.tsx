"use client";

import type { TestimonialItem } from "@/components/home/testimonials-marquee";
import { Highlight } from "@/components/home/testimonials-marquee";

export const testimonials: TestimonialItem[] = [
  {
    name: "Alex Chen",
    role: "Senior Full-Stack Developer",
    description: (
      <p>
        Next.js App Router completely transformed how I build applications.
        <Highlight>
          Server Components and the file-based routing system make development
          incredibly intuitive and performant.
        </Highlight>{" "}
        The developer experience is unmatched, and Turbopack makes hot reloading
        blazing fast.
      </p>
    ),
  },
  {
    name: "Sarah Martinez",
    role: "Frontend Engineer",
    description: (
      <p>
        React 19 has been a game-changer for our team.
        <Highlight>
          The new hooks and concurrent features have made our applications more
          responsive and easier to maintain.
        </Highlight>{" "}
        The improved server components integration is exactly what we needed.
      </p>
    ),
  },
  {
    name: "Michael Thompson",
    role: "UI/UX Developer",
    description: (
      <p>
        Tailwind CSS v4 is hands down the best CSS framework I&apos;ve worked
        with.
        <Highlight>
          Utility-first approach combined with the new CSS variables system gives
          me complete design control without leaving my HTML.
        </Highlight>{" "}
        Shipping beautiful UIs has never been faster.
      </p>
    ),
  },
  {
    name: "David Kim",
    role: "Backend Architect",
    description: (
      <p>
        Firebase Auth and Realtime Database have streamlined our entire
        authentication flow.
        <Highlight>
          The real-time synchronization capabilities and built-in security rules
          save us weeks of development time.
        </Highlight>{" "}
        Perfect for rapid prototyping and production apps alike.
      </p>
    ),
  },
  {
    name: "Emma Wilson",
    role: "State Management Specialist",
    description: (
      <p>
        Zustand has replaced Redux in all our projects.
        <Highlight>
          Minimal boilerplate, TypeScript-first design, and the simplicity of
          hooks make it the perfect state management solution.
        </Highlight>{" "}
        Our bundle size dropped significantly, and code is much cleaner.
      </p>
    ),
  },
  {
    name: "James Rodriguez",
    role: "Component Library Maintainer",
    description: (
      <p>
        shadcn/ui built on Radix is exactly what the React ecosystem needed.
        <Highlight>
          Copy-paste components that we own, built on accessible primitives, with
          Tailwind styling.
        </Highlight>{" "}
        We can customize everything while maintaining accessibility standards.
      </p>
    ),
  },
  {
    name: "Lisa Anderson",
    role: "DevOps Engineer",
    description: (
      <p>
        UploadThing has simplified file uploads beyond what I thought possible.
        <Highlight>
          The React hooks API and automatic file handling make complex upload
          flows trivial to implement.
        </Highlight>{" "}
        No more dealing with S3 configurations or storage complexities.
      </p>
    ),
  },
  {
    name: "Robert Taylor",
    role: "Node.js Developer",
    description: (
      <p>
        Node.js continues to be the backbone of our server infrastructure.
        <Highlight>
          The async/await patterns and the rich npm ecosystem make building
          scalable backends incredibly efficient.
        </Highlight>{" "}
        Perfect integration with Next.js API routes.
      </p>
    ),
  },
  {
    name: "Jennifer Lee",
    role: "TypeScript Advocate",
    description: (
      <p>
        TypeScript has eliminated entire classes of runtime errors from our
        codebase.
        <Highlight>
          The type safety and excellent IDE support make refactoring large
          codebases much safer and faster.
        </Highlight>{" "}
        It&apos;s become essential for any serious JavaScript project.
      </p>
    ),
  },
  {
    name: "Kevin Park",
    role: "Build Performance Engineer",
    description: (
      <p>
        Turbopack is a game-changer for development speed.
        <Highlight>
          Incremental compilation and intelligent caching make rebuilds nearly
          instant even in large monorepos.
        </Highlight>{" "}
        The difference in developer productivity is immediately noticeable.
      </p>
    ),
  },
  {
    name: "Amy Johnson",
    role: "Developer Tools Specialist",
    description: (
      <p>
        Biome has replaced ESLint and Prettier in all our projects.
        <Highlight>
          Single tool for linting and formatting with Rust-powered performance.
        </Highlight>{" "}
        Configuration is minimal, and it just works out of the box.
      </p>
    ),
  },
  {
    name: "Chris Brown",
    role: "Data Visualization Expert",
    description: (
      <p>
        Recharts makes building complex data visualizations in React a breeze.
        <Highlight>
          Declarative API with composable components means I can create beautiful
          charts quickly without fighting with D3.
        </Highlight>{" "}
        Perfect integration with our design system.
      </p>
    ),
  },
];
