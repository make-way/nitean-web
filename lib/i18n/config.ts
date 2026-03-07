"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "km", "fr", "ja", "ko", "fil"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18next;
