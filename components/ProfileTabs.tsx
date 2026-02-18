'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();

  const isProfile = pathname === `/${username}`;
  const isArticles = pathname === `/${username}/posts`;

  const tabBase = 'relative pb-3 text-sm font-medium transition-colors';
  const tabActive = 'text-blue-600';
  const tabInactive = 'text-slate-500 hover:text-slate-900';

  return (
    <nav className='mt-8 border-b border-slate-200 sm:mt-10'>
      <div className='flex gap-6 sm:gap-10'>
        <Link href={`/${username}`} className={`${tabBase} ${isProfile ? tabActive : tabInactive}`}>
          Profile
          {isProfile && <span className='absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-blue-600' />}
        </Link>

        <Link href={`/${username}/posts`} className={`${tabBase} ${isArticles ? tabActive : tabInactive}`}>
          Articles
          {isArticles && <span className='absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-blue-600' />}
        </Link>
      </div>
    </nav>
  );
}
