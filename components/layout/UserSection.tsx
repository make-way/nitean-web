'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';

interface UserSectionProps {
  user: {
    name: string;
    image?: string | null;
    level: string;
    username: string;
  } | null;
}

export function UserSection({ user }: UserSectionProps) {
  if (!user) {
    return;
  }

  return (
    <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3">
        <Image 
            src={user.image || '/avatar.png'} 
            alt={user.name} 
            width={40} 
            height={40} 
            className="rounded-full bg-zinc-100 w-10 h-10"
            loading="lazy"
        />
        <Link href={`/${user.username}/profile`}>
          <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{user.level}</p> 
          </div>
        </Link>
      </div>
      <button 
          onClick={() => signOut()}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all cursor-pointer"
      >
          <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
