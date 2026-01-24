'use client';

import Image from 'next/image';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session === null) {
      router.replace('/');
    }
  }, [isPending, session, router]);

  if (isPending) return null;
  if (!session) return null;

  return (
    <div className='space-y-6'>
      {/* Header banner */}
      <div className='relative flex h-32 items-center justify-center rounded-xl bg-linear-to-r from-blue-400 to-blue-800'>
        <p className='font-bold text-white'>Coming Soon</p>
      </div>

      {/* Profile header */}
      <div className='-mt-12 flex items-center justify-between px-6'>
        <div className='flex items-center gap-4'>
          <div className='z-10 h-20 w-20 overflow-hidden rounded-full border-3 border-blue-500 bg-gray-700'>
            <Image src={session?.user.image || ''} alt='User avatar' width={80} height={80} />
          </div>

          <div className='py-6'>
            <h2 className='text-lg font-semibold uppercase'>{session?.user.name}</h2>
            <span>@{session?.user.username}</span>
          </div>
        </div>
      </div>

      {/* Account info card */}
      <div className='rounded-xl bg-gray-900 p-6 text-sm text-gray-200'>
        <AccountRow label='Display Name' value={session?.user.name} action='Edit' />

        <Divider />

        <AccountRow label='Username' value={session.user.username} action='Edit' />

        <Divider />

        <AccountRow label='Email' value={session.user.email} action='Edit' />

        <Divider />

        <AccountRow label='Phone Number' value='0123456789'  secondaryAction='Remove' action='Edit' />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function AccountRow({
  label,
  value,
  action,
  secondaryAction,
  extra,
}: {
  label: string;
  value: string;
  action: string;
  secondaryAction?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-between py-3'>
      <div>
        <p className='text-xs text-gray-400 uppercase'>{label}</p>
        <p className='mt-1 flex items-center gap-2 text-gray-100'>
          {value}
          {extra}
        </p>
      </div>

      <div className='flex items-center gap-3'>
        {secondaryAction && <button className='text-xs text-red-400 hover:underline cursor-pointer'>{secondaryAction}</button>}

        <button className='rounded-md bg-gray-800 px-3 py-1 text-xs hover:bg-gray-700 cursor-pointer'>{action}</button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className='my-1 h-px bg-gray-800' />;
}

function Reveal() {
  return <button className='text-xs text-indigo-400 hover:underline'>Reveal</button>;
}
