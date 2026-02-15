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
    });

    if (!user) notFound();

    const isOwner = session?.user?.id === user.id;

    return (
        <div className="relative min-h-screen bg-white">
            {/* Close button */}
            <Link
                href="/"
                aria-label="Close profile"
                className="fixed right-4 top-4 z-50 rounded-full p-2
                        text-gray-500 hover:text-gray-900
                        hover:bg-gray-100 transition"
            >
                <X className="h-5 w-5" />
            </Link>

            <div className="mx-auto max-w-3xl px-3 py-10">
                {/* Header */}
                <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-blue-500">
                    <Image
                    src={user.image || ""}
                    alt="Profile"
                    fill
                    className="object-cover"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold uppercase">{user.name}</h1>

                    {isOwner && (
                        <Link
                        href="/profile/settings"
                        aria-label="Edit profile"
                        className="rounded-md p-1 text-gray-500
                                    hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                        <Settings className="h-4 w-4" />
                        </Link>
                    )}
                    </div>

                    <p className="text-gray-500">@{username}</p>
                </div>
                </div>

                {/* Tabs */}
                <ProfileTabs username={username} />

                {/* Page content */}
                {children}
            </div>
        </div>
    );
}
