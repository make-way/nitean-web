"use client";

import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "km", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "fil", name: "Filipino", flag: "🇵🇭" },
];

export function LanguageToggle() {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        document.documentElement.lang = lng;
    };

    const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

    return (
        <div className="flex items-center gap-2 mb-4 px-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="w-full h-11 justify-start gap-4 px-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border-none"
                    >
                        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <Languages className="w-[18px] h-[18px]" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                {currentLanguage.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-bold">
                                {t("common.language")}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-[100] w-48 rounded-2xl p-2 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-800 transition-colors"
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span className={`text-sm ${i18n.language === lang.code ? "font-bold text-indigo-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                                {lang.name}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
