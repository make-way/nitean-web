"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs({ username }: { username: string }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Posts", href: `/${username}/posts`, active: pathname === `/${username}/posts` || pathname === `/${username}` },
        { name: "Replies", href: `/${username}/replies`, active: pathname === `/${username}/replies` },
        { name: "Media", href: `/${username}/media`, active: pathname === `/${username}/media` },
        { name: "Videos", href: `/${username}/videos`, active: pathname === `/${username}/videos` },
        { name: "Likes", href: `/${username}/likes`, active: pathname === `/${username}/likes` },
        { name: "Feeds", href: `/${username}/feeds`, active: pathname === `/${username}/feeds` },
        { name: "Starter Packs", href: `/${username}/starter-packs`, active: pathname === `/${username}/starter-packs` },
        { name: "Lists", href: `/${username}/lists`, active: pathname === `/${username}/lists` },
    ];

    return (
        <div className="mt-4 border-b overflow-x-auto no-scrollbar scrollbar-hide">
            <div className="flex min-w-max gap-6 text-sm font-medium px-4">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`pb-3 transition whitespace-nowrap ${
                            tab.active
                                ? "border-b-2 border-blue-500 text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400"
                        }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}