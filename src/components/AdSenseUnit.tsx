import React, { useEffect, useRef } from 'react';

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
    return (
      <aside
        aria-label="광고 영역 안내"
        className={`w-full my-3 p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-center transition-all ${className}`}
      >
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>📢</span>
          <span>Google AdSense 영역</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          구글 애드센스 승인 후 맞춤형 광고가 정돈된 형태로 게재됩니다.
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="후원 광고"
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
