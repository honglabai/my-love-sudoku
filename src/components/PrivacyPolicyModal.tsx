import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🛡️ 개인정보처리방침" maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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
              Google의 광고 쿠키 사용으로 인해 Google 및 파트너는 인터넷 사용자의 방문 정보를 바탕으로 적합한 광고를 표시할 수 있습니다.
            </li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            3. 맞춤형 광고 및 쿠키 수집 거부(옵트아웃) 방법
          </h4>
          <p>
            이용자는 언제든지 맞춤형 광고 수신을 거부하거나 쿠키 저장을 차단할 수 있는 권리를 가집니다.
          </p>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              🔗 광고 설정 및 차단 링크:
            </p>
            <p>
              • Google 광고 설정:{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                adssettings.google.com
              </a>
            </p>
            <p>
              • 제3자 공급업체 쿠키 선택 해제:{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                aboutads.info
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-1.5">
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            4. 개인정보 보호책임자 및 고객지원 문의
          </h4>
          <p>
            서비스 이용 중 발생하는 개인정보 보호 관련 고충 및 문의는 아래 담당자에게 문의해 주시면 신속하게 답변해 드리겠습니다.
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
            <p>• 서비스명: 내사랑 스도쿠 (sudoku.honglabai.com)</p>
            <p>• 운영 및 제공자: HongLab AI (홍랩)</p>
            <p>• 개인정보 보호책임자: HongLab AI 개인정보보호팀</p>
            <p>
              • 고객 문의 이메일:{' '}
              <a href="mailto:contact@honglabai.com" className="text-blue-600 dark:text-blue-400 underline">
                contact@honglabai.com
              </a>
            </p>
            <p>• 공식 사이트: https://sudoku.honglabai.com</p>
            <p>• 최종 개정일자: 2026년 11월 12일</p>
          </div>
        </section>

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            확인 및 닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
