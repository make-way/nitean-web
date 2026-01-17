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
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-black"
                }`}
                >
                Profile
                </Link>

                <Link
                href={`/${username}/posts`}
                className={`pb-3 transition ${
                    isArticles
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-black"
                }`}
                >
                Articles
                </Link>
            </div>
        </div>
    );
}
