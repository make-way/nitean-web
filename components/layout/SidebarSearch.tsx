"use client";

import { useTranslation } from "react-i18next";

export function SidebarSearch() {
    const { t } = useTranslation();
    return (
        <input
            type="text"
            placeholder={t("common.search") + "..."}
            className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
    );
}
