import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { PlayerInventory } from '../features/progression/progression';
import { useI18n } from '../i18n';

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
  const { t, language } = useI18n();

  const getLocalizedItem = (id: keyof PlayerInventory) => {
    switch (id) {
      case 'autoSolve':
        return {
          name: language === 'en' ? 'Clairvoyant Magnifier' : language === 'ja' ? '千里眼の虫眼鏡' : language === 'zh' ? '千里眼放大镜' : '천리안 돋보기',
          desc: language === 'en' ? 'Fills the correct digit into a selected cell instantly.' : language === 'ja' ? '選択したマスに正しい答えを即座に入力します。' : language === 'zh' ? '立即在所选空格填入正确的答案。' : '선택한 빈칸에 100% 올바른 정답을 즉시 채워 넣습니다.',
          btnText: language === 'en' ? 'Fill 1 Cell' : language === 'ja' ? '1マス正解入力' : language === 'zh' ? '填入1格正确数字' : '정답 1칸 채우기',
          badge: language === 'en' ? 'Recommended' : language === 'ja' ? 'おすすめ' : language === 'zh' ? '推荐' : '추천'
        };
      case 'healMistake':
        return {
          name: language === 'en' ? 'Heart-Calming Pill' : language === 'ja' ? '清心丸 (ミス回復)' : language === 'zh' ? '定心丸 (消除失误)' : '정심환 (실수 회복/부활)',
          desc: language === 'en' ? 'Reduces mistake count by 1 and revives on defeat.' : language === 'ja' ? 'ミス回数を1回減らし、失敗時にも復活可能。' : language === 'zh' ? '消除1次失误记录，挑战失败时亦可复活。' : '실수 횟수를 1회 차감합니다. (3번 실패 시에도 즉시 부활하여 이어서 플레이!)',
          btnText: language === 'en' ? `Recover 1 Mistake (${mistakes}/3)` : language === 'ja' ? `ミス1回回復 (${mistakes}/3)` : language === 'zh' ? `消除1次失误 (${mistakes}/3)` : `실수 1회 회복 (현재: ${mistakes}/3)`,
          badge: mistakes >= 2 ? (language === 'en' ? 'Danger!' : language === 'ja' ? 'ピンチ!' : language === 'zh' ? '危机脱离!' : '위기 탈출!') : undefined
        };
      case 'clearErrors':
        return {
          name: language === 'en' ? 'Incense of Purification' : language === 'ja' ? '浄化の香 (誤字消去)' : language === 'zh' ? '清净檀香 (清除错字)' : '정화의 향 (오답 일괄 제거)',
          desc: language === 'en' ? 'Clears all conflicting digits currently on the board.' : language === 'ja' ? '盤面上で間違って入力された数字をすべて消去します。' : language === 'zh' ? '自动检测并清除棋盘上所有填错的数字。' : '보드 위에 잘못 입력된 모든 충돌 숫자들을 한 번에 감지하여 깨끗이 지워줍니다.',
          btnText: language === 'en' ? 'Clear All Errors' : language === 'ja' ? '誤りを一括消去' : language === 'zh' ? '一键清除错字' : '오답 일괄 지우기',
          badge: hasErrorsOnBoard ? (language === 'en' ? 'Errors Found' : language === 'ja' ? 'エラー検知' : language === 'zh' ? '已检测到错误' : '오답 감지됨') : undefined
        };
      case 'autoCandidates':
        return {
          name: language === 'en' ? 'Talisman of Insight' : language === 'ja' ? '洞察の護符 (候補メモ)' : language === 'zh' ? '洞察符文 (候选笔记)' : '통찰의 부적 (후보수 자동 메모)',
          desc: language === 'en' ? 'Calculates and populates all pencil marks for empty cells.' : language === 'ja' ? 'すべての空きマスの候補数字を自動計算してメモします。' : language === 'zh' ? '自动计算并在所有空格中填入可能的候选笔记。' : '모든 빈칸에 들어갈 수 있는 유효한 후보 숫자를 계산하여 메모로 가득 채워줍니다.',
          btnText: language === 'en' ? 'Auto-Fill Notes' : language === 'ja' ? '候補メモを自動入力' : language === 'zh' ? '自动填入候选数' : '후보수 자동 기입',
          badge: language === 'en' ? 'Deduction Aid' : language === 'ja' ? '論理補助' : language === 'zh' ? '逻辑辅助' : '논리 보조'
        };
    }
  };

  const items = [
    {
      id: 'autoSolve' as keyof PlayerInventory,
      ...getLocalizedItem('autoSolve'),
      icon: '🔍',
      count: inventory.autoSolve,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      disabled: inventory.autoSolve <= 0
    },
    {
      id: 'healMistake' as keyof PlayerInventory,
      ...getLocalizedItem('healMistake'),
      icon: '💊',
      count: inventory.healMistake,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
      disabled: inventory.healMistake <= 0 || mistakes === 0
    },
    {
      id: 'clearErrors' as keyof PlayerInventory,
      ...getLocalizedItem('clearErrors'),
      icon: '🧹',
      count: inventory.clearErrors,
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      disabled: inventory.clearErrors <= 0 || !hasErrorsOnBoard
    },
    {
      id: 'autoCandidates' as keyof PlayerInventory,
      ...getLocalizedItem('autoCandidates'),
      icon: '📜',
      count: inventory.autoCandidates,
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      disabled: inventory.autoCandidates <= 0
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`🎒 ${t('game.itemDrawerTitle')}`}>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-xs text-center text-slate-600 dark:text-slate-400 font-medium">
          {language === 'en'
            ? 'Use your special ink items to overcome difficult situations!'
            : language === 'ja'
            ? 'アイテムを賢く使って、難関パズルを突破しましょう！'
            : language === 'zh'
            ? '善用锦囊中的水墨道具，化险为夷突破难关！'
            : '기본 지급된 신비로운 아이템을 사용하여 위기의 순간을 지혜롭게 돌파하세요!'}
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
                      {language === 'en'
                        ? `Owned: ${item.count}`
                        : language === 'ja'
                        ? `所持: ${item.count}個`
                        : language === 'zh'
                        ? `拥有: ${item.count}个`
                        : `보유: ${item.count}개`}
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
                {item.count <= 0
                  ? (language === 'en' ? 'Out of stock (0)' : language === 'ja' ? '数量不足 (0個)' : language === 'zh' ? '数量不足 (0个)' : '수량 부족 (0개)')
                  : item.btnText}
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-1">
          <Button variant="ghost" size="sm" pill fullWidth onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
