'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppearancePage() {
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
    <>
      {/* Toggles */}
      <div className="space-y-6">
        <ToggleItem label="Allow to show your profile in Nitean members list" enabled />
      </div>
    </>
  );
}

function ToggleItem({
  label,
  enabled = false,
}: {
  label: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-800">{label}</span>
      <div
        className={`relative h-6 w-11 rounded-full transition ${
          enabled ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-5" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );
}
