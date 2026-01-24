"use client";

import { useState } from "react";
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Define the type for available languages
type Language = "English" | "Khmer" | "French" | "Japanese" | "Korean" | "Filipino";

// Define the type for the fonts mapping
type LanguagesType = Record<Language, string[]>;

// Define the type for preview text function mapping
type PreviewTextType = Record<Language, (font: string) => string>;

const languages: LanguagesType = {
  English: ["Arial", "Times New Roman", "Courier New", "Georgia"],
  Khmer: ["Battambang", "Noto Sans Khmer", "Khmer OS", "Hanuman"],
  French: ["Comic Sans MS", "Verdana", "Trebuchet MS"],
  Japanese: ["Noto Sans JP", "Yu Gothic", "Meiryo"],
  Korean: ["Noto Sans KR", "Nanum Gothic", "Apple SD Gothic Neo", "Gothic A1"],
  Filipino: ["Arial", "Verdana", "Trebuchet MS", "Tahoma"]
};

const previewText: PreviewTextType = {
  English: (font) => `This is a preview in ${font} font!`,
  French: (font) => `Ceci est un aperçu en police ${font} !`,
  Japanese: (font) => `${font} フォントでのプレビューです！`,
  Khmer: (font) => `នេះ​ជា​ការ​មើល​ជាមុន​ជា​ពុម្ពអក្សរ ${font}!`,
  Korean: (font) => `${font} 글꼴 미리보기입니다!`,
  Filipino: (font) => `Ito ay preview sa font na ${font}!`
};

const Page: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [selectedFont, setSelectedFont] = useState<string>(languages["English"][0]);
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
    <div className="p-8 font-sans">
      {/* Language Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Select Language:</label>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            const lang = e.target.value as Language;
            setSelectedLanguage(lang);
            setSelectedFont(languages[lang][0]); // reset font when language changes
          }}
          className="border px-3 py-2 rounded"
        >
          {Object.keys(languages).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Font Cards */}
        <label className="block mb-2 font-semibold">Base Reading Font:</label> 
      <div className="grid grid-cols-2 gap-4">
        {languages[selectedLanguage].map((font) => (
          <div
            key={font}
            onClick={() => setSelectedFont(font)}
            className={`p-6 border rounded shadow text-center cursor-pointer transition
              ${selectedFont === font ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-500"}`}
            style={{ fontFamily: font }}
          >
            <p>{previewText[selectedLanguage](font)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
