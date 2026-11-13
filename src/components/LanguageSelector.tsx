import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n, SUPPORTED_LANGUAGES, Language } from '../i18n';

interface LanguageSelectorProps {
  variant?: 'header' | 'settings';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SUPPORTED_LANGUAGES.map(item => {
          const isSelected = language === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-sm">{item.flag}</span>
                <span>{item.nativeLabel}</span>
              </span>
              {isSelected && <Check size={14} className="shrink-0" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Header compact pill variant
  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="언어 변경 / Change Language"
        className="flex items-center gap-1 px-2 py-1.5 min-h-[34px] rounded-xl text-xs font-bold bg-white/85 dark:bg-slate-900/85 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200/90 dark:border-slate-800 shadow-2xs active:scale-95 transition-all"
      >
        <Globe size={14} className="text-slate-500 dark:text-slate-400" />
        <span className="text-[11px] font-black uppercase tracking-wider">{currentOption.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-pop">
          {SUPPORTED_LANGUAGES.map(item => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
                  isSelected
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span>{item.nativeLabel}</span>
                </span>
                {isSelected && <Check size={13} className="text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
