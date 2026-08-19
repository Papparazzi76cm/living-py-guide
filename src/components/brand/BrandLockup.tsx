import type { CSSProperties } from 'react';
import symbolUrl from '@/assets/lbc-symbol.svg';
import { ACTIVE_MARKET, LBC_NETWORK, type MarketConfig } from '@/config/network';

type BrandLockupVariant = 'network' | 'market';

interface BrandLockupProps {
  variant?: BrandLockupVariant;
  market?: MarketConfig;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}

const Symbol = ({ inverted = false }: { inverted?: boolean }) => {
  const style: CSSProperties = {
    WebkitMaskImage: `url(${symbolUrl})`,
    maskImage: `url(${symbolUrl})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  };

  return (
    <span
      aria-hidden
      style={style}
      className={`block h-11 w-12 shrink-0 ${inverted ? 'bg-white' : 'bg-secondary'} sm:h-12 sm:w-13`}
    />
  );
};

export const BrandLockup = ({
  variant = 'market',
  market = ACTIVE_MARKET,
  compact = false,
  inverted = false,
  className = '',
}: BrandLockupProps) => {
  const textColor = inverted ? 'text-white' : 'text-ink';
  const subColor = inverted ? 'text-white/70' : 'text-muted-foreground';

  if (variant === 'network') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`} aria-label={`${LBC_NETWORK.initials} ${LBC_NETWORK.name}`}>
        <Symbol inverted={inverted} />
        <div className="leading-none">
          <div className={`font-black tracking-[0.12em] ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} ${textColor}`}>
            {LBC_NETWORK.initials}
          </div>
          <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] ${subColor}`}>
            {LBC_NETWORK.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label={market.brandName}>
      <Symbol inverted={inverted} />
      <div className="leading-none">
        <div className={`font-black uppercase tracking-[0.08em] ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} ${textColor}`}>
          Living
        </div>
        <div className={`mt-1 font-black uppercase tracking-[0.08em] ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} ${inverted ? 'text-white' : 'text-primary'}`}>
          {market.countryName}
        </div>
        {!compact && (
          <div className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] sm:text-[10px] ${subColor}`}>
            Una red {LBC_NETWORK.initials}
          </div>
        )}
      </div>
    </div>
  );
};
