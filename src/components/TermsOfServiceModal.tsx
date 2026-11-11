import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📜 서비스 이용약관" maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-1.5">
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            제 1 조 (목적)
          </h4>
          <p>
            본 약관은 '내사랑 스도쿠'(이하 "서비스")가 제공하는 온라인 퍼즐 게임 및 관련 제반 서비스의 이용 조건 및 절차, 이용자와 서비스 제공자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
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

        <section className="space-y-1.5">
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            제 5 조 (면책조항)
          </h4>
          <p>
            1. 본 서비스는 단말기 환경, 브라우저 캐시 삭제, 이용자 부주의로 인해 손실된 게임 데이터에 대해 보상 책임을 지지 않습니다.<br />
            2. 운영팀은 천재지변, 불가항력적 기술 장애로 인한 서비스 중단에 대해 책임을 면합니다.
          </p>
        </section>

        <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p>시행일자: 2026년 11월 11일</p>
        </div>

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            확인 및 닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
