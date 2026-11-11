import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface AboutContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ℹ️ 서비스 소개 및 문의" maxWidth="max-w-md">
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-indigo-100 dark:border-slate-700 text-center">
          <div className="text-2xl mb-1">🎋</div>
          <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">
            내사랑 스도쿠 (My Love Sudoku)
          </h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            한국 전통 수묵 담채화 에디션 · v1.0.0
          </p>
        </div>

        <section className="space-y-1.5">
          <h5 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            서비스 지향점
          </h5>
          <p className="text-xs">
            '내사랑 스도쿠'는 바쁜 현대인들에게 고요한 먹향과 전통 화조도의 여유를 선사하며, 누구나 차근차근 두뇌를 훈련하고 집중력을 기를 수 있도록 정성스럽게 제작된 웰메이드 퍼즐 플랫폼입니다.
          </p>
        </section>

        <section className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <h5 className="font-bold text-slate-900 dark:text-slate-100">
            운영팀 및 고객 문의 안내
          </h5>
          <div className="space-y-1 text-slate-600 dark:text-slate-400">
            <p>• 서비스 배포처: Vercel Cloud Platform</p>
            <p>• 개발 및 운영: 내사랑 스도쿠 독립 개발팀</p>
            <p>
              • 이메일 문의:{' '}
              <a
                href="mailto:support@my-love-sudoku.vercel.app"
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                support@my-love-sudoku.vercel.app
              </a>
            </p>
            <p>• 버그 제보 / 스테이지 건의 / 광고 문의 등 언제든 환영합니다.</p>
          </div>
        </section>

        <div className="pt-2">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
