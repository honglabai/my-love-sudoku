import React, { useState, useEffect } from 'react';
import { InstallAppModal } from './InstallAppModal';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const TopHeader: React.FC = () => {
  const { t, language } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Listen for Android / Chromium PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsStandalone(true);
        }
      } catch {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <header className="w-full flex items-center justify-between gap-2 pt-1 pb-1 px-0.5 select-none min-h-[44px]">
        {/* Left: Scaled-down Title Image */}
        <div className="flex-1 flex items-center min-w-0">
          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-slate-800/80 shadow-xs bg-[#fbf9f5] dark:bg-slate-900 transition-all hover:scale-[1.01]">
            <img
              src={`/assets/logo/title_banner_${language}.webp`}
              alt={t('brand.title')}
              className="dark:hidden h-11 sm:h-12 w-auto max-w-[210px] sm:max-w-[260px] object-contain block select-none pointer-events-none"
            />
            <img
              src={`/assets/logo/title_banner_${language}_dark.webp`}
              alt={t('brand.title')}
              className="hidden dark:block h-11 sm:h-12 w-auto max-w-[210px] sm:max-w-[260px] object-contain block select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Right: Language Selector & Install App Button on the Same Row */}
        <div className="shrink-0 flex items-center gap-1.5">
          <LanguageSelector variant="header" />
          <button
            onClick={handleInstallClick}
            aria-label={t('modal.installTitle')}
            className={`flex items-center gap-1 px-2.5 py-1.5 min-h-[34px] rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all border ${
              isStandalone
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30'
            }`}
          >
            <span>📲</span>
            <span className="whitespace-nowrap">{isStandalone ? t('common.installed') : t('common.install')}</span>
          </button>
        </div>
      </header>

      {/* Install Instruction / Guide Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={isIOS}
        isStandalone={isStandalone}
        onTriggerInstallPrompt={deferredPrompt ? () => deferredPrompt.prompt() : undefined}
        hasNativePrompt={!!deferredPrompt}
      />
    </>
  );
};
