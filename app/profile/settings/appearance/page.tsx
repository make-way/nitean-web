'use client';

import { Sun, Moon, Monitor } from "lucide-react";
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { updateThemeAction, getUserSettingsAction } from "@/server/actions/settings";
import { toast } from "sonner";

export default function AppearancePage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
        setMounted(true);
      if (!isPending && session === null) {
        router.replace('/');
      } else if (session) {
        // Fetch theme from DB and sync with next-themes
        getUserSettingsAction().then(result => {
            if (result.success && result.data?.theme) {
                setTheme(result.data.theme);
            }
        });
      }
    }, [isPending, session, router, setTheme]);
  
    if (isPending) return null;
    if (!session) return null;
    if (!mounted) return null;

    const handleThemeChange = async (newTheme: string) => {
        setTheme(newTheme);
        try {
            const result = await updateThemeAction(newTheme);
            if (result.success) {
                toast.success(`Theme updated to ${newTheme}`);
            } else {
                toast.error(result.message || "Failed to save theme preference");
            }
        } catch (error) {
            toast.error("An error occurred while updating theme");
        }
    };

  return (
    <>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <ThemeButton 
            icon={<Sun />} 
            label="Light" 
            active={theme === 'light'} 
            onClick={() => handleThemeChange('light')}
        />
        <ThemeButton 
            icon={<Moon />} 
            label="Dark" 
            active={theme === 'dark'} 
            onClick={() => handleThemeChange('dark')}
        />
        <ThemeButton 
            icon={<Monitor />} 
            label="System" 
            active={theme === 'system'} 
            onClick={() => handleThemeChange('system')}
        />
      </div>
    </>
  );
}

function ThemeButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-6 text-sm font-medium transition
        ${
          active
            ? "border-gray-900 bg-gray-100 text-gray-900 dark:border-white dark:bg-gray-800 dark:text-white"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}