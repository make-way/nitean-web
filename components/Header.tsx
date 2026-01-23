'use client';

import { signIn, signOut, useSession } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { User, BarChart2, FileText, Settings, Cookie } from 'lucide-react';
import MenuItem from './MenuItem';

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
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className='fixed top-2 z-50 w-full px-4'>
      {/* Floating container */}
      <div className='shadow-glass bg-primary/5 mx-auto flex h-20 max-w-7xl items-center justify-between rounded-2xl border border-white/10 backdrop-blur-xl'>
        {/* Left */}
        <Link href='/' className='flex items-center gap-3 px-4'>
          <Image src='/favicon.ico' alt='Logo' width={28} height={28} />
          <span className='hidden text-lg font-semibold text-white sm:block'>Nitean</span>
        </Link>

        {/* Search */}
        <div className='hidden flex-1 px-6 sm:flex'>
          <div className='bg-primary/30 flex w-full max-w-xl items-center rounded-full border border-white/10 px-4 py-2 backdrop-blur'>
            <input
              className='w-full bg-transparent text-sm text-white placeholder-white/50 outline-none'
              placeholder='Search anything...'
            />
            <button className='ml-3 rounded-full bg-white/10 px-4 py-1 text-sm text-white transition hover:bg-white/20'>Search</button>
          </div>
        </div>

        {/* Right */}
        <div className='relative flex items-center gap-3 px-4 text-white' ref={dropdownRef}>
          {session ? (
            <>
              <Link
                href='/post/create'
                className='hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20 sm:flex'
              >
                + Create
              </Link>

              {/* Avatar */}
              <button onClick={() => setProfileOpen(!profileOpen)} className='group relative'>
                <Image
                  src={session.user.image || '/avatar.png'}
                  alt={session.user.name}
                  width={36}
                  height={36}
                  className='rounded-full border border-white/20 transition group-hover:scale-105'
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className='animate-in fade-in zoom-in shadow-glass absolute top-full right-0 mt-3 w-72 origin-top-right rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl'>
                  {/* User info */}
                  <div className='px-4 py-3'>
                    <p className='text-sm font-semibold text-white uppercase'>{session.user.name}</p>
                    <p className='text-xs text-white/60'>{session.user.email}</p>
                  </div>

                  <div className='h-px bg-white/10' />

                  <div className='py-2 text-sm'>
                    <MenuItem icon={<User size={16} />} label='Profile' url={session.user.name} />
                    <MenuItem icon={<BarChart2 size={16} />} label='Profile Insight' url='/insight' />
                  </div>

                  <div className='h-px bg-white/10' />

                  <div className='py-2 text-sm'>
                    <MenuItem icon={<FileText size={16} />} label='Create Article' badge='Beta' url='/post/create' />
                    <MenuItem icon={<FileText size={16} />} label='Articles' badge='Beta' url={`/${session.user.name}/posts`} />
                    <MenuItem icon={<Cookie size={16} />} label='Club Discuss' badge='Beta' url={`/${session.user.name}/posts`} />
                  </div>

                  <div className='h-px bg-white/10' />

                  <div className='py-2 text-sm'>
                    <MenuItem icon={<Settings size={16} />} label='Settings' url='/profile/settings' />
                  </div>

                  <div className='px-4 py-3'>
                    <button
                      onClick={() => signOut()}
                      className='w-full rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20'
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {['google', 'github'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => signIn.social({ provider })}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/20'
                >
                  <Image src={`/${provider}.svg`} alt={provider} width={18} height={18} className={provider === 'github' ? 'invert' : ''} />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
