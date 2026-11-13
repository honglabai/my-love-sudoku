import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, TranslationKey } from './types';
import { ko } from './locales/ko';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { zh } from './locales/zh';

const translationsMap: Record<Language, Record<string, string>> = {
  ko,
  en,
  ja,
  zh
};

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('my_love_sudoku_lang');
    if (saved && (saved === 'ko' || saved === 'en' || saved === 'ja' || saved === 'zh')) {
      return saved as Language;
    }

    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('zh')) return 'zh';
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('ko')) return 'ko';
    }
  } catch {
    // ignore
  }
  return 'ko';
}

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage,
  onLanguageChange
}) => {
  const [language, setLanguageState] = useState<Language>(() => initialLanguage || detectInitialLanguage());

  // If initialLanguage changes from outside props (e.g., loaded from storage)
  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('my_love_sudoku_lang', lang);
    } catch {
      // ignore
    }
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const t = useMemo(() => {
    return (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = translationsMap[language] || translationsMap.ko;
      let text = dict[key] || translationsMap.ko[key] || key;

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    };
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
