import Link from 'next/link';
import { 
  Search, 
  AlertCircle
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { NavLinks } from './NavLinks';
import { UserSection } from './UserSection';

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
      }
    });
  }

  return (
    <aside className="sticky top-0 h-screen w-72 flex flex-col p-6 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
          N
        </div>
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">nitean</span>
      </Link>

      {/* Search */}
      <div className="relative mb-8 px-2">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
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

      {/* User Profile */}
      <div className="px-2">
        <UserSection user={userData ? { ...userData, level: userData.level as string } : null} />
      </div>
    </aside>
  );
}
