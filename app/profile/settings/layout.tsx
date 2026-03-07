"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, User, Palette, Sliders, GlobeLock, ArrowLeft } from "lucide-react";
import SidebarLink from "@/components/SidebarLink";
import useIsMobile from "@/hooks/useIsMobile";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useIsMobile();

    // Define menu items
    const menu = [
        { href: "/profile/settings/account", label: "Account", icon: <User size={18} /> },
        { href: "/profile/settings/appearance", label: "Appearance", icon: <Palette size={18} /> },
        { href: "/profile/settings/privacy", label: "Privacy", icon: <GlobeLock size={18} /> },
        { href: "/profile/settings/customize", label: "Customize", icon: <Sliders size={18} /> },
    ];

    // Detect if we are at the mobile root /settings
    const isRoot = pathname.replace(/\/$/, "") === "/profile/settings";

    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-black">
            {/* Close button */}
            <div
                onClick={() => router.back()}
                aria-label="Close settings"
                className="fixed top-4 right-4 z-50 rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
            >
                <X className="h-5 w-5" />
            </div>

            <div className="mx-auto max-w-5xl px-4 py-10">

                    <h1 className="text-2xl font-semibold text-black dark:text-white mb-8">Settings</h1>

                {isMobile ? (
                isRoot ? (
                    // Mobile: show menu list at /settings
                    <div className="space-y-3">
                    {menu.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm dark:bg-zinc-900"
                        >
                        {item.icon}
                        {item.label}
                        </Link>
                    ))}
                    </div>
                ) : (
                    <div className="bg-zinc-50 dark:bg-black">
                    {children}
                    <button
                        onClick={() => router.push("/profile/settings")}
                        className="font-bold mt-8 mb-4 text-sm text-blue-500 w-full bg-accent flex items-center justify-center py-1.5 cursor-pointer"
                    >
                        Back
                    </button>
                    </div>
                )
                ) : (
                // Desktop: always show sidebar + page content
                <div className="flex gap-8">
                    <aside className="w-48 space-y-2">
                    {menu.map((item) => (
                        <SidebarLink
                        key={item.href}
                        {...item}
                        active={pathname.startsWith(item.href)}
                        />
                    ))}
                    </aside>
                    <main className="flex-1 bg-zinc-50 dark:bg-black p-8 shadow-sm">{children}</main>
                </div>
                )}
            </div>
        </div>
    );
}