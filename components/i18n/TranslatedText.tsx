"use client";

import { useTranslation } from "react-i18next";

interface TranslatedTextProps {
    translationKey: string;
}

export default function TranslatedText({ translationKey }: TranslatedTextProps) {
    const { t } = useTranslation();
    return <>{t(translationKey)}</>;
}
