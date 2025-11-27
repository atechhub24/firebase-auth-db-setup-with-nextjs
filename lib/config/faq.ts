export type FaqCategory = "general" | "pricing" | "technical" | "support";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
}

export interface FaqConfig {
  title: string;
  description: string;
  contactText?: string;
  contactLink?: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "What is Firebase Auth + Realtime DB Starter?",
    answer:
      "Firebase Auth + Realtime DB Starter is a comprehensive Next.js starter template with Firebase authentication, real-time database integration, role-based access control, and pre-built components for rapid development.",
    category: "general",
  },
  {
    id: "2",
    question: "Is this starter template free to use?",
    answer:
      "Yes, this starter template is completely free and open-source. You can use it for personal and commercial projects without any restrictions.",
    category: "general",
  },
  {
    id: "3",
    question: "Do I need to know Firebase to use this starter?",
    answer:
      "Basic knowledge of Firebase is helpful but not required. The starter includes detailed setup instructions and pre-configured Firebase services. You can get started quickly with the provided documentation.",
    category: "technical",
  },
  {
    id: "4",
    question: "How do I set up Firebase for this project?",
    answer:
      "Create a Firebase project in the Firebase Console, enable Authentication and Realtime Database, then add your Firebase configuration to environment variables. Check our documentation for detailed setup steps.",
    category: "technical",
  },
  {
    id: "5",
    question: "Can I customize the components?",
    answer:
      "Absolutely! All components are built with shadcn/ui and Tailwind CSS, making them highly customizable. You can modify colors, spacing, typography, and functionality to match your needs.",
    category: "technical",
  },
  {
    id: "6",
    question: "Does this support dark mode?",
    answer:
      "Yes, all components are designed to work seamlessly with both light and dark modes using Tailwind CSS. The theme automatically adapts based on your theme provider settings.",
    category: "technical",
  },
  {
    id: "7",
    question: "What role-based features are included?",
    answer:
      "The starter includes role-aware dashboards for admin and staff roles, with different access levels and features. Role-based routing and permissions are built into the authentication flow.",
    category: "general",
  },
  {
    id: "8",
    question: "How can I contribute to this project?",
    answer:
      "We welcome contributions! You can contribute by creating new features, improving existing ones, fixing bugs, or enhancing documentation. Check our GitHub repository for contribution guidelines.",
    category: "support",
  },
  {
    id: "9",
    question: "What technologies are used in this starter?",
    answer:
      "The starter uses Next.js App Router, React 19, TypeScript, Firebase Auth & Realtime Database, Zustand for state management, shadcn/ui components, Tailwind CSS v4, and various other modern web technologies.",
    category: "technical",
  },
  {
    id: "10",
    question: "Is there support available?",
    answer:
      "Yes, we provide support through our GitHub repository issues. You can also check the documentation for common questions and troubleshooting guides.",
    category: "support",
  },
];

export const faqConfig: FaqConfig = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about Firebase Auth + Realtime DB Starter and how to use it to build your next project.",
  contactText: "Can't find what you're looking for?",
  contactLink: "#contact",
};

