import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface AboutContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();

  const modalTitle =
    language === 'en'
      ? 'About & Contact'
      : language === 'ja'
      ? 'サービス紹介とお問い合わせ'
      : language === 'zh'
      ? '服务介绍与联系咨询'
      : '서비스 소개 및 문의';

  const appTitle =
    language === 'en'
      ? 'My Love Sudoku'
      : language === 'ja'
      ? '愛しの数独 (My Love Sudoku)'
      : language === 'zh'
      ? '挚爱数独 (My Love Sudoku)'
      : '내사랑 스도쿠 (My Love Sudoku)';

  const editionText =
    language === 'en'
      ? 'HongLab AI Original Edition · v1.0.0'
      : language === 'ja'
      ? 'HongLab AI オリジナルエディション · v1.0.0'
      : language === 'zh'
      ? 'HongLab AI 原创典藏版 · v1.0.0'
      : 'HongLab AI 오리지널 에디션 · v1.0.0';

  const missionTitle =
    language === 'en'
      ? 'Our Vision'
      : language === 'ja'
      ? 'サービスのコンセプト'
      : language === 'zh'
      ? '服务宗旨'
      : '서비스 지향점';

  const missionDesc =
    language === 'en'
      ? "'My Love Sudoku' brings the serene tranquility of ink-wash paintings to busy modern lives, offering a beautifully crafted brain-training platform for focus and logical reflection."
      : language === 'ja'
      ? '「愛しの数独」は、忙しい現代人に水墨画の静寂と優雅な余白を届け、誰でも着実に脳トレと集中力を養えるよう丁寧に作られた本格数独プラットフォームです。'
      : language === 'zh'
      ? '《挚爱数独》为繁忙的现代人呈献传统水墨的幽静与从容，是一款旨在让每位玩家循序渐进锻炼大脑、提升专注力的匠心益智平台。'
      : "'내사랑 스도쿠'는 바쁜 현대인들에게 고요한 먹향과 전통 화조도의 여유를 선사하며, 누구나 차근차근 두뇌를 훈련하고 집중력을 기를 수 있도록 정성스럽게 제작된 웰메이드 퍼즐 플랫폼입니다.";

  const contactTitle =
    language === 'en'
      ? 'Operations & Customer Inquiries'
      : language === 'ja'
      ? '運営チーム及びお問い合わせ'
      : language === 'zh'
      ? '运营团队与客户咨询'
      : '운영팀 및 고객 문의 안내';

  const welcomeText =
    language === 'en'
      ? 'Bug reports, stage suggestions, partnerships, and advertising inquiries are always welcome.'
      : language === 'ja'
      ? 'バグ報告、ステージ提案、提携および広告に関するお問い合わせを歓迎いたします。'
      : language === 'zh'
      ? '欢迎随时提交缺陷反馈、关卡建议、商业合作及广告咨询。'
      : '버그 제보 / 스테이지 건의 / 제휴 및 광고 문의 등 언제든 환영합니다.';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`ℹ️ ${modalTitle}`} maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-indigo-100 dark:border-slate-700 text-center">
          <div className="text-2xl mb-1">🎋</div>
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            {appTitle}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            {editionText}
          </p>
        </div>

        <section className="space-y-1.5">
          <h5 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            {missionTitle}
          </h5>
          <p className="text-xs leading-relaxed">
            {missionDesc}
          </p>
        </section>

        <section className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-slate-100">
            {contactTitle}
          </h5>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <p>• {language === 'en' ? 'Domain' : language === 'ja' ? 'ドメイン' : language === 'zh' ? '服务域名' : '서비스 도메인'}: <a href="https://sudoku.honglabai.com" className="text-blue-600 dark:text-blue-400 font-medium underline">https://sudoku.honglabai.com</a></p>
            <p>• {language === 'en' ? 'Development & Operations' : language === 'ja' ? '開発・運営' : language === 'zh' ? '开发与运营' : '개발 및 운영'}: HongLab AI (홍랩)</p>
            <p>• {language === 'en' ? 'Official Site' : language === 'ja' ? '公式サイト' : language === 'zh' ? '官方网址' : '공식 웹사이트'}: <a href="https://honglabai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">https://honglabai.com</a></p>
            <p>
              • {language === 'en' ? 'Email Support' : language === 'ja' ? 'メール窓口' : language === 'zh' ? '邮箱咨询' : '이메일 문의'}:{' '}
              <a
                href="mailto:contact@honglabai.com"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                contact@honglabai.com
              </a>
            </p>
            <p className="text-[11px] text-slate-500 pt-0.5">• {welcomeText}</p>
          </div>
        </section>

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
