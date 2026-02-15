"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PostStatus } from "@/enum";
import { useSession } from "@/lib/auth-client";
import { createPostAction } from "@/server/actions/post";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

/* ---------------- helpers ---------------- */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");

export default function CreatePostForm() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  // Validation State
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  /* ---------------- effects ---------------- */

  // Auto-slug title
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  // Real-time slug check (Keep as API call for speed)
  useEffect(() => {
    if (!slug) {
      setSlugExists(false);
      return;
    }
    const controller = new AbortController();
    const checkSlug = async () => {
      setCheckingSlug(true);
      try {
        const res = await fetch(`/api/posts/check-slug?slug=${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });
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

  /* ---------------- handlers ---------------- */

  const validate = () => {
    if (!title.trim()) return toast.error("Title is required"), false;
    if (slugExists) return toast.error("Please use a unique slug"), false;
    if (!summary.trim()) return toast.error("Summary is required"), false;
    if (content.length < 10) return toast.error("Content is too short"), false;
    return true;
  };

  const handleSave = async (status: PostStatus) => {
    if (!validate()) return;

    startTransition(async () => {
      const result = await createPostAction({
        title,
        slug,
        summary,
        content,
        status,
      });

      if (result.success) {
        toast.success(status === PostStatus.Draft ? "Draft saved" : "Post published!");
        router.push(`/${session?.user.username}/posts`);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  /* ---------------- UI States ---------------- */

  if (authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button 
            onClick={() => router.back()}
            className="group mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1 " />
            Back to posts
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Post</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={isPending || slugExists}
            onClick={() => handleSave(PostStatus.Draft)}
            className="bg-white"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Draft
          </Button>
          <Button
            disabled={isPending || slugExists}
            onClick={() => handleSave(PostStatus.Aprove)}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Publish Now
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Form Content */}
        <section className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold leading-none">Post Title</label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border rounded px-4 py-2"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold leading-none">URL Slug</label>
            <div className="relative">
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className={`flex h-10 w-full rounded-md border bg-background px-4 py-2 text-sm transition-colors ${
                  slugExists ? "border-destructive focus-visible:ring-destructive" : "border-input"
                }`}
              />
              <div className="absolute right-3 top-2.5">
                {checkingSlug && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {!checkingSlug && slug && !slugExists && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {!checkingSlug && slugExists && <AlertCircle className="h-4 w-4 text-destructive" />}
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground">
              {slugExists ? (
                <span className="text-destructive">This slug is already taken.</span>
              ) : (
                <span>Preview: yourdomain.com/posts/{slug || "..."}</span>
              )}
            </p>
          </div>

          {/* Summary Field */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold leading-none">Summary</label>
              <span className="text-[11px] text-muted-foreground">{summary.length} / 200</span>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="A brief description for SEO and cards..."
              className="flex w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
            />
          </div>

          {/* Editor Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </section>
      </div>
    </main>
  );
}