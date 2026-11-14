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
  const { t, language } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`📲 ${t('modal.installTitle')}`}>
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        {isStandalone ? (
          <div className="text-center py-3">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-extrabold text-base text-blue-600 dark:text-blue-400">
              {language === 'en'
                ? 'Already installed on your Home Screen!'
                : language === 'ja'
                ? 'すでにホーム画面（アプリ）に導入されています！'
                : language === 'zh'
                ? '已成功安装至桌面！'
                : '이미 홈 화면(앱)에 설치되어 있습니다!'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'en'
                ? 'Enjoy the distraction-free full-screen experience anytime from your home icon.'
                : language === 'ja'
                ? 'ホーム画面のアイコンからいつでもフルスクリーンで快適にお楽しみいただけます。'
                : language === 'zh'
                ? '您可随时点击主屏幕图标，享受无地址栏的全屏纯净体验。'
                : '홈 화면 아이콘을 통해 전체 화면으로 언제든 편리하게 즐기실 수 있습니다.'}
            </p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-blue-50/80 dark:bg-slate-800 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
              <span className="text-2xl">🍎</span>
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
                  {language === 'en' ? 'iPhone / iPad Safari Users' : language === 'ja' ? 'iPhone / iPad Safari ユーザー' : language === 'zh' ? 'iPhone / iPad Safari 用户' : 'iPhone / iPad Safari 사용자'}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {language === 'en'
                    ? 'Install like a real native app using Safari’s Add to Home Screen.'
                    : language === 'ja'
                    ? 'Safariの「ホーム画面に追加」機能でアプリのように追加できます。'
                    : language === 'zh'
                    ? '使用Safari的“添加到主屏幕”功能，如原生应用般快捷使用。'
                    : "Safari의 '홈 화면에 추가' 기능으로 정식 앱처럼 설치할 수 있습니다."}
                </div>
              </div>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 px-1">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span className="leading-tight pt-0.5">
                  {language === 'en' ? (
                    <>Tap the <strong>Share button</strong> (<span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">[ ⎋ ]</span>) at the bottom center of Safari.</>
                  ) : language === 'ja' ? (
                    <>Safariブラウザ下部中央の <strong>共有ボタン</strong>（<span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">[ ⎋ ]</span>）をタップします。</>
                  ) : language === 'zh' ? (
                    <>轻触Safari浏览器底部中央的 <strong>分享按钮</strong>（<span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">[ ⎋ ]</span>）。</>
                  ) : (
                    <>Safari 브라우저 하단 중앙의 <strong>공유 버튼</strong>(<span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">[ ⎋ ]</span>)을 터치합니다.</>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span className="leading-tight pt-0.5">
                  {language === 'en' ? (
                    <>Scroll down the menu and choose <strong>'Add to Home Screen (+)'</strong>.</>
                  ) : language === 'ja' ? (
                    <>メニューを下にスクロールし、<strong>「ホーム画面に追加 (+)」</strong> を選択します。</>
                  ) : language === 'zh' ? (
                    <>向下滚动菜单，选择 <strong>“添加到主屏幕 (+)”</strong>。</>
                  ) : (
                    <>나타난 공유 메뉴를 아래로 스크롤하여 <strong>'홈 화면에 추가 (+)'</strong> 항목을 선택합니다.</>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span className="leading-tight pt-0.5">
                  {language === 'en' ? (
                    <>Tap <strong>'Add'</strong> at the top right to place the app icon on your device home screen!</>
                  ) : language === 'ja' ? (
                    <>右上の <strong>「追加」</strong> を押すと、ホーム画面に数独アプリアイコンが生成されます！</>
                  ) : language === 'zh' ? (
                    <>点击右上角 <strong>“添加”</strong>，即可在桌面即时生成数独专属应用图标！</>
                  ) : (
                    <>우측 상단의 <strong>'추가'</strong>를 누르면 스마트폰 바탕화면에 내사랑 스도쿠 앱 아이콘이 바로 생성됩니다!</>
                  )}
                </span>
              </li>
            </ol>
          </div>
        ) : hasNativePrompt ? (
          /* Android / Chrome Native Prompt */
          <div className="space-y-3 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <img src="/icon-192.png" alt="App Icon" className="w-12 h-12 rounded-xl object-cover" />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {language === 'en'
                  ? 'Install My Love Sudoku as an app?'
                  : language === 'ja'
                  ? '「愛しの数独」をアプリとしてインストールしますか？'
                  : language === 'zh'
                  ? '是否将《挚爱数独》安装为桌面应用？'
                  : '내사랑 스도쿠를 앱으로 설치하시겠습니까?'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'en'
                  ? 'An icon will be added to your home screen for an uninterrupted full-screen experience.'
                  : language === 'ja'
                  ? 'ホーム画面にアイコンが作成され、ブラウザ枠なしの全画面で快適にプレイできます。'
                  : language === 'zh'
                  ? '将在主屏幕创建快捷图标，无网址栏全屏畅玩，体验更沉浸。'
                  : '바탕화면에 아이콘이 생성되어 브라우저 주소창 없이 전체 화면으로 더욱 쾌적하게 플레이할 수 있습니다.'}
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
                📲 {language === 'en' ? 'Install App Now' : language === 'ja' ? '今すぐアプリをインストール' : language === 'zh' ? '立即安装应用' : '지금 앱 설치하기'}
              </Button>
            </div>
          </div>
        ) : (
          /* Generic Android / Desktop Fallback */
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'en' ? 'Android / PC Chrome Browser' : language === 'ja' ? 'Android / PC Chrome ブラウザ' : language === 'zh' ? 'Android / PC Chrome 浏览器' : '안드로이드 / PC 크롬 브라우저'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'en'
                    ? 'You can easily add it to your home screen via the browser menu.'
                    : language === 'ja'
                    ? 'ブラウザメニューから簡単にホーム画面に追加できます。'
                    : language === 'zh'
                    ? '您可通过浏览器菜单直接添加至主屏幕。'
                    : '브라우저 메뉴를 통해 홈 화면에 바로 추가하실 수 있습니다.'}
                </div>
              </div>
            </div>

            <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 px-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                <span>
                  {language === 'en' ? (
                    <>Tap the <strong>More Menu [ ⋮ ]</strong> at the top right of the browser.</>
                  ) : language === 'ja' ? (
                    <>ブラウザ右上の <strong>メニュー [ ⋮ ]</strong> をタップします。</>
                  ) : language === 'zh' ? (
                    <>点击浏览器右上角的 <strong>更多菜单 [ ⋮ ]</strong>。</>
                  ) : (
                    <>브라우저 우측 상단의 <strong>더보기 메뉴 [ ⋮ ]</strong>를 터치합니다.</>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                <span>
                  {language === 'en' ? (
                    <>Choose <strong>[Install App]</strong> or <strong>[Add to Home Screen]</strong> to install instantly.</>
                  ) : language === 'ja' ? (
                    <><strong>[アプリをインストール]</strong> または <strong>[ホーム画面に追加]</strong> を選択します。</>
                  ) : language === 'zh' ? (
                    <>点击 <strong>【安装应用】</strong> 或 <strong>【添加到主屏幕】</strong> 即可快速安装。</>
                  ) : (
                    <><strong>[앱 설치]</strong> 또는 <strong>[홈 화면에 추가]</strong>를 누르면 바탕화면에 바로 설치됩니다.</>
                  )}
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
