import React, { useState, useEffect } from 'react';
import { InstallAppModal } from './InstallAppModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface TopHeaderProps {
  onLevelTestClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onLevelTestClick }) => {
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
      <header className="w-full flex items-center justify-between gap-2 pt-1 pb-2 px-1 select-none">
        {/* Left: Title Logo Image */}
        <div className="flex-1 flex items-center">
          <img
            src="/assets/logo/title_logo.webp"
            alt="내사랑 스도쿠"
            className="dark:hidden h-10 sm:h-12 w-auto max-w-[210px] sm:max-w-[250px] object-contain drop-shadow-xs transition-transform duration-200 hover:scale-[1.02]"
          />
          <img
            src="/assets/logo/title_logo_dark.webp"
            alt="내사랑 스도쿠"
            className="hidden dark:block h-10 sm:h-12 w-auto max-w-[210px] sm:max-w-[250px] object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)] transition-transform duration-200 hover:scale-[1.02]"
          />
        </div>

        {/* Right: Install App Button */}
        <div className="shrink-0 flex items-center gap-1.5">
          {onLevelTestClick && (
            <button
              onClick={onLevelTestClick}
              aria-label="실력 측정 레벨 테스트"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs active:scale-95 transition-all"
            >
              <span>🎯</span>
              <span className="whitespace-nowrap">레벨테스트</span>
            </button>
          )}

          <button
            onClick={handleInstallClick}
            aria-label="앱 설치 및 바탕화면에 추가"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black shadow-xs active:scale-95 transition-all border ${
              isStandalone
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30'
            }`}
          >
            <span>📲</span>
            <span className="whitespace-nowrap">{isStandalone ? '설치됨' : '앱 설치'}</span>
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
