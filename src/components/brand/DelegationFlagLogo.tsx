import type { ExpansionMarketSlug } from '@/data/expansionRoadmap';

interface DelegationFlagLogoProps {
  market: ExpansionMarketSlug;
  countryName: string;
  className?: string;
  compact?: boolean;
}

const FlagArtwork = ({ market }: { market: ExpansionMarketSlug }) => {
  const clipId = `delegation-flag-${market}`;
  const shadowId = `delegation-shadow-${market}`;

  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" role="img" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d="M174 14c-7 25-24 39-52 49-15 5-31 9-48 14-32 9-54 21-65 38-12 19-10 42 4 60 11 14 28 25 48 35-5-11-3-21 5-30 8-9 21-16 37-23 23-10 43-22 56-38 18-22 24-47 22-77-1-11-3-20-7-28Z" />
          <path d="M61 210c13-4 29-6 46-4 23 2 46 8 69 14-16-16-31-28-46-37-16-10-31-16-46-19-8 10-14 21-15 31-1 6-4 11-8 15Z" />
        </clipPath>
        <filter id={shadowId} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodOpacity="0.28" />
        </filter>
        <linearGradient id={`${market}-shine`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>
      </defs>

      <g filter={`url(#${shadowId})`}>
        <g clipPath={`url(#${clipId})`}>
          {market === 'mexico' && (
            <>
              <rect x="0" y="0" width="74" height="220" fill="#006847" />
              <rect x="74" y="0" width="73" height="220" fill="#ffffff" />
              <rect x="147" y="0" width="73" height="220" fill="#ce1126" />
              <circle cx="111" cy="105" r="13" fill="#8a6f2f" opacity="0.95" />
              <circle cx="111" cy="105" r="8" fill="#2f7d32" />
            </>
          )}

          {market === 'panama' && (
            <>
              <rect x="0" y="0" width="110" height="110" fill="#ffffff" />
              <rect x="110" y="0" width="110" height="110" fill="#da121a" />
              <rect x="0" y="110" width="110" height="110" fill="#005293" />
              <rect x="110" y="110" width="110" height="110" fill="#ffffff" />
              <text x="55" y="72" textAnchor="middle" fontSize="34" fill="#005293">★</text>
              <text x="165" y="182" textAnchor="middle" fontSize="34" fill="#da121a">★</text>
            </>
          )}

          {market === 'costa-rica' && (
            <>
              <rect x="0" y="0" width="220" height="44" fill="#002b7f" />
              <rect x="0" y="44" width="220" height="44" fill="#ffffff" />
              <rect x="0" y="88" width="220" height="44" fill="#ce1126" />
              <rect x="0" y="132" width="220" height="44" fill="#ffffff" />
              <rect x="0" y="176" width="220" height="44" fill="#002b7f" />
              <circle cx="79" cy="110" r="11" fill="#f0c24f" opacity="0.95" />
            </>
          )}

          {market === 'republica-dominicana' && (
            <>
              <rect x="0" y="0" width="220" height="220" fill="#ffffff" />
              <rect x="0" y="0" width="93" height="93" fill="#002d62" />
              <rect x="127" y="0" width="93" height="93" fill="#ce1126" />
              <rect x="0" y="127" width="93" height="93" fill="#ce1126" />
              <rect x="127" y="127" width="93" height="93" fill="#002d62" />
              <circle cx="110" cy="110" r="13" fill="#ffffff" stroke="#d7b75f" strokeWidth="3" />
              <circle cx="110" cy="110" r="6" fill="#2d7b3b" />
            </>
          )}

          {market === 'colombia' && (
            <>
              <rect x="0" y="0" width="220" height="110" fill="#fcd116" />
              <rect x="0" y="110" width="220" height="55" fill="#003893" />
              <rect x="0" y="165" width="220" height="55" fill="#ce1126" />
            </>
          )}

          {market === 'el-salvador' && (
            <>
              <rect x="0" y="0" width="220" height="73.4" fill="#0f47af" />
              <rect x="0" y="73.4" width="220" height="73.2" fill="#ffffff" />
              <rect x="0" y="146.6" width="220" height="73.4" fill="#0f47af" />
              <circle cx="110" cy="110" r="12" fill="#ffffff" stroke="#d7b75f" strokeWidth="3" />
              <path d="M110 100l9 16h-18Z" fill="#2e8b57" />
            </>
          )}

          {market === 'argentina' && (
            <>
              <rect x="0" y="0" width="220" height="73.4" fill="#74acdf" />
              <rect x="0" y="73.4" width="220" height="73.2" fill="#ffffff" />
              <rect x="0" y="146.6" width="220" height="73.4" fill="#74acdf" />
              <circle cx="110" cy="110" r="13" fill="#f6b40e" />
              <circle cx="110" cy="110" r="7" fill="#f9d44a" />
            </>
          )}

          {market === 'brasil' && (
            <>
              <rect x="0" y="0" width="220" height="220" fill="#009c3b" />
              <path d="M110 38 191 110 110 182 29 110Z" fill="#ffdf00" />
              <circle cx="110" cy="110" r="42" fill="#002776" />
              <path d="M71 105c29-12 57-8 79 10" fill="none" stroke="#ffffff" strokeWidth="7" />
            </>
          )}

          <rect x="0" y="0" width="220" height="220" fill={`url(#${market}-shine)`} />
          <path d="M65 166c35-11 70-29 94-51-10 27-31 46-59 59-13 6-24 13-31 21-4-11-5-20-4-29Z" fill="#071a35" opacity="0.28" />
        </g>
      </g>
    </svg>
  );
};

export const DelegationFlagLogo = ({ market, countryName, className = '', compact = false }: DelegationFlagLogoProps) => (
  <div
    className={`flex flex-col items-center justify-center text-center font-['Lato'] ${className}`}
    aria-label={`Living ${countryName}`}
  >
    <div className={compact ? 'h-24 w-24' : 'h-32 w-32 sm:h-36 sm:w-36'}>
      <FlagArtwork market={market} />
    </div>
    <div className={compact ? '-mt-1' : '-mt-2'}>
      <div className={`${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black tracking-[0.08em] text-white`}>
        LIVING
      </div>
      <div
        className={`${countryName.length > 18 ? (compact ? 'text-xs' : 'text-sm sm:text-base') : compact ? 'text-sm' : 'text-lg sm:text-xl'} mt-1 font-black uppercase tracking-[0.05em] text-white`}
      >
        {countryName}
      </div>
    </div>
  </div>
);
