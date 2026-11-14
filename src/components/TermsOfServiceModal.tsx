import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '../i18n';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();

  const title =
    language === 'en'
      ? 'Terms of Service'
      : language === 'ja'
      ? '利用規約'
      : language === 'zh'
      ? '服务条款'
      : '서비스 이용약관';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`📜 ${title}`} maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {language === 'en' ? (
          <>
            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                Article 1 (Purpose)
              </h4>
              <p>
                These Terms govern the rights, obligations, and responsibilities between users and HongLab AI regarding the puzzle service provided on 'My Love Sudoku' (https://sudoku.honglabai.com).
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                Article 2 (Free Service Provision)
              </h4>
              <p>
                1. This service is provided 100% free of charge to all users, including all 50 stages across 5 worlds, daily quests, and logic hints.<br />
                2. The service is available 24/7/365, though temporary interruptions may occur for server maintenance or upgrades.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                Article 3 (Intellectual Property)
              </h4>
              <p>
                1. All copyrights and intellectual property regarding artwork, wallpapers, calligraphy logos, UI elements, and puzzle algorithms belong to HongLab AI.<br />
                2. Commercial redistribution or unauthorized copying without prior written consent is strictly prohibited.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                Article 4 (Advertisements)
              </h4>
              <p>
                To maintain high-quality free service, third-party advertisements (such as Google AdSense) may be displayed in designated non-intrusive areas.
              </p>
            </section>
          </>
        ) : language === 'ja' ? (
          <>
            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第1条 (目的)
              </h4>
              <p>
                本規約は、HongLab AIが運営する「愛しの数独」（https://sudoku.honglabai.com）が提供するパズルゲームおよび関連サービスの利用条件を定めるものです。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第2条 (無料サービスの提供)
              </h4>
              <p>
                1. 本サービスはすべての利用者に完全無料で提供され、全50ステージ、デイリークエスト、論理ヒント等を自由にお楽しみいただけます。<br />
                2. サービスは原則として常時提供されますが、システム保守等により一時中断される場合があります。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第3条 (知的財産権の帰属)
              </h4>
              <p>
                1. 本サービス内の水墨画アート、書道ロゴ、音響、UIデザインおよびパズル生成エンジンに関する著作権は運用チームに帰属します。<br />
                2. 事前の許諾なく商用目的で複製・配布・転載することを固く禁じます。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第4条 (広告の掲載)
              </h4>
              <p>
                本サービスの健全かつ継続的な無料提供を維持するため、画面内にGoogle AdSense等の第三者広告を配信する場合があります。
              </p>
            </section>
          </>
        ) : language === 'zh' ? (
          <>
            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第一条（宗旨）
              </h4>
              <p>
                本条款旨在规定玩家与HongLab AI之间关于《挚爱数独》（https://sudoku.honglabai.com）平台服务使用的权利、义务与责任。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第二条（完全免费原则）
              </h4>
              <p>
                1. 本平台对所有玩家完全免费开放，包含5大世界共50关卡、每日挑战、逻辑提示等完整游戏内容。<br />
                2. 服务全天候提供，但在系统维护或升级时可能会短暂暂停。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第三条（知识产权保护）
              </h4>
              <p>
                1. 本服务创设的水墨壁纸、书法字体Logo、音频音效、UI界面及数独推理引擎之著作权均归运营团队所有。<br />
                2. 未经事先书面许可，严禁以任何商业营利目的进行复制、传播或盗用。
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                第四条（广告展示）
              </h4>
              <p>
                为维持长期优质的免费运营，平台将在不影响解题体验的外围区域适度展示谷歌AdSense等正规第三方广告。
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                제 1 조 (목적)
              </h4>
              <p>
                본 약관은 HongLab AI(홍랩)가 운영하는 '내사랑 스도쿠'(https://sudoku.honglabai.com, 이하 "서비스")가 제공하는 온라인 퍼즐 게임 및 관련 제반 서비스의 이용 조건 및 절차, 이용자와 서비스 제공자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                제 2 조 (서비스의 제공 및 무료 원칙)
              </h4>
              <p>
                1. 본 서비스는 모든 이용자에게 무료로 제공되며, 5개 월드 50개 스테이지, 일일 퀘스트, 레벨 테스트, 힌트 및 편의 아이템 등을 포함합니다.<br />
                2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 하나 시스템 점검이나 네트워크 장애 등의 사유로 일시 중단될 수 있습니다.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                제 3 조 (지식재산권의 보호)
              </h4>
              <p>
                1. 본 서비스가 창작한 수묵 담채화 배경, 캘리그래피 타이틀, 음향, UI 디자인, 퍼즐 알고리즘 등에 관한 저작권 및 기타 지식재산권은 운영팀에 귀속됩니다.<br />
                2. 이용자는 서비스를 이용함으로써 얻은 정보를 운영팀의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
                제 4 조 (광고의 게재)
              </h4>
              <p>
                1. 서비스의 원활하고 지속적인 무료 운영을 위해 서비스 화면 내에 구글 애드센스 등 제3자 광고가 게재될 수 있습니다.<br />
                2. 이용자가 서비스 상에 게재되어 있는 광고를 이용하거나 광고주와의 거래를 진행하는 것은 전적으로 이용자와 광고주 간의 문제입니다.
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
