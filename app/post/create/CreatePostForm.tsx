"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "@/components/rich-text-editor";
import { PostStatus } from "@/enum";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";

/* ---------------- helpers ---------------- */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

export default function CreatePostForm() {
    const { data: session, isPending } = useSession();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [checkingSlug, setCheckingSlug] = useState(false);
    const [slugExists, setSlugExists] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);

  /* ---------------- auth redirect ---------------- */

    useEffect(() => {
        if (!isPending && !session) {
        redirect("/");
        }
    }, [isPending, session]);

  /* ---------------- auto slug ---------------- */

    useEffect(() => {
        if (!slugTouched && title) {
        setSlug(slugify(title));
        }
    }, [title, slugTouched]);

  /* ---------------- slug check ---------------- */

    useEffect(() => {
        if (!slug) {
        setSlugExists(false);
        return;
        }

        const controller = new AbortController();

        const checkSlug = async () => {
        setCheckingSlug(true);
        try {
            const res = await fetch(
            `/api/posts/check-slug?slug=${encodeURIComponent(slug)}`,
            { signal: controller.signal }
            );
            const data = await res.json();
            setSlugExists(data.exists);
        } catch {}
        setCheckingSlug(false);
        };

        const timeout = setTimeout(checkSlug, 400);

        return () => {
        clearTimeout(timeout);
        controller.abort();
        };
    }, [slug]);

  /* ---------------- loading UI ---------------- */

    if (isPending) {
        return (
        <div className="flex justify-center py-36">
            <Spinner className="w-18 h-18" />
        </div>
        );
    }

    if (!session) return null;

  /* ---------------- validation ---------------- */

    const validate = () => {
        if (!title.trim()) return toast.error("Title is required"), false;
        if (!summary.trim()) return toast.error("Summary is required"), false;
        if (!content.trim()) return toast.error("Content is required"), false;
        if (slugExists) return toast.error("Slug already exists"), false;
        return true;
    };

  /* ---------------- submit ---------------- */

    const submit = async (status: PostStatus) => {
        if (!validate()) return;

        setLoading(true);

        const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            slug: slug || undefined,
            summary,
            content,
            status,
            userId: session.user.id,
        }),
        });

        setLoading(false);

        if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to create post");
        return;
        }

        toast.success("Post created");
        redirect(`/${session.user.username}/posts`);
    };

  /* ---------------- UI ---------------- */

    return (
        <main className="mx-auto max-w-6xl px-3 sm:px-6 py-18 sm:py-24">
            <div className="bg-white border p-6 sm:p-10 rounded-lg">
                <div className="flex justify-between mb-8">
                    <h1 className="text-2xl font-bold">Create New Post</h1>

                    <div className="flex gap-3">
                        <Button
                        variant="outline"
                        type="button"
                        disabled={loading || slugExists}
                        onClick={() => submit(PostStatus.Draft)}
                        className="rounded-full"
                        >
                        Draft
                        {loading && <Spinner />}
                        </Button>

                        <Button
                        type="button"
                        disabled={loading || slugExists}
                        onClick={() => submit(PostStatus.Draft)} // aprove now for testing
                        className="rounded-full"
                        >
                        Publish
                        {loading && <Spinner />}
                        </Button>
                    </div>
                </div>

                {/* Title */}
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                    className="w-full mb-4 border rounded px-4 py-2"
                />

                {/* Slug */}
                <label className="block text-sm font-medium mb-1">
                Slug (Optional)
                </label>
                <input
                value={slug}
                onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                }}
                placeholder="post-title-slug"
                className={`w-full mb-1 border rounded px-4 py-2 ${
                    slugExists ? "border-red-500" : ""
                }`}
                />

                <div className="text-sm mb-4">
                    {checkingSlug && <span className="text-gray-500">Checking slug…</span>}
                    {!checkingSlug && slugExists && (
                        <span className="text-red-500">Slug already exists</span>
                    )}
                    {!checkingSlug && slug && !slugExists && (
                        <span className="text-green-600">Slug available</span>
                    )}
                </div>

                {/* Summary */}
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full mb-4 border rounded px-4 py-2"
                />

                {/* Content */}
                <label className="block text-sm font-medium mb-1">Content</label>
                <RichTextEditor value={content} onChange={setContent} />
            </div>
        </main>
    );
}
