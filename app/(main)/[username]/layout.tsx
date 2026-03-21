import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProfileTabs from "@/components/ProfileTabs";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import TranslatedText from "@/components/i18n/TranslatedText";
import { timeAgo } from "@/utils/TimeAgo";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const { username } = await params;
    const user = await prisma.user.findUnique({
        where: { username: username },
        select: { name: true, image: true }
    });

    if (!user) return { title: "User not found" };

    return {
        title: `${user.name} (@${username})`,
        description: `@${username}'s profile on Nitean`,
        icons: {
            icon: user.image || "/logo.svg",
        },
        openGraph: {
            title: `${user.name} (@${username})`,
            description: `@${username}'s profile on Nitean`,
            images: [user.image || ""],
        },
        twitter: {
            card: "summary_large_image",
            title: `${user.name} (@${username})`,
            description: `@${username}'s profile on Nitean`,
            images: [user.image || ""],
        },
    };
}

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
    const isOnline = (user as any).lastSeen ? (Date.now() - new Date((user as any).lastSeen).getTime() < 5 * 60 * 1000) : false;

    return (
        <main className="flex-1 max-w-175 min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-6 px-3 pt-8">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-blue-500">
                    <Image
                        src={user.image || ""}
                        alt="Profile"
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold uppercase">{user.name}</h1>
                    </div>

                    <p className="text-gray-500">@{username}</p>
                    {isOnline ? (
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                                <TranslatedText translationKey="label.online" />
                            </span>
                        </div>
                    ) : (user as any).lastSeen && (
                        <p className="text-xs text-zinc-400 mt-1 font-medium">
                            <TranslatedText translationKey="label.last_seen" /> {timeAgo((user as any).lastSeen)}
                        </p>
                    )}
                </div>
            </div>
            <p className='leading-relaxed text-gray-700 dark:text-gray-300 p-3'>{user.bio ?? ''}</p>


            <ProfileTabs username={username} />

            {/* Composer */}
            {/* <FeedComposer /> */}

            {/* Posts Feed */}
            <div className="space-y-6">
                {children}
            </div>
        </main>
    );
}
