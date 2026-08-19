import type { ExpansionMarketSlug } from '@/data/expansionRoadmap';
import logoSprite from '@/assets/delegation-logos/delegation-sprite-light.webp';

type DelegationLogoSlug = ExpansionMarketSlug | 'paraguay';

interface DelegationFlagLogoProps {
  market: DelegationLogoSlug;
  countryName: string;
  className?: string;
  compact?: boolean;
}

const LOGO_POSITION: Record<DelegationLogoSlug, string> = {
  mexico: '0% 0%',
  panama: '50% 0%',
  'costa-rica': '100% 0%',
  'republica-dominicana': '0% 50%',
  colombia: '50% 50%',
  'el-salvador': '100% 50%',
  argentina: '0% 100%',
  brasil: '50% 100%',
  paraguay: '100% 100%',
};

export const DelegationFlagLogo = ({
  market,
  countryName,
  className = '',
  compact = false,
}: DelegationFlagLogoProps) => (
  <div
    className={`${compact ? 'h-32 w-32' : 'h-40 w-40 sm:h-44 sm:w-44'} shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm ${className}`}
    role="img"
    aria-label={`Living ${countryName}`}
    style={{
      backgroundImage: `url(${logoSprite})`,
      backgroundSize: '300% 300%',
      backgroundPosition: LOGO_POSITION[market],
      backgroundRepeat: 'no-repeat',
    }}
  />
);
