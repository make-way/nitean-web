"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User, BarChart2, FileText, Settings, Cookie } from "lucide-react";
import MenuItem from "./MenuItem";

export default function Header() {
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Left */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3">
                    <Image src="/favicon.ico" alt="Logo" width={26} height={26} />
                    <span className="hidden text-lg font-semibold text-white sm:block">
                        Nitean
                    </span>
                </Link>

                {/* Center Search */}
                <div className="mx-3 hidden flex-1 sm:flex">
                <div className="flex w-full max-w-xl items-center rounded-full border border-white/10 bg-zinc-900 px-4 py-2">
                    <input
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-400 outline-none"
                    placeholder="Find anything"
                    />
                    <button className="ml-3 rounded-full bg-zinc-800 px-4 py-1 text-sm text-white hover:bg-zinc-700">
                    Search
                    </button>
                </div>
                </div>

                {/* Right */}
                <div className="relative flex items-center gap-2 sm:gap-4 text-zinc-300" ref={dropdownRef}>

                {session ? (
                    <>
                    <Link  href="/post/create" className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm sm:flex">
                        + Create
                    </Link>

                    {/* Avatar */}
                    <button onClick={() => setProfileOpen(!profileOpen)} className="cursor-pointer">
                        <Image
                        src={session.user.image || "/avatar.png"}
                        alt={session.user.name}
                        width={34}
                        height={34}
                        className="rounded-full border border-white/10 hover:opacity-80"
                        />
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/10 bg-zinc-900 shadow-lg">
                            {/* User info */}
                            <div className="px-4 py-3">
                                <p className="text-sm font-semibold text-zinc-100 uppercase">{session.user.name}</p>
                                <p className="text-xs text-white">{session.user.email}</p>
                            </div>

                            <div className="h-px bg-zinc-200" />

                            {/* Menu items */}
                            <div className="py-2 text-sm">
                                <MenuItem icon={<User size={16} />} label="Profile" url={session.user.name} />
                                <MenuItem icon={<BarChart2 size={16} />} label="Profile Insight" url="/insight" />
                            </div>

                            <div className="h-px bg-zinc-200" />

                            <div className="py-2 text-sm">
                                <MenuItem icon={<FileText size={16} />} label="Create Article" badge="Beta"  url={`/post/create`}/>
                                <MenuItem icon={<FileText size={16} />} label="Articles" badge="Beta" url={`/${session.user.name}/posts`}/>
                                <MenuItem icon={<Cookie size={16} />}  label="Club Discuss" badge="Beta" url={`/${session.user.name}/posts`}/>
                                {/* <MenuItem icon={<Folder size={16} />} label="Your Storage" /> */}
                            </div>

                            <div className="h-px bg-zinc-200" />

                            <div className="py-2 text-sm">
                                <MenuItem icon={<Settings size={16} />} label="Settings" url="/profile/settings" />
                            </div>

                            {/* Sign out */}
                            <div className="px-4 py-3">
                                <button onClick={() => signOut()} className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 cursor-pointer" >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                ) : (
                    <>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/10 cursor-pointer"
                        onClick={() => signIn.social({ provider: "google" })}
                    >
                        <Image src="/google.svg" alt="Google" width={18} height={18} />
                    </button>

                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:bg-white/10 cursor-pointer"
                        onClick={() => signIn.social({ provider: "github" })}
                    >
                        <Image src="/github.svg" alt="GitHub" width={18} height={18} className="invert" />
                    </button>
                    </>
                )}

                </div>
            </div>
        </header>
    );
}
