import { auth } from '@/lib/auth';
import Image from 'next/image';
import ProfileTabs from '@/components/ProfileTabs';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Pen, X } from 'lucide-react';
import Link from 'next/link';

export default async function UserLayout({ children, params }: { children: React.ReactNode; params: Promise<{ username: string }> }) {
  const { username } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await prisma.user.findUnique({
    where: { username: username },
    include: { _count: { select: { posts: true } } },
  });

  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  return (
    <div className='relative min-h-screen bg-linear-to-b from-slate-50 to-white'>
      {/* Close button */}
      <Link
        href='/'
        aria-label='Close profile'
        className='fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-md'
      >
        <X className='h-5 w-5' />
      </Link>

      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8'>
          <div className='relative shrink-0'>
            <div className='relative h-24 w-24 overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-2 ring-white ring-offset-2 ring-offset-slate-50 sm:h-28 sm:w-28'>
              {user.image ? (
                <Image src={user.image} alt={user.name} fill className='object-cover' sizes='112px' priority />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-linear-to-br from-slate-300 to-slate-400 text-2xl font-bold text-white'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {user.level !== 'Basic' && (
              <span className='absolute -right-1 -bottom-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow'>
                {user.level}
              </span>
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl'>{user.name}</h1>
              {isOwner && (
                <Link
                  href='/profile/edit'
                  aria-label='Edit profile'
                  className='inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
                >
                  <Pen className='h-4 w-4' />
                </Link>
              )}
            </div>
            <p className='mt-1 font-medium text-slate-500'>@{username}</p>
            <p className='mt-2 text-sm text-slate-400'>
              {user._count.posts} article{user._count.posts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs username={username} />

        {/* Page content */}
        <div className='pt-6'>{children}</div>
      </div>
    </div>
  );
}
