"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

type TiptapViewerProps = {
  content: string;
};

const TiptapViewer = ({ content }: TiptapViewerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
    ],
    content,
    editable: false, // 🔴 important
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div>
      <EditorContent
        editor={editor}
        className="p-0 prose max-w-none"
      />
    </div>
  );
};

export default TiptapViewer;
