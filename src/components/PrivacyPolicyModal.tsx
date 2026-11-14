import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();

  const title =
    language === 'en'
      ? 'Privacy Policy'
      : language === 'ja'
      ? 'プライバシーポリシー'
      : language === 'zh'
      ? '隐私政策'
      : '개인정보처리방침';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`🛡️ ${title}`} maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {language === 'en' ? (
          <>
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl">
              <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                'My Love Sudoku' strictly complies with global data privacy standards and Google AdSense program policies to protect user freedom and rights.
              </p>
            </div>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                1. Personal Data & Storage Method
              </h4>
              <p>
                My Love Sudoku <strong>never requires user sign-up or accounts, and does not collect or store any personally identifiable information (name, phone, email, etc.) on any external server.</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Local-Only Storage:</strong> Game progress, stars, achievements, sound, and theme settings are kept solely in your device's browser LocalStorage.
                </li>
                <li>
                  <strong>Data Deletion:</strong> You can completely erase all data anytime via 'Reset Data' in settings or by clearing your browser cache.
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                2. Google AdSense & Third-Party Cookies
              </h4>
              <p>
                To provide quality puzzle entertainment completely free of charge, this website may serve ads via <strong>Google AdSense</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  Google and certified third-party vendors use <strong>cookies</strong> to serve ads based on prior visits to this or other websites.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting Google Ads Settings (www.aboutads.info).
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                3. Contact Privacy Officer
              </h4>
              <p>
                For questions regarding privacy, please contact HongLab AI at <a href="mailto:contact@honglabai.com" className="text-blue-600 dark:text-blue-400 underline">contact@honglabai.com</a>.
              </p>
            </section>
          </>
        ) : language === 'ja' ? (
          <>
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl">
              <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                「愛しの数独」は、利用者のプライバシー保護のため、各種個人情報保護法令およびGoogle AdSenseプログラムポリシーを厳格に遵守します。
              </p>
            </div>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                1. 収集する個人情報および保存方式
              </h4>
              <p>
                本サービスは <strong>会員登録を必要とせず、個人を識別できる情報（氏名、電話番号等）を外部サーバーに収集・保存することはありません。</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>ローカル保存：</strong> ステージ記録、星数、実績、音声設定等はすべて端末のブラウザ内（LocalStorage）にのみ保持されます。
                </li>
                <li>
                  <strong>データ消去：</strong> 設定内の「データ初期化」またはブラウザのキャッシュ削除により、いつでも完全に消去可能です。
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                2. Google AdSense 及びクッキー（Cookie）について
              </h4>
              <p>
                パズルを完全無料で提供するため、Google Inc.が提供する <strong>Google AdSense</strong> による広告を掲載する場合があります。
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  Googleおよび第三者配信事業者は、利用者の過去のアクセス情報に基づいて最適な広告を配信するために <strong>Cookie</strong> を使用します。
                </li>
                <li>
                  パーソナライズ広告の無効化は、Google広告設定ページ（www.aboutads.info）より設定可能です。
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                3. お問い合わせ窓口
              </h4>
              <p>
                個人情報およびプライバシーに関するご質問は、HongLab AI（<a href="mailto:contact@honglabai.com" className="text-blue-600 dark:text-blue-400 underline">contact@honglabai.com</a>）までご連絡ください。
              </p>
            </section>
          </>
        ) : language === 'zh' ? (
          <>
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl">
              <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                《挚爱数独》严格遵守个人信息保护法律规范及谷歌AdSense合作规范，切实保障用户的合法权益与隐私安全。
              </p>
            </div>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                1. 个人信息收集与数据存储方式
              </h4>
              <p>
                挚爱数独 <strong>无需任何用户注册，亦绝不会在服务器端收集或保存您的任何个人身份信息（如姓名、手机号等）。</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>本地存储机制：</strong> 关卡进度、获得星级、成就徽章及音效偏好等数据，仅保存在您本地设备的浏览器LocalStorage中。
                </li>
                <li>
                  <strong>数据清除权：</strong> 您随时可通过个人主页中的“重置数据”按钮或清理浏览器缓存彻底清除全部记录。
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                2. 谷歌AdSense广告与Cookie政策
              </h4>
              <p>
                为了全面免费向玩家提供优质数独内容，本平台展示由Google Inc.提供的 <strong>Google AdSense</strong> 网络广告。
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  Google及经过认证的第三方广告商使用 <strong>Cookie</strong> 技术，根据用户访问本网站或互联网的记录投放个性化广告。
                </li>
                <li>
                  用户可通过访问谷歌广告设置（www.aboutads.info）随时停用个性化广告推荐。
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                3. 隐私联络专员
              </h4>
              <p>
                如有任何隐私相关疑问，请随时联系 HongLab AI 团队（<a href="mailto:contact@honglabai.com" className="text-blue-600 dark:text-blue-400 underline">contact@honglabai.com</a>）。
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl">
              <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                '내사랑 스도쿠'는 정보주체의 자유와 권리 보호를 위해 개인정보보호법 및 구글 애드센스(Google AdSense) 프로그램 정책을 철저히 준수합니다.
              </p>
            </div>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                1. 수집하는 개인정보 항목 및 저장 방식
              </h4>
              <p>
                내사랑 스도쿠는 <strong>별도의 회원가입이나 개인 식별 정보(이름, 주민번호, 전화번호 등)를 요구하거나 서버에 수집·저장하지 않습니다.</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>로컬 데이터 저장:</strong> 퍼즐 클리어 기록, 획득 별점, 누적 업적, 오디오/테마 설정 등은 이용자의 단말기 내부(웹 브라우저의 LocalStorage)에만 보관됩니다.
                </li>
                <li>
                  <strong>데이터 삭제:</strong> 마이페이지의 '데이터 초기화' 버튼을 누르거나 브라우저 캐시를 삭제하시면 언제든지 즉시 완전 삭제됩니다.
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                2. 구글 애드센스(Google AdSense) 및 제3자 쿠키 정책
              </h4>
              <p>
                본 웹사이트는 양질의 퍼즐 콘텐츠를 전면 무료로 제공하기 위하여 Google Inc.가 제공하는 웹 광고 서비스인 <strong>구글 애드센스(Google AdSense)</strong>를 게재할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                <li>
                  Google 및 공인된 제3자 광고 공급업체는 사용자가 본 사이트 또는 다른 웹사이트를 방문한 과거 기록을 바탕으로 맞춤형 광고를 게재하기 위해 <strong>쿠키(Cookie)</strong>를 사용합니다.
                </li>
                <li>
                  사용자는 브라우저 쿠키 차단 기능 또는 구글 광고 설정(www.aboutads.info)을 통해 언제든지 맞춤형 광고 수신을 거부할 수 있습니다.
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                3. 개인정보 보호책임자 및 문의처
              </h4>
              <p>
                개인정보 처리 및 고충 사항과 관련된 문의는 HongLab AI 운영팀(<a href="mailto:contact@honglabai.com" className="text-blue-600 dark:text-blue-400 underline font-medium">contact@honglabai.com</a>)으로 연락해 주시기 바랍니다.
              </p>
            </section>
          </>
        )}

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
