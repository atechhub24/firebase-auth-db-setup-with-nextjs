"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: Record<string, unknown>;
  className?: string;
}

export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-muted p-4 rounded-md font-mono text-sm",
        },
      }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none",
          className
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}

