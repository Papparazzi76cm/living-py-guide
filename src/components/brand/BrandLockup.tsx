import logo from '@/assets/logo.png';
import { ACTIVE_MARKET, LBC_NETWORK, type MarketConfig } from '@/config/network';

type BrandLockupVariant = 'network' | 'market';

interface BrandLockupProps {
  variant?: BrandLockupVariant;
  market?: MarketConfig;
  compact?: boolean;
  inverted?: boolean;
  className?: string;
}

const LbcSymbol = ({ inverted = false, compact = false }: { inverted?: boolean; compact?: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 534 508"
    className={`${compact ? 'h-12 w-12' : 'h-16 w-16 sm:h-20 sm:w-20'} shrink-0 ${inverted ? 'text-white' : 'text-secondary'}`}
  >
    <path
      fill="currentColor"
      d="M529 0 L496 42 L446 73 L350 105 L138 152 L84 176 L27 221 L0 271 L1 347 L37 428 L83 483 L111 507 L315 507 L264 490 L253 474 L386 414 L448 365 L469 336 L483 302 L490 253 L506 222 L519 176 L533 53 Z"
    />
  </svg>
);

export const BrandLockup = ({
  variant = 'market',
  market = ACTIVE_MARKET,
  compact = false,
  inverted = false,
  className = '',
}: BrandLockupProps) => {
  const textColor = inverted ? 'text-white' : 'text-ink';
  const subColor = inverted ? 'text-white/75' : 'text-muted-foreground';

  if (variant === 'network') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`} aria-label={`${LBC_NETWORK.initials} ${LBC_NETWORK.name}`}>
        <LbcSymbol inverted={inverted} compact={compact} />
        <div className="leading-none">
          <div className={`font-black uppercase tracking-[0.08em] ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} ${textColor}`}>
            {LBC_NETWORK.initials}
          </div>
          <div className={`mt-1.5 font-bold uppercase tracking-[0.08em] ${compact ? 'text-[10px]' : 'text-xs sm:text-sm'} ${subColor}`}>
            {LBC_NETWORK.name}
          </div>
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
