"use client";

import type { TestimonialItem } from "@/components/home/testimonials-marquee";
import { Highlight } from "@/components/home/testimonials-marquee";

export const testimonials: TestimonialItem[] = [
  {
    name: "Rajesh Kumar",
    role: "CEO, TechStart Solutions",
    description: (
      <p>
        This starter template has been instrumental in getting our product to
        market 40% faster.
        <Highlight>
          The Firebase integration and role-based access control saved us months
          of development time.
        </Highlight>{" "}
        We were able to focus on our core business logic instead of building
        authentication from scratch.
      </p>
    ),
  },
  {
    name: "Priya Sharma",
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
    name: "Arjun Patel",
    role: "Founder & Business Owner",
    description: (
      <p>
        As a non-technical founder, this template was a lifesaver.
        <Highlight>
          The pre-built components and Firebase setup meant we could launch our
          MVP in weeks instead of months.
        </Highlight>{" "}
        The ROI on development costs has been exceptional, and the code quality
        is production-ready.
      </p>
    ),
  },
  {
    name: "Ananya Reddy",
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
    name: "Vikram Singh",
    role: "CEO, Digital Innovations Inc",
    description: (
      <p>
        The attendance tracking and analytics features saved us from building
        custom solutions.
        <Highlight>
          Our team productivity increased by 30% after implementing the
          dashboard system.
        </Highlight>{" "}
        The real-time updates and Firebase integration work flawlessly at scale.
      </p>
    ),
  },
  {
    name: "Meera Nair",
    role: "UI/UX Developer",
    description: (
      <p>
        Tailwind CSS v4 is hands down the best CSS framework I&apos;ve worked
        with.
        <Highlight>
          Utility-first approach combined with the new CSS variables system
          gives me complete design control without leaving my HTML.
        </Highlight>{" "}
        Shipping beautiful UIs has never been faster.
      </p>
    ),
  },
  {
    name: "Sandeep Malhotra",
    role: "Business Owner",
    description: (
      <p>
        We needed a scalable solution for our SaaS platform, and this delivered
        beyond expectations.
        <Highlight>
          The blog CMS and admin features allowed us to manage content without
          additional tools.
        </Highlight>{" "}
        The clean architecture makes it easy for our developers to extend and
        customize.
      </p>
    ),
  },
  {
    name: "Deepak Joshi",
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
    name: "Kavita Desai",
    role: "CEO, StartupHub",
    description: (
      <p>
        We evaluated multiple starter templates, and this one stood out.
        <Highlight>
          The comprehensive feature set and TypeScript-first approach gave us
          confidence in code quality.
        </Highlight>{" "}
        Our investors were impressed with how quickly we delivered a polished
        product.
      </p>
    ),
  },
  {
    name: "Rahul Verma",
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
    name: "Sneha Iyer",
    role: "Business Owner",
    description: (
      <p>
        The command palette and role-based dashboard features transformed our
        workflow.
        <Highlight>
          Our team can now access features quickly, and the admin controls make
          user management effortless.
        </Highlight>{" "}
        The user experience has received consistent positive feedback from our
        clients.
      </p>
    ),
  },
  {
    name: "Aditya Menon",
    role: "Component Library Maintainer",
    description: (
      <p>
        shadcn/ui built on Radix is exactly what the React ecosystem needed.
        <Highlight>
          Copy-paste components that we own, built on accessible primitives,
          with Tailwind styling.
        </Highlight>{" "}
        We can customize everything while maintaining accessibility standards.
      </p>
    ),
  },
];
