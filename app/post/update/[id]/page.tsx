'use client';

import { useEffect, useState, useTransition, use } from 'react';
import { useRouter } from 'next/navigation';
import { PostStatus } from '@/enum';
import { useSession } from '@/lib/auth-client';
import { updatePostAction, deletePostAction } from '@/server/actions/post';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';

/* ---------------- helpers ---------------- */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function UpdatePostPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const originalSlug = resolvedParams.id;
    const { data: session, isPending: authLoading } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDeleting, startDeleting] = useTransition();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<PostStatus>(PostStatus.Draft);
    const [isLoading, setIsLoading] = useState(true);
    const [postNotFound, setPostNotFound] = useState(false);

    // Validation State
    const [checkingSlug, setCheckingSlug] = useState(false);
    const [slugExists, setSlugExists] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);

    /* ---------------- effects ---------------- */

    // Fetch post data on mount
    useEffect(() => {
        const fetchPost = async () => {
        try {
            const res = await fetch(`/api/posts/${originalSlug}`);

            if (res.status === 404) {
            setPostNotFound(true);
            setIsLoading(false);
            return;
            }

            if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('API Error:', res.status, errorData);
            throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch post`);
            }

            const data = await res.json();
            const post = data.post;

            setTitle(post.title);
            setSlug(post.slug);
            setSummary(post.summary);
            setContent(post.content);
            setStatus(post.status);
            setSlugTouched(true); // Prevent auto-slug from overriding loaded slug
        } catch (error) {
            console.error('Failed to fetch post:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to load post');
        } finally {
            setIsLoading(false);
        }
        };

        fetchPost();
    }, [originalSlug]);

    // Auto-slug title (only if slug was not manually edited)
    useEffect(() => {
        if (!slugTouched && title && title !== '') {
            setSlug(slugify(title));
        }
    }, [title, slugTouched]);

    // Real-time slug check (exclude current post)
    useEffect(() => {
        if (!slug) {
            setSlugExists(false);
            return;
        }

        // If slug hasn't changed from original, don't check
        if (slug.trim() === originalSlug.trim()) {
            setSlugExists(false);
            return;
        }

        const controller = new AbortController();
        const checkSlug = async () => {
            setCheckingSlug(true);
            try {
                const res = await fetch(`/api/posts/check-slug?slug=${encodeURIComponent(slug)}&excludeSlug=${encodeURIComponent(originalSlug)}`, {
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
    }, [slug, originalSlug]);

    /* ---------------- handlers ---------------- */

    const validate = () => {
        if (!title.trim()) return (toast.error('Title is required'), false);
        if (slugExists) return (toast.error('Please use a unique slug'), false);
        if (!summary.trim()) return (toast.error('Summary is required'), false);
        if (content.length < 10) return (toast.error('Content is too short'), false);
        return true;
    };

    const handleUpdate = async (newStatus: PostStatus) => {
        if (!validate()) return;

        startTransition(async () => {
        const result = await updatePostAction({
            slug: originalSlug,
            title,
            newSlug: slug,
            summary,
            content,
            status: newStatus,
        });

        if (result.success) {
            toast.success(newStatus === PostStatus.Draft ? 'Draft updated' : 'Post updated!');
            router.push(`/${session?.user.username}/posts`);
        } else {
            toast.error(result.message || 'Something went wrong');
        }
        });
    };

    const handleDelete = async () => {
        startDeleting(async () => {
        const result = await deletePostAction(originalSlug);

        if (result.success) {
            toast.success('Post deleted successfully');
            router.push(`/${session?.user.username}/posts`);
        } else {
            toast.error(result.message || 'Failed to delete post');
        }
        });
        setIsDeleteDialogOpen(false);
    };

    /* ---------------- UI States ---------------- */

    if (authLoading || isLoading) {
        return (
        <div className='flex h-[60vh] items-center justify-center'>
            <Spinner className='text-primary h-10 w-10' />
        </div>
        );
    }

    if (!session) return null;

    if (postNotFound) {
        return (
        <main className='mx-auto max-w-5xl px-4 py-12 sm:px-6'>
            <div className='text-center'>
            <h1 className='mb-4 text-3xl font-extrabold tracking-tight'>Post Not Found</h1>
            <p className='text-muted-foreground mb-6'>The post you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </main>
        );
    }

    return (
        <main className='mx-auto max-w-5xl px-4 py-12 sm:px-6'>
            {/* Header Section */}
            <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <button
                        onClick={() => router.back()}
                        className='group text-muted-foreground hover:text-foreground mb-2 flex cursor-pointer items-center text-sm'
                    >
                        <ArrowLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1' />
                        Back to posts
                    </button>
                    <h1 className='text-3xl font-extrabold tracking-tight'>Update Post</h1>
                </div>

                <div className='flex items-center gap-3'>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='sm' disabled={isPending}>
                            {isDeleting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Trash2 className='mr-2 h-4 w-4' />}
                            Delete
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>Are you sure you want to delete this post? This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            >
                            {isDeleting ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button variant='outline' disabled={isPending || slugExists} onClick={() => handleUpdate(PostStatus.Draft)} className='bg-white'>
                        {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                        Save Draft
                    </Button>
                    <Button disabled={isPending || slugExists} onClick={() => handleUpdate(PostStatus.Aprove)}>
                        {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                        Update Post
                    </Button>
                </div>
            </div>

            <div className='grid gap-8'>
                {/* Form Content */}
                <section className='bg-card space-y-6 rounded-xl border p-6 shadow-sm'>
                    {/* Title Field */}
                    <div className='space-y-2'>
                        <label className='text-sm leading-none font-semibold'>Post Title</label>
                        <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's on your mind?"
                        className='w-full rounded border px-4 py-2'
                        />
                    </div>

                    {/* Slug Field */}
                    <div className='space-y-2'>
                        <label className='text-sm leading-none font-semibold'>URL Slug</label>
                        <div className='relative'>
                        <input
                            value={slug}
                            onChange={(e) => {
                            setSlugTouched(true);
                            setSlug(slugify(e.target.value));
                            }}
                            className={`bg-background flex h-10 w-full rounded-md border px-4 py-2 text-sm transition-colors ${
                            slugExists ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
                            }`}
                        />
                        <div className='absolute top-2.5 right-3'>
                            {checkingSlug && <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />}
                            {!checkingSlug && slug && !slugExists && <CheckCircle2 className='h-4 w-4 text-green-500' />}
                            {!checkingSlug && slugExists && <AlertCircle className='text-destructive h-4 w-4' />}
                        </div>
                        </div>
                        <p className='text-muted-foreground text-[13px]'>
                        {slugExists ? (
                            <span className='text-destructive'>This slug is already taken.</span>
                        ) : (
                            <span>Preview: yourdomain.com/posts/{slug || '...'}</span>
                        )}
                        </p>
                    </div>

                    {/* Summary Field */}
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                        <label className='text-sm leading-none font-semibold'>Summary</label>
                        <span className='text-muted-foreground text-[11px]'>{summary.length} / 200</span>
                        </div>
                        <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value.slice(0, 200))}
                        rows={3}
                        placeholder='A brief description for SEO and cards...'
                        className='border-input bg-background ring-offset-background placeholder:text-muted-foreground flex w-full rounded-md border px-4 py-2 text-sm'
                        />
                    </div>

                    {/* Editor Field */}
                    <div className='space-y-2'>
                        <label className='mb-1 block text-sm font-medium'>Content</label>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>
                </section>
            </div>
        </main>
    );
}
