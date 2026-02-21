'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, BarChart2, FileText, Settings, Cookie, PlusSquareIcon, FileSliders, Users2, Menu, X, Globe, GlobeLock } from 'lucide-react';
import { signIn, signOut, useSession } from '@/lib/auth-client';
import MenuItem from './MenuItem';

type HeaderProps = {
  sticky?: boolean;
};

export default function Header({ sticky = true }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
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
    <header
      className={`${sticky ? 'sticky top-0 z-50' : ''} flex h-14 border-b border-zinc-200 bg-white px-4 shadow-md dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='mx-auto flex w-full max-w-7xl'>
        <div className='relative flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-4 lg:gap-y-4'>
          {/* Left section: Hamburger + Logo */}
          <div className='flex items-center'>
            <button onClick={toggleMenu} className='cursor-pointer' aria-label='Toggle menu'>
              <Menu />
            </button>

            <Link href='/' className='ml-6 flex items-center gap-3'>
              <Image src='/favicon.ico' alt='Logo' width={36} height={36} />
              <span className='text-xl font-bold text-black dark:text-white'>Nitean</span>
            </Link>
          </div>

          {/* Search bar – visible on all sizes, but width adjusts */}
          {/* <div className='flex h-10 min-w-[40%] items-center rounded-sm border border-transparent bg-gray-100 px-4 transition-all focus-within:border-black focus-within:bg-transparent max-md:order-1 max-md:w-full lg:w-2/4'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192.904 192.904' className='mr-4 h-4 w-4 fill-gray-400'>
              <path d='m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z' />
            </svg>
            <input type='text' placeholder='Search on Nitean...' className='w-full bg-transparent text-sm text-slate-900 outline-none' />
          </div> */}

          {/* Right icons */}
          <div ref={dropdownRef} className='ml-auto flex items-center gap-2'>
            {session ? (
              <>
                <Link
                  href='/post/create'
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                >
                  <PlusSquareIcon size={18} />
                </Link>
                {/* <Link href="#" className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'><Bell size={18}/></Link> */}

                {/* Avatar */}
                <button onClick={() => setProfileOpen(!profileOpen)} className='cursor-pointer'>
                  <Image
                    src={session.user.image || '/avatar.png'}
                    alt={session.user.name}
                    width={36}
                    height={36}
                    className='rounded-full'
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className='absolute top-14 right-4 w-72 rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
                    <div className='px-4 py-3'>
                      <p className='text-sm font-semibold'>{session.user.name}</p>
                      <p className='text-xs text-zinc-500'>{session.user.email}</p>
                    </div>

                    <div className='h-px bg-zinc-200 dark:bg-zinc-600' />

                    <div className='py-2 text-sm'>
                      <MenuItem icon={<User size={16} />} label='Profile' url={`/${session.user.username}`} />
                      <MenuItem icon={<BarChart2 size={16} />} label='Insights' url='/insight' />
                    </div>

                    <div className='h-px bg-zinc-200 dark:bg-zinc-800' />

                    <div className='py-2 text-sm'>
                      <MenuItem icon={<FileSliders size={16} />} label='Articles' url={`/${session.user.username}/posts`} />
                      <MenuItem icon={<FileText size={16} />} label='Create Article' url='/post/create' />
                    </div>

                    <div className='h-px bg-zinc-200 dark:bg-zinc-800' />

                    <div className='py-2 text-sm'>
                      <MenuItem icon={<Settings size={16} />} label='Settings' url='/profile/settings' />
                    </div>

                    <div className='px-4 py-3'>
                      <button
                        onClick={() => signOut()}
                        className='w-full rounded-xl bg-red-500/10 py-2 text-sm text-red-500 hover:bg-red-500/20'
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
                  className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'
                >
                  <Image src={`/${provider}.svg`} alt={provider} width={18} height={18} className={provider === 'github' ? 'invert' : ''} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* ─── Mobile Sidebar / Drawer ─── */}
        <div
          className={`fixed inset-0 z-100 transition-opacity duration-300 ${
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/40' onClick={toggleMenu} />

          {/* Sidebar panel */}
          <div
            className={`fixed top-0 left-0 h-full w-full max-w-full transform bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-4/5 sm:max-w-xs dark:bg-zinc-900 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className='flex items-center justify-between border-b p-4'>
              <Link href='/' className='flex gap-3'>
                <Image src='/favicon.ico' alt='Logo' width={36} height={36} />
                <span className='text-xl font-bold text-black dark:text-white'>Nitean</span>
              </Link>
              <button
                onClick={toggleMenu}
                className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white'
                aria-label='Close menu'
              >
                <X className='text-black' />
              </button>
            </div>

            <ul className='flex flex-col space-y-3 p-4'>
              {/* <div className='h-px bg-zinc-200 dark:bg-zinc-800' /> */}

              <div className='py-2 text-sm'>
                <MenuItem icon={<Cookie size={16} />} label='Club Discuss' url='/club' />
                <MenuItem icon={<Users2 size={16} />} label='Members' url='/members' />
              </div>
              <div className='h-px bg-zinc-200 dark:bg-zinc-800' />
              <div className='py-2 text-sm'>
                <MenuItem icon={<GlobeLock size={16} />} label='Privacy' url='/privacy' />
              </div>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
