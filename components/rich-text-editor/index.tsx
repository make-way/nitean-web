"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MenuBar from "./menu-bar";

const Tiptap = () => {
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
        content: ``,
        immediatelyRender: false,
    });

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="relative rounded-lg border">
            {/* Editor area */}
            <EditorContent
                editor={editor}
                className="min-h-[200px] p-4 prose max-w-none focus:outline-none"
            />

            {/* Floating menu bar at the bottom */}
            {mounted && (
                <div className="sticky bottom-10 z-10 bg-white border-t border-gray-200 p-1 shadow-md rounded-full">
                <MenuBar editor={editor} />
                </div>
            )}
        </div>
    );
};

export default Tiptap;
