'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { updateThemeAction } from "@/server/actions/settings";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="mb-4 px-2">
                <div className="w-full h-11 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = async () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        try {
            await updateThemeAction(newTheme);
        } catch (error) {
            console.error("Failed to update theme preference", error);
        }
    };

    return (
        <div className="mb-6 px-2">
            <button
                onClick={toggleTheme}
                className="group relative flex w-full items-center gap-3 rounded-2xl p-1.5 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer"
            >
                <div className={`
          relative flex h-8 w-14 items-center rounded-full p-1 transition-all duration-500
          ${isDark
                        ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                        : 'bg-zinc-200 shadow-inner'}
        `}>
                    <div className={`
            flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-xl transition-all duration-500
            ${isDark ? 'translate-x-6 rotate-[360deg]' : 'translate-x-0 rotate-0'}
          `}>
                        {isDark ? (
                            <Moon className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600/10" />
                        ) : (
                            <Sun className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
                        )}
                    </div>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </span>
            </button>
        </div>
    );
}
