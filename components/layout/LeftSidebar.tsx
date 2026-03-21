import Link from 'next/link';
import { Search } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { NavLinks } from './NavLinks';
import { UserSection } from './UserSection';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { SidebarSearch } from './SidebarSearch';
import Image from 'next/image';

export default async function LeftSidebar() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  let userData = null;
  if (session?.user?.id) {
    userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        image: true,
        level: true,
        username: true,
      }
    });
  }

  return (
    <aside className="sticky top-0 h-screen w-72 flex flex-col p-6 ">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 px-2">
        <Image src='/logo.svg' alt='Logo' width={48} height={48} />
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">nitean</span>
      </Link>

      {/* Search */}
      <div className="relative mb-8 px-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <SidebarSearch />
      </div>

      {/* Navigation */}
      <NavLinks session={session} />

      {/* Pro Banner */}
      {/* <div className="mt-auto mb-8 mx-2 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-50">
            <AlertCircle className="w-4 h-4 text-zinc-400" />
        </div>
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
          Enjoy unlimited access to our app.
        </p>
        <div className="flex items-center justify-between">
            <Link href="/sitemap" className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Site Map</Link>
        </div>
      </div> */}

      {/* Theme Toggle & User Profile */}
      <div className="mt-8 flex flex-col gap-1">
        <LanguageToggle />
        <ThemeToggle />
        <div className="mt-4 px-2">
          <UserSection user={userData ? { ...userData, level: userData.level as string, username: userData.username as string } : null} />
        </div>
      </div>
    </aside>
  );
}
