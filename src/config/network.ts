export type MarketSlug = 'paraguay' | 'argentina' | 'brasil' | 'mexico';
export type MarketStatus = 'active' | 'planned' | 'market-study';
export type OperatorModel = 'founding-delegation' | 'franchise';
export type PricingStatus = 'active' | 'pending-market-study';

export interface MarketTheme {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  deep: string;
  foreground: string;
  ring: string;
}

export interface MarketConfig {
  slug: MarketSlug;
  brandName: string;
  countryName: string;
  countryCode: string;
  locale: string;
  currencyCode: string;
  status: MarketStatus;
  operatorModel: OperatorModel;
  pricingStatus: PricingStatus;
  baseUrl?: string;
  coverageLabel: string;
  theme: MarketTheme;
}

export const LBC_NETWORK = {
  slug: 'lbc',
  initials: 'LBC',
  name: 'Living Business Club',
  legalRole: 'Empresa matriz y marca de red',
  expansionRegion: 'LATAM',
} as const;

export const MARKETS: Record<MarketSlug, MarketConfig> = {
  paraguay: {
    slug: 'paraguay',
    brandName: 'Living Paraguay',
    countryName: 'Paraguay',
    countryCode: 'PY',
    locale: 'es-PY',
    currencyCode: 'USD',
    status: 'active',
    operatorModel: 'founding-delegation',
    pricingStatus: 'active',
    baseUrl: 'https://livingparaguay.com',
    coverageLabel: 'Paraguay',
    theme: {
      primary: '5 77% 49%',
      primaryHover: '5 77% 42%',
      secondary: '215 100% 33%',
      secondaryHover: '215 100% 28%',
      deep: '215 100% 21%',
      foreground: '215 100% 21%',
      ring: '5 77% 49%',
    },
  },
  argentina: {
    slug: 'argentina',
    brandName: 'Living Argentina',
    countryName: 'Argentina',
    countryCode: 'AR',
    locale: 'es-AR',
    currencyCode: 'ARS',
    status: 'planned',
    operatorModel: 'franchise',
    pricingStatus: 'pending-market-study',
    coverageLabel: 'Argentina',
    theme: {
      primary: '199 79% 60%',
      primaryHover: '199 70% 50%',
      secondary: '44 95% 53%',
      secondaryHover: '44 90% 45%',
      deep: '207 66% 24%',
      foreground: '207 66% 24%',
      ring: '199 79% 60%',
    },
  },
  brasil: {
    slug: 'brasil',
    brandName: 'Living Brasil',
    countryName: 'Brasil',
    countryCode: 'BR',
    locale: 'pt-BR',
    currencyCode: 'BRL',
    status: 'planned',
    operatorModel: 'franchise',
    pricingStatus: 'pending-market-study',
    coverageLabel: 'Brasil',
    theme: {
      primary: '142 70% 30%',
      primaryHover: '142 70% 25%',
      secondary: '51 100% 50%',
      secondaryHover: '48 100% 45%',
      deep: '222 71% 28%',
      foreground: '222 71% 22%',
      ring: '142 70% 30%',
    },
  },
  mexico: {
    slug: 'mexico',
    brandName: 'Living México',
    countryName: 'México',
    countryCode: 'MX',
    locale: 'es-MX',
    currencyCode: 'MXN',
    status: 'planned',
    operatorModel: 'franchise',
    pricingStatus: 'pending-market-study',
    coverageLabel: 'México',
    theme: {
      primary: '146 100% 26%',
      primaryHover: '146 100% 21%',
      secondary: '0 63% 42%',
      secondaryHover: '0 63% 36%',
      deep: '150 24% 16%',
      foreground: '150 24% 16%',
      ring: '146 100% 26%',
    },
  },
};

export const MARKET_ORDER: MarketSlug[] = ['paraguay', 'argentina', 'brasil', 'mexico'];

const requestedMarket = (import.meta.env.VITE_ACTIVE_MARKET as MarketSlug | undefined) ?? 'paraguay';

export const ACTIVE_MARKET_SLUG: MarketSlug = requestedMarket in MARKETS ? requestedMarket : 'paraguay';
export const ACTIVE_MARKET = MARKETS[ACTIVE_MARKET_SLUG];

export const getMarket = (slug: MarketSlug) => MARKETS[slug];
export const isMarketActive = (slug: MarketSlug) => MARKETS[slug].status === 'active';
