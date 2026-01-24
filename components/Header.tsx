'use client';

import { signIn, signOut, useSession } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  User,
  BarChart2,
  FileText,
  Settings,
  Cookie,
  PlusSquareIcon,
  FileSliders,
} from 'lucide-react';
import MenuItem from './MenuItem';

type HeaderProps = {
  sticky?: boolean;
};

export default function Header({ sticky = true }: HeaderProps) {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className={`${sticky ? 'sticky top-0 z-50' : ''} border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900`}>
      <div className="mx-auto flex h-14 max-w-[1400px] items-center px-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/favicon.ico" alt="Logo" width={36} height={36} />
          </Link>

          <div className="hidden sm:flex items-center rounded-full bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
            <input
              className="w-48 bg-transparent text-sm outline-none placeholder:text-zinc-500"
              placeholder="Search Nitean..."
            />
          </div>
        </div>

        {/* RIGHT */}
        <div
          ref={dropdownRef}
          className="ml-auto flex items-center gap-2"
        >
          {session ? (
            <>
              <Link href="/post/create" className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'><PlusSquareIcon size={18}/></Link>
              {/* <Link href="#" className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'><Bell size={18}/></Link> */}

              {/* Avatar */}
              <button onClick={() => setProfileOpen(!profileOpen)} className='cursor-pointer'>
                <Image
                  src={session.user.image || '/avatar.png'}
                  alt={session.user.name}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-4 top-14 w-72 rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-zinc-500">{session.user.email}</p>
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-600" />

                  <div className="py-2 text-sm">
                    <MenuItem icon={<User size={16} />} label="Profile" url={`/${session.user.username}`} />
                    <MenuItem icon={<BarChart2 size={16} />} label="Insights" url="/insight" />
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                  <div className="py-2 text-sm">
                    <MenuItem icon={<FileSliders size={16} />} label="Articles" url={`/${session.user.username}/posts`} />
                    <MenuItem icon={<FileText size={16} />} label="Create Article" url="/post/create" />
                    <MenuItem icon={<Cookie size={16} />} label="Club Discuss" url="/club" />
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                  <div className="py-2 text-sm">
                    <MenuItem icon={<Settings size={16} />} label="Settings" url="/profile/settings" />
                  </div>

                  <div className="px-4 py-3">
                    <button
                      onClick={() => signOut()}
                      className="w-full rounded-xl bg-red-500/10 py-2 text-sm text-red-500 hover:bg-red-500/20"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            ['google', 'github'].map((provider) => (
              <button
                key={provider}
                onClick={() => signIn.social({ provider })}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
              >
                <Image
                  src={`/${provider}.svg`}
                  alt={provider}
                  width={18}
                  height={18}
                  className={provider === 'github' ? 'invert' : ''}
                />
              </button>
            ))
          )}
        </div>
      </div>
    </header>
  );
}
