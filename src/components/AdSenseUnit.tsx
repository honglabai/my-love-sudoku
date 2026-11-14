import React, { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';

interface AdSenseUnitProps {
  client?: string; // ca-pub-XXXXXXXXXXXXXXXX
  slot?: string;   // 10-digit ad unit ID
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  const { language } = useI18n();
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    // Only attempt push if client and slot are provided and window.adsbygoogle exists
    if (client && slot && adRef.current && !isPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        console.warn('[AdSense] Push error:', err);
      }
    }
  }, [client, slot]);

  // If client or slot is not configured yet (before AdSense approval), show a compliant, discreet placeholder
  if (!client || !slot || client.includes('0000000000000000')) {
    const placeholderAria = language === 'en'
      ? 'Advertisement Area Notice'
      : language === 'ja'
      ? '広告エリアのご案内'
      : language === 'zh'
      ? '广告展示区域说明'
      : '광고 영역 안내';

    const placeholderTitle = language === 'en'
      ? 'Google AdSense Area'
      : language === 'ja'
      ? 'Google AdSense エリア'
      : language === 'zh'
      ? 'Google AdSense 广告位'
      : 'Google AdSense 영역';

    const placeholderDesc = language === 'en'
      ? 'Tailored ads will be cleanly displayed once Google AdSense is approved.'
      : language === 'ja'
      ? 'Google AdSense承認後、快適な形で広告が掲載されます。'
      : language === 'zh'
      ? '谷歌AdSense审核通过后，将以精简规范的形式展示赞助广告。'
      : '구글 애드센스 승인 후 맞춤형 광고가 정돈된 형태로 게재됩니다.';

    return (
      <aside
        aria-label={placeholderAria}
        className={`w-full my-3 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-center transition-all ${className}`}
      >
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>📢</span>
          <span>{placeholderTitle}</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          {placeholderDesc}
        </p>
      </aside>
    );
  }

  const sponsoredAria = language === 'en'
    ? 'Sponsored Ad'
    : language === 'ja'
    ? 'スポンサー広告'
    : language === 'zh'
    ? '赞助广告'
    : '후원 광고';

  return (
    <aside
      aria-label={sponsoredAria}
      className={`w-full my-3 overflow-hidden text-center min-h-[90px] flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mb-1 tracking-wider uppercase">
        ADVERTISEMENT
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </aside>
  );
};
