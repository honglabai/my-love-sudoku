import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  isStandalone: boolean;
  onTriggerInstallPrompt?: () => Promise<void>;
  hasNativePrompt: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  isStandalone,
  onTriggerInstallPrompt,
  hasNativePrompt
}) => {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`📲 ${t('modal.installTitle')}`}>
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {isStandalone ? (
          <div className="text-center py-3">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-extrabold text-base text-blue-600 dark:text-blue-400">
              이미 홈 화면(앱)에 설치되어 있습니다!
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              홈 화면 아이콘을 통해 전체 화면으로 언제든 편리하게 즐기실 수 있습니다.
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/80 dark:bg-slate-800 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
              <span className="text-2xl">🍎</span>
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300">iPhone / iPad Safari 사용자</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  Safari의 '홈 화면에 추가' 기능으로 정식 앱처럼 설치할 수 있습니다.
                </div>
              </div>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 px-1">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span className="leading-tight pt-0.5">
                  Safari 브라우저 하단 중앙의 <strong>공유 버튼</strong>(
                  <span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">
                    [ ⎋ ]
                  </span>
                  )을 터치합니다.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span className="leading-tight pt-0.5">
                  나타난 공유 메뉴를 아래로 스크롤하여 <strong>'홈 화면에 추가 (+)'</strong> 항목을 선택합니다.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span className="leading-tight pt-0.5">
                  우측 상단의 <strong>'추가'</strong>를 누르면 스마트폰 바탕화면에 내사랑 스도쿠 앱 아이콘이 바로 생성됩니다!
                </span>
              </li>
            </ol>
          </div>
        ) : hasNativePrompt ? (
          /* Android / Chrome Native Prompt */
          <div className="space-y-3 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <img src="/icon-192.png" alt="앱 아이콘" className="w-12 h-12 rounded-xl object-cover" />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                내사랑 스도쿠를 앱으로 설치하시겠습니까?
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                바탕화면에 아이콘이 생성되어 브라우저 주소창 없이 전체 화면으로 더욱 쾌적하게 플레이할 수 있습니다.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={async () => {
                  if (onTriggerInstallPrompt) {
                    await onTriggerInstallPrompt();
                  }
                  onClose();
                }}
                className="font-bold shadow-md"
              >
                📲 지금 앱 설치하기
              </Button>
            </div>
          </div>
        ) : (
          /* Generic Android / Desktop Fallback */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">안드로이드 / PC 크롬 브라우저</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  브라우저 메뉴를 통해 홈 화면에 바로 추가하실 수 있습니다.
                </div>
              </div>
            </div>

            <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 px-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                <span>
                  브라우저 우측 상단의 <strong>더보기 메뉴 [ ⋮ ]</strong>를 터치합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                <span>
                  <strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong>를 누르면 바탕화면에 바로 설치됩니다.
                </span>
              </li>
            </ol>
          </div>
        )}

        <div className="pt-2 text-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
