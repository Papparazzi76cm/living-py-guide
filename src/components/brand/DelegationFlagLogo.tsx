import type { ExpansionMarketSlug } from '@/data/expansionRoadmap';
import sprite1 from '@/assets/delegation-logos/sprite-1';
import sprite2 from '@/assets/delegation-logos/sprite-2';
import sprite3 from '@/assets/delegation-logos/sprite-3';
import sprite4 from '@/assets/delegation-logos/sprite-4';
import sprite5 from '@/assets/delegation-logos/sprite-5';
import sprite6 from '@/assets/delegation-logos/sprite-6';

type DelegationLogoSlug = ExpansionMarketSlug | 'paraguay';

interface DelegationFlagLogoProps {
  market: DelegationLogoSlug;
  countryName: string;
  className?: string;
  compact?: boolean;
}

const LOGO_SPRITE = `data:image/webp;base64,${sprite1}${sprite2}${sprite3}${sprite4}${sprite5}${sprite6}`;

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
      backgroundImage: `url(${LOGO_SPRITE})`,
      backgroundSize: '300% 300%',
      backgroundPosition: LOGO_POSITION[market],
      backgroundRepeat: 'no-repeat',
    }}
  />
);
