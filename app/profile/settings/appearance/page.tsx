'use client';

import { Sun, Moon, Monitor } from "lucide-react";
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
      {/* Theme buttons */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <ThemeButton icon={<Sun />} label="Light" />
        <ThemeButton icon={<Moon />} label="Dark" />
        <ThemeButton icon={<Monitor />} label="System" active />
      </div>

      {/* Toggles */}
      <div className="space-y-6">
        <ToggleItem label="Wrap Long Lines For Code Blocks By Default" />
        <ToggleItem label="Show Conversation Previews in History" enabled />
        <ToggleItem label="Enable Starry Background" enabled />
      </div>
    </>
  );
}

function ThemeButton({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-2 rounded-2xl border p-6 text-sm font-medium transition
        ${
          active
            ? "border-gray-900 bg-gray-100 text-gray-900"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        }`}
    >
      {icon}
      {label}
    </button>
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
