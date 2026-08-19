import logo from '@/assets/logo.png';
import lbcSymbol from '@/assets/lbc-symbol.svg';
import { ACTIVE_MARKET, LBC_NETWORK, type MarketConfig } from '@/config/network';

type BrandLockupVariant = 'network' | 'market';

interface BrandLockupProps {
  variant?: BrandLockupVariant;
  market?: MarketConfig;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}

const LbcSymbol = ({
  inverted = false,
  compact = false,
  prominent = false,
}: {
  inverted?: boolean;
  compact?: boolean;
  prominent?: boolean;
}) => (
  <img
    src={lbcSymbol}
    alt=""
    aria-hidden="true"
    className={`block shrink-0 object-contain ${
      prominent
        ? compact
          ? 'h-14 w-16'
          : 'h-20 w-24 sm:h-24 sm:w-28'
        : compact
          ? 'h-12 w-12'
          : 'h-16 w-16 sm:h-20 sm:w-20'
    } ${inverted ? 'brightness-0 invert' : ''}`}
  />
);

export const BrandLockup = ({
  variant = 'market',
  market = ACTIVE_MARKET,
  compact = false,
  inverted = false,
  className = '',
}: BrandLockupProps) => {
  const textColor = inverted ? 'text-white' : 'text-ink';

  if (variant === 'network') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center ${className}`}
        aria-label={`${LBC_NETWORK.initials} ${LBC_NETWORK.name}`}
      >
        <LbcSymbol inverted={inverted} compact={compact} prominent />
        <div
          className={`mt-1 uppercase leading-none tracking-[0.055em] ${
            compact ? 'text-2xl' : 'text-3xl sm:text-4xl'
          } ${textColor}`}
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 900 }}
        >
          {LBC_NETWORK.initials}
        </div>
        <div
          className={`mt-1 uppercase leading-none tracking-[0.055em] ${
            compact ? 'text-[9px]' : 'text-[11px] sm:text-xs'
          } ${textColor}`}
          style={{ fontFamily: "'Lato', sans-serif", fontWeight: 900 }}
        >
          {LBC_NETWORK.name}
        </div>
      </div>
    );
  }

  if (market.slug === 'paraguay') {
    return (
      <img
        src={logo}
        alt="Living Paraguay"
        className={`${compact ? 'h-16 sm:h-20' : 'h-24'} w-auto ${inverted ? 'brightness-0 invert' : ''} ${className}`}
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label={market.brandName}>
      <LbcSymbol inverted={inverted} compact={compact} />
      <div className="leading-none">
        <div className={`font-black uppercase tracking-[0.08em] ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} ${textColor}`}>
          Living
        </div>
        <div className={`mt-1 font-black uppercase tracking-[0.08em] ${compact ? 'text-lg' : 'text-xl sm:text-2xl'} ${inverted ? 'text-white' : 'text-primary'}`}>
          {market.countryName}
        </div>
      </div>
    </div>
  );
};
