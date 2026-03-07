"use client";

import { ReactNode, useEffect, useState } from "react";
import "@/lib/i18n/config"; // Initialize i18n
import { useTranslation } from "react-i18next";

export function I18nProvider({ children }: { children: ReactNode }) {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid hydration mismatch by waiting for mount
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return <>{children}</>;
}
