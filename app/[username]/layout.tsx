import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProfileTabs from "@/components/ProfileTabs";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

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
        include: {
            _count: {
                select: { articles: true }
            }
        }
    });

    if (!user) notFound();

    const isOwner = session?.user?.id === user.id;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-400 mx-auto flex justify-center">
                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Main Feed */}
                <main className="flex-1 max-w-175 min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-6 px-3 pt-8">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-blue-500">
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
                            </div>

                            <p className="text-gray-500">@{username}</p>
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

                {/* Right Sidebar */}
                <RightSidebar />
            </div>
        </div>
    );
}
