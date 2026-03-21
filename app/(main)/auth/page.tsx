import { LoginButtons } from '@/components/auth/LoginButtons';
import Image from 'next/image';

export default async function Auth() {
  return (
    <aside className='sticky top-0 h-screen w-full flex-col gap-6 p-6'>
      <div className='flex flex-col items-center gap-6 p-10 text-center shadow-sm'>
           <Image src="/logo.svg" alt="nitean's logo" loading="lazy" width={64} height={64} />
        <div>
          <h3 className='mb-2 text-xl font-black text-zinc-900 dark:text-white'>Sign in to Nitean</h3>
          <p className='px-4 text-sm leading-relaxed text-zinc-500'>
            Join the community to discover amazing content and connect with people.
          </p>
        </div>

        <LoginButtons />
      </div>
    </aside>
  );
}
