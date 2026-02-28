'use client';

import Image from 'next/image';
import { signIn } from '@/lib/auth-client';

export function LoginButtons() {
  return (
    <div className="w-full space-y-3 pt-2">
      <button 
        onClick={() => signIn.social({ provider: 'google' })}
        className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-2xl transition-all shadow-sm"
      >
        <Image src="/google.svg" alt="Google" width={20} height={20} />
        <span>Login with Google</span>
      </button>
      <button 
        onClick={() => signIn.social({ provider: 'github' })}
        className="w-full flex items-center justify-center gap-3 h-12 bg-zinc-900 text-white hover:bg-black font-bold rounded-2xl transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
      >
        <Image src="/github.svg" alt="GitHub" width={20} height={20} className="invert" />
        <span>Login with GitHub</span>
      </button>
    </div>
  );
}
