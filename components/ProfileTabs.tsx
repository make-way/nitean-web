"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, Image as ImageIcon, UserCircle, Book } from "lucide-react";

export default function ProfileTabs({ username }: { username: string }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Profile", href: `/${username}/profile`, icon: UserCircle, active: pathname === `/${username}/profile` },
        { name: "Articles", href: `/${username}/articles`, icon: Book, active: pathname === `/${username}/articles` || pathname === `/${username}` },
        { name: "Posts", href: `/${username}/posts`, icon: Newspaper, active: pathname === `/${username}/posts` || pathname === `/${username}` },
        // { name: "Replies", href: `/${username}/replies`, icon: MessageSquare, active: pathname === `/${username}/replies` }, //in the future
        { name: "Media", href: `/${username}/media`, icon: ImageIcon, active: pathname === `/${username}/media` },
    ];

    return (
        <div className="sticky top-0 z-30 mt-8 border-b overflow-x-auto no-scrollbar scrollbar-hide border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex min-w-max gap-8 font-medium py-1 px-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`group flex items-center gap-2 pb-4 transition whitespace-nowrap text-[17px] font-black ${tab.active
                                    ? "border-b-4 border-indigo-600 text-zinc-900 dark:text-white pb-4 -mb-[2px]"
                                    : "text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                                }`}
                        >
                            <Icon
                                className={`w-5 h-5 transition ${tab.active
                                        ? "text-indigo-600"
                                        : "text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                    }`}
                            />
                            <span className="transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
