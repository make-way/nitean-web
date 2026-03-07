'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, HelpCircle, Settings, Book, Newspaper, Plus } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export function NavLinks({ session: initialSession }: { session: any }) {
  const pathname = usePathname();
  const { data: clientSession } = useSession();
  
  // Use client-side session if available, otherwise fall back to server-side session
  const currentSession = clientSession !== undefined ? clientSession : initialSession;
  const isLoggedIn = !!currentSession;
  const username = currentSession?.user?.username;

  const navItems = useMemo(() => [
    { icon: Home, label: 'Home', href: '/' },
    // { icon: Book, label: 'Articles Sharing', href: `/articles` },
    { icon: Users, label: 'Members', href: '/members'},
    { icon: HelpCircle, label: 'Help & Support', href: '/help-and-support' },
    { icon: Settings, label: 'Settings', href: '/profile/settings', requiresAuth: true },
    { icon: Newspaper, label: 'Posts', href: `/${username}/posts` , requiresAuth: true },
    // { icon: Plus, label: 'Create Article', href: `/article/create` , requiresAuth: true },
  ], [username]);

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => !item.requiresAuth || isLoggedIn);
  }, [navItems, isLoggedIn]);

  return (
    <nav className="flex-1 space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`
              flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'}
            `}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`} />
            <span className="font-semibold text-[15px]">{item.label}</span>
            {item.label === 'Members' && (
              <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
