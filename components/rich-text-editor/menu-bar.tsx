"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Button } from "../ui/button";

const btn = (active?: boolean) =>
  `
  rounded-md border px-3 py-1 text-sm font-medium transition
  ${
    active
      ? "bg-black text-white border-black"
      : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100"
  }
  disabled:opacity-50 disabled:cursor-not-allowed
  `;

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    const editorState = useEditorState({ editor,  selector: (ctx) => { const ed = ctx.editor;
        return {
            isBold: ed.isActive("bold"),
            isHeading1: ed.isActive("heading", { level: 1 }),
            isHeading2: ed.isActive("heading", { level: 2 }),
            isBlockquote: ed.isActive("blockquote"),
            isBulletList: ed.isActive("bulletList"),
            isOrderedList: ed.isActive("orderedList"),
            isCodeBlock: ed.isActive("codeBlock"),

            canBold: ed.can().toggleBold(),
            canBlockquote: ed.can().toggleBlockquote(),
            canBulletList: ed.can().toggleBulletList(),
            canOrderedList: ed.can().toggleOrderedList(),
            canCodeBlock: ed.can().toggleCodeBlock(),
        };
        },
    });

    const addImage = () => {
        const url = window.prompt("Enter image URL");
        if (!url) return;

        editor.chain().focus().setImage({ src: url }).run();
    }

    return (
        <div className="flex flex-wrap gap-2 bg-zinc-50 p-2 px-6">
            <Button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editorState.canBold}
                className={btn(editorState.isBold)}
            >Bold</Button>

            <Button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btn(editorState.isHeading1)}
            >
                H1
            </Button>

            <button
                    type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btn(editorState.isHeading2)}
            >
                H2
            </button>

            <Button
                    type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={!editorState.canBlockquote}
                className={btn(editorState.isBlockquote)}
            >
                Blockquote
            </Button>

            <Button
                    type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editorState.canBulletList}
                className={btn(editorState.isBulletList)}
            >
                Bullet
            </Button>

            <Button
                    type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editorState.canOrderedList}
                className={btn(editorState.isOrderedList)}
            >
                Ordered
            </Button>

            <Button
                    type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editorState.canCodeBlock}
                className={btn(editorState.isCodeBlock)}
            >
                Code
            </Button>

                    {/* Image */}
            <Button onClick={addImage} className={btn()}>
                Image
            </Button>

            <Button
                    type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={btn()}
            >
                HR
            </Button>
        </div>
    );
}
