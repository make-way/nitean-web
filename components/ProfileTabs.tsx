"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs({ username }: { username: string }) {
    const pathname = usePathname();

    const isProfile = pathname === `/${username}`;
    const isArticles = pathname === `/${username}/posts`;

    return (
        <div className="mt-10 border-b">
            <div className="flex gap-8 text-sm font-medium">
                <Link
                href={`/${username}`}
                className={`pb-3 transition ${
                    isProfile
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                }`}
                >
                Profile
                </Link>

                <Link
                href={`/${username}/posts`}
                className={`pb-3 transition ${
                    isArticles
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                }`}
                >
                Articles
                </Link>
            </div>
        </div>
    );
}
