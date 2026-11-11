import React, { useState, useEffect } from 'react';
import { InstallAppModal } from './InstallAppModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const TopHeader: React.FC = () => {
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
      <header className="w-full select-none pt-0 pb-0.5">
        {/* Top Utility Bar: Edition Indicator + Install App Button */}
        <div className="w-full flex items-center justify-between px-1 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>한국 수묵 담채화 에디션</span>
          </div>

          <button
            onClick={handleInstallClick}
            aria-label="앱 설치 및 바탕화면에 추가"
            className={`flex items-center gap-1 px-2.5 py-1 min-h-[28px] rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all border ${
              isStandalone
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30'
            }`}
          >
            <span>📲</span>
            <span className="whitespace-nowrap">{isStandalone ? '설치됨' : '앱 설치'}</span>
          </button>
        </div>

        {/* Title Banner Box: Matches the width ("폭과 넓이") and rounded card styling of other boxes */}
        <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all bg-[#fbf9f5] dark:bg-slate-900">
          <img
            src="/assets/logo/title_banner.webp"
            alt="내사랑 스도쿠"
            className="dark:hidden w-full h-auto block select-none pointer-events-none"
          />
          <img
            src="/assets/logo/title_banner_dark.webp"
            alt="내사랑 스도쿠"
            className="hidden dark:block w-full h-auto block select-none pointer-events-none"
          />
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
