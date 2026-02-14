import { auth } from "@/lib/auth";
import Image from "next/image";
import ProfileTabs from "@/components/ProfileTabs";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Settings, X } from "lucide-react";
import Link from "next/link";

export default async function UserLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = await prisma.user.findUnique({
        where: { username: username },
        include: { _count: { select: { posts: true } } },
    });

    if (!user) notFound();

    const isOwner = session?.user?.id === user.id;

    return (
        <div className="relative min-h-screen bg-linear-to-b from-slate-50 to-white">
            {/* Close button */}
            <Link
                href="/"
                aria-label="Close profile"
                className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full
                        bg-white/80 text-slate-500 shadow-sm backdrop-blur-sm
                        hover:bg-white hover:text-slate-900 hover:shadow-md transition-all duration-200"
            >
                <X className="h-5 w-5" />
            </Link>

            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                    <div className="relative shrink-0">
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white ring-offset-2 ring-offset-slate-50 bg-slate-200">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                    sizes="112px"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-300 to-slate-400 text-2xl font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {user.level !== "Basic" && (
                            <span className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
                                {user.level}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                {user.name}
                            </h1>
                            {isOwner && (
                                <Link
                                    href="/profile/edit"
                                    aria-label="Edit profile"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg
                                            text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                >
                                    <Pen className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        <p className="mt-1 text-slate-500 font-medium">@{username}</p>
                        <p className="mt-2 text-sm text-slate-400">
                            {user._count.posts} article{user._count.posts !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <ProfileTabs username={username} />

                {/* Page content */}
                <div className="pt-6">{children}</div>
            </div>
        </div>
    );
}
