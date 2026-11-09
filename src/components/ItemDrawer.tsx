import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { PlayerInventory } from '../features/progression/progression';

interface ItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: PlayerInventory;
  mistakes: number;
  hasErrorsOnBoard: boolean;
  onUseItem: (itemType: keyof PlayerInventory) => void;
}

export const ItemDrawer: React.FC<ItemDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  mistakes,
  hasErrorsOnBoard,
  onUseItem
}) => {
  const items = [
    {
      id: 'autoSolve' as keyof PlayerInventory,
      name: '천리안 돋보기',
      icon: '🔍',
      count: inventory.autoSolve,
      desc: '선택한 빈칸(또는 가장 유력한 빈칸)에 100% 올바른 정답을 즉시 채워 넣습니다.',
      btnText: '정답 1칸 채우기',
      badge: '추천',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      disabled: inventory.autoSolve <= 0
    },
    {
      id: 'healMistake' as keyof PlayerInventory,
      name: '정심환 (실수 회복/부활)',
      icon: '💊',
      count: inventory.healMistake,
      desc: '실수 횟수를 1회 차감합니다. (3번 실패 시에도 즉시 부활하여 이어서 플레이!)',
      btnText: `실수 1회 회복 (현재: ${mistakes}/3)`,
      badge: mistakes >= 2 ? '위기 탈출!' : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      disabled: inventory.healMistake <= 0 || mistakes === 0
    },
    {
      id: 'clearErrors' as keyof PlayerInventory,
      name: '정화의 향 (오답 일괄 제거)',
      icon: '🧹',
      count: inventory.clearErrors,
      desc: '보드 위에 잘못 입력된 모든 충돌 숫자들을 한 번에 감지하여 깨끗이 지워줍니다.',
      btnText: '오답 일괄 지우기',
      badge: hasErrorsOnBoard ? '오답 감지됨' : undefined,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      disabled: inventory.clearErrors <= 0 || !hasErrorsOnBoard
    },
    {
      id: 'autoCandidates' as keyof PlayerInventory,
      name: '통찰의 부적 (후보수 자동 메모)',
      icon: '📜',
      count: inventory.autoCandidates,
      desc: '모든 빈칸에 들어갈 수 있는 유효한 후보 숫자를 계산하여 메모로 가득 채워줍니다.',
      btnText: '후보수 자동 기입',
      badge: '논리 보조',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      disabled: inventory.autoCandidates <= 0
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎒 내사랑 스도쿠 보물함">
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-xs text-center text-slate-600 dark:text-slate-400 font-medium">
          기본 지급된 신비로운 아이템을 사용하여 위기의 순간을 지혜롭게 돌파하세요!
        </p>

        <div className="space-y-2.5">
          {items.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-2xl shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      보유: {item.count}개
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                {item.desc}
              </p>

              <Button
                variant={item.disabled ? 'ghost' : 'primary'}
                size="sm"
                pill
                fullWidth
                disabled={item.disabled}
                onClick={() => {
                  onUseItem(item.id);
                  onClose();
                }}
                className="py-1.5 text-xs font-bold"
              >
                {item.count <= 0 ? '수량 부족 (0개)' : item.btnText}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-1">
          <Button variant="ghost" size="sm" pill fullWidth onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
