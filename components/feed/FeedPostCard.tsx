'use client';

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Heart, Share2, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { togglePostLikeAction, deletePostAction } from "@/server/actions/post";
import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "date-fns";
import FeedComposer from "./FeedComposer";
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
import { useTranslation } from 'react-i18next';
import { toast } from "sonner"

type FeedPostCardProps = {
    post: any;
    currentUserId?: string;
    isThreadParent?: boolean;
    isThreadChild?: boolean;
    isDetailsView?: boolean;
};

export default function FeedPostCard({
    post,
    currentUserId,
    isThreadParent = false,
    isThreadChild = false,
    isDetailsView = false
}: FeedPostCardProps) {
    const { t } = useTranslation();
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showCopyOptions, setShowCopyOptions] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            // Dropdown height ≈ 150px (adjust if needed)
            if (spaceBelow < 160 && spaceAbove > spaceBelow) {
                setDropdownPosition("top");
            } else {
                setDropdownPosition("bottom");
            }
        }

        setShowCopyOptions((prev) => !prev);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowCopyOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleCopyLink = async () => {
        try {
            const url = `${window.location.origin}/post/${post.id}`;
            await navigator.clipboard.writeText(url);
            setShowCopyOptions(false);
            toast.success("Copied to clipboard")
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };
    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev: number) => newIsLiked ? prev + 1 : prev - 1);

        const result = await togglePostLikeAction(post.id);
        if (!result.success) {
            setIsLiked(!newIsLiked);
            setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deletePostAction(post.id);
        if (!result.success) {
            alert(result.error || 'Failed to delete post');
            setIsDeleting(false);
        }
    };

    if (isDeleting) return null;

    const isOwner = session?.user?.id === post.userId;

    if (isEditing) {
        return (
            <div className="p-4 border-b border-zinc-300 dark:border-zinc-800">
                <FeedComposer
                    editPostId={post.id}
                    initialContent={post.content}
                    initialMedia={post.media}
                    onSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }


    if (isDetailsView) {
        return (
            <article className="flex flex-col p-4 border-b border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black">
                {/* Header Profile */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-3">
                        <div className="flex flex-col items-center relative">
                            {isThreadChild && <div className="absolute -top-4 w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700" />}
                            <Link href={`/${post.user.username}`} className="shrink-0 relative z-10">
                                <Image
                                    src={post.user.image || "/placeholder-user.jpg"}
                                    alt={post.user.username}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover w-10 h-10"
                                    loading="lazy"
                                />
                            </Link>
                        </div>
                        <div className="flex flex-col text-[15px] pt-0.5">
                            <Link href={`/${post.user.username}`} className="font-bold hover:underline dark:text-zinc-100">
                                {post.user.name}
                            </Link>
                            <span className="text-zinc-500">@{post.user.username}</span>
                        </div>
                    </div>
                    {showOptions && isOwner && (
                        <div className="relative">
                            <button onClick={(e) => { e.preventDefault(); setShowOptions(!showOptions); }} className="p-2 -mr-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/20 text-zinc-500 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-lg w-36 z-50 py-1 overflow-hidden">
                                <button
                                    onClick={() => { setIsEditing(true); setShowOptions(false); }}
                                    className="w-full text-left px-4 py-2 text-[15px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" /> {t("buttons.edit")}
                                </button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="w-full text-left px-4 py-2 text-[15px] font-medium text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                                            <Trash2 className="w-4 h-4" /> {t("buttons.delete")}
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="z-100">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t("label.are_you_absolutely_sure")}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t("label.this_action_cannot_be_undone")}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white">{t("buttons.delete")}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="text-[20px] leading-normal dark:text-zinc-100 whitespace-pre-wrap mb-4">
                    {post.content}
                </div>

                {/* Media */}
                {post.media && post.media.length > 0 && (
                    <div className={`grid gap-2 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-800 mb-4 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {post.media.map((m: any) => (
                            // <div key={m.id} className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                            //     <img src={m.url} alt={post.content} className="w-full h-full object-cover" />
                            // </div>
                            <img src={m.url} key={m.id} alt={post.content} className="w-full h-full object-cover" />
                        ))}
                    </div>
                )}

                {/* Time & Stats */}
                <div className="flex items-center gap-2 py-4 border-b border-zinc-300 dark:border-zinc-800 text-zinc-500 text-[15px]">
                    <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-6 py-4 border-b border-zinc-300 dark:border-zinc-800 font-bold text-[14px]">
                    <span className="dark:text-zinc-100">{post._count?.replies || 0} <span className="text-zinc-500 font-normal">{t("label.replies")}</span></span>
                    <span className="dark:text-zinc-100">{likesCount} <span className="text-zinc-500 font-normal">{t("label.likes")}</span></span>
                </div>

                {/* Main Actions */}
                <div className="flex items-center justify-start py-2 border-b border-zinc-300 dark:border-zinc-800">
                    <button onClick={() => setIsReplying(!isReplying)} className="p-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/20 text-zinc-500 hover:text-sky-500 transition-colors cursor-pointer">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <button onClick={handleLike} className={`p-2 rounded-full transition-colors cursor-pointer ${isLiked ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' : 'text-zinc-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'}`}>
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    {/* <button className="p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-950/20 text-zinc-500 hover:text-green-500 transition-colors cursor-pointer">
                        <Share2 className="w-5 h-5" />
                    </button> */}
                </div>
            </article>
        );
    }

    return (
        <article className={`flex flex-col hover:bg-zinc-50/20 dark:hover:bg-zinc-900/20 transition-colors ${!isThreadParent ? 'border-b border-zinc-300 dark:border-zinc-800' : ''}`}>
            <div className="flex gap-3 px-4 pt-4 pb-2">
                {/* Left side with Avatar and Lines */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center relative">
                        {isThreadChild && <div className="absolute -top-4 w-0.5 h-4 bg-zinc-200 dark:bg-zinc-700" />}
                        <Link href={`/${post.user.username}`} className="shrink-0 relative z-10">
                            <Image
                                src={post.user.image || "/placeholder-user.jpg"}
                                alt={post.user.username}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-10 h-10"
                                loading="lazy"
                            />
                        </Link>
                        {isThreadParent && <div className="flex-1 w-0.5 h-full min-h-6 bg-zinc-200 dark:bg-zinc-700 mt-2" />}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-1 text-[15px]">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1">
                                <Link href={`/${post.user.username}`} className="font-bold hover:underline dark:text-zinc-100">
                                    {post.user.name}
                                </Link>
                                <span className="text-zinc-500">@{post.user.username}</span>
                            </div>
                            <span className="text-zinc-500">·</span>
                            <span className="text-zinc-500">{formatDistanceToNow(new Date(post.createdAt))}</span>
                        </div>
                        <div className="relative">
                            {isOwner && (
                                <button onClick={(e) => { e.preventDefault(); setShowOptions(!showOptions); }} className="p-2 -mr-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/20 text-zinc-500 transition-colors cursor-pointer">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            )}

                            {showOptions && isOwner && (
                                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xs shadow-lg w-36 z-50 py-1 overflow-hidden">
                                    <button
                                        onClick={() => { setIsEditing(true); setShowOptions(false); }}
                                        className="w-full text-left px-4 py-2 text-[15px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" /> {t("buttons.edit")}
                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="w-full text-left px-4 py-2 text-[15px] font-medium text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" /> {t("buttons.delete")}
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="z-100" onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t("label.are_you_absolutely_sure")}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t("label.this_action_cannot_be_undone")}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>{t("buttons.cancel")}</AlertDialogCancel>
                                                <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white">{t("buttons.delete")}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>
                    </div>

                    <Link href={`/post/${post.id}`} className="block">
                        <div className="text-[15px] leading-normal dark:text-zinc-200 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </Link>

                    {post.media && post.media.length > 0 && (
                        <Link href={`/post/${post.id}`} className="block">
                            <div className={`grid gap-2 rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-800 mt-3 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {post.media.map((m: any) => (
                                    // <div key={m.id} className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                                    //     <img src={m.url} alt={post.content} className="w-full h-full object-cover" />
                                    // </div>
                                    <img src={m.url} key={m.id} alt={post.content} className="w-full h-full object-cover" />
                                ))}
                            </div>
                        </Link>
                    )}

                    <div className="flex items-center justify-start gap-6 max-w-md pt-2">
                        <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-2 group text-zinc-500 hover:text-sky-500 transition-colors text-[13px]">
                            <div className="p-2 rounded-full group-hover:bg-sky-50 dark:group-hover:bg-sky-950/20 transition-colors cursor-pointer">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span>{post._count?.replies || 0}</span>
                        </button>
                        <button onClick={handleLike} className={`flex items-center gap-2 group transition-colors text-[13px] cursor-pointer ${isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'}`}>
                            <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-rose-50 dark:bg-rose-950/20' : 'group-hover:bg-rose-50 dark:group-hover:bg-rose-950/20'}`}>
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            </div>
                            <span className={isLiked ? 'font-bold' : ''}>{likesCount}</span>
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                ref={buttonRef}
                                onClick={handleToggle}
                                className="p-2 -mr-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-950/20 text-zinc-500 transition-colors cursor-pointer"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {showCopyOptions && (
                                <div
                                    className={`absolute right-0 ${dropdownPosition === "bottom"
                                            ? "top-full mt-1"
                                            : "bottom-full mb-1"
                                        } bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xs shadow-lg w-40 z-50 py-1 overflow-hidden`}
                                >
                                    {/* Copy Link */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyLink();
                                        }}
                                        className="w-full text-left px-4 py-2 text-[15px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isReplying && (
                <div className="px-4 pb-4 border-t border-zinc-50 dark:border-zinc-900 pt-4 bg-white dark:bg-black">
                    <FeedComposer
                        replyToPostId={post.id}
                        placeholder="Post your reply"
                        onSuccess={() => setIsReplying(false)}
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}
        </article>
    );
}
