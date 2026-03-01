'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Book, Users, LogIn } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import Image from 'next/image';

export function MobileBottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const username = session?.user?.username;

    const tabs = [
        { icon: Home, href: '/', id: 'home' },
        { icon: Book, href: '/articles', id: 'explore' },
        { icon: Users, href: '/members', id: 'members' },
        { icon: LogIn, href: username ? `/${username}` : '/auth', isAvatar: true, id: 'profile' },
    ];

    return (
        <>
            {/* Floating Action Button (FAB) relative to Bottom Nav */}
            {/* <div className="fixed bottom-[80px] right-4 z-50 md:hidden">
                <Link href="/article/create" className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform active:scale-95">
                    <Plus className="w-7 h-7" />
                </Link>
            </div> */}

            <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 z-50 flex items-center justify-around px-2 md:hidden">
                {tabs.map((tab) => {
                    let isActive = pathname === tab.href;
                    if (tab.id === 'profile' && pathname.startsWith(`/${username}`)) {
                        isActive = true;
                    }
                    if (tab.id === 'explore' && pathname.startsWith('/article')) {
                        isActive = true;
                    }

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className="p-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            {tab.isAvatar && session?.user ? (
                                <div className={`p-0.5 rounded-full flex items-center justify-center ${isActive ? 'bg-indigo-600' : 'bg-transparent'}`}>
                                    <Image src={session.user.image || '/avatar.png'} alt="Profile" width={26} height={26} className={`rounded-full w-8 h-8 ${isActive ? 'border-2 border-white dark:border-black' : ''}`} />
                                </div>
                            ) : (
                                <tab.icon className={`w-7 h-7 ${isActive ? 'text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white' : ''}`} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}
