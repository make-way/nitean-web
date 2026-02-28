import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileTabs from "@/components/ProfileTabs";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

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
                select: { posts: true }
            }
        }
    });

    if (!user) notFound();

    const isOwner = session?.user?.id === user.id;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-[1600px] mx-auto flex justify-center">
                {/* Left Sidebar */}
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                {/* Main Feed */}
                <main className="flex-1 max-w-[700px] min-h-screen border-x border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl px-4 py-8">
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
                            </div>

                            <p className="text-gray-500">@{username}</p>
                        </div>
                    </div>


                    <div className="flex gap-12 mb-8 px-4 border-b border-zinc-100 dark:border-zinc-800 py-4">
                        <button className="text-[17px] font-black text-zinc-900 dark:text-white border-b-4 border-indigo-600 pb-4 -mb-5">Profile</button>
                        <button className="text-[17px] font-black text-zinc-900 dark:text-white pb-4 -mb-5">Post</button>
                        <button className="text-[17px] font-black text-zinc-900 dark:text-white pb-4 -mb-5">Articles</button>
                        <button className="text-[17px] font-black text-zinc-900 dark:text-white pb-4 -mb-5">Media</button>
                    </div>

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
