'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Hash, Settings } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { UserSection } from './UserSection';

import { usePathname } from 'next/navigation';

export function MobileNavigation({ session, userData }: { session: any, userData: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Check if on a profile path using regex (e.g. /Khav9, /Khav9/articles)
    const usernameLength = session?.user?.username?.length || 0;

    // Simplest logic: if not root, not strictly settings, not explore etc hide mobile top
    const isProfilePage = pathname !== '/' && !pathname.startsWith('/article') && !pathname.startsWith('/members');

    return (
        <>
            {/* Top Header */}
            {!isProfilePage && (
                <div className="fixed top-0 left-0 right-0 h-[60px] bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 z-50 flex items-center justify-between px-4 md:hidden">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2 text-zinc-900 dark:text-white focus:outline-none">
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link href="/" className="flex items-center gap-2">
                            <Image src="/favicon.ico" alt="Logo" width={28} height={28} />
                        </Link>
                    </div>

                    {
                        session?.user?.username?.length > 0 && (
                            <Link href="/profile/settings" className="p-2 -mr-2 text-zinc-900 dark:text-white">
                                <Settings className="w-6 h-6" />
                            </Link>
                        )
                    }
                </div>
            )}

            {/* Drawer Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300 border-r border-zinc-100 dark:border-zinc-800 z-50">
                        <div className="flex justify-between items-center mb-6">
                            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-2">
                                <Image src='/favicon.ico' alt='Logo' width={32} height={32} />
                                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">nitean</span>
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto" onClick={() => setIsOpen(false)}>
                            <NavLinks session={session} />
                        </div>

                        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <UserSection user={userData ? { ...userData, level: userData.level as string } : null} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
