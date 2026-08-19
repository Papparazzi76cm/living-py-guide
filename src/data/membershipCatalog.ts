import { PARTNER_CATEGORIES, type CategoryStatus, type PartnerCategory } from './clubData';

export type MembershipTier = 'A' | 'B' | 'C' | 'D';
export type PartnerZoneSlug = 'gran-asuncion' | 'itapua-encarnacion' | 'ciudad-del-este';

export interface MembershipTierConfig {
  tier: MembershipTier;
  name: string;
  priceUsd: number;
  exclusivityPriceUsd: number;
  ticketProfile: string;
  description: string;
  open: boolean;
  exclusivityAllowed: boolean;
}

export interface PartnerZoneConfig {
  slug: PartnerZoneSlug;
  name: string;
  shortName: string;
  coverage: string;
  maxSeats: number;
  membershipFactor: number;
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierConfig> = {
  A: {
    tier: 'A',
    name: 'Categoría A',
    priceUsd: 2400,
    exclusivityPriceUsd: 7500,
    ticketProfile: 'Alto ticket / alto valor de cliente',
    description: 'Servicios capaces de generar un retorno elevado con pocas operaciones cerradas.',
    open: false,
    exclusivityAllowed: true,
  },
  B: {
    tier: 'B',
    name: 'Categoría B',
    priceUsd: 1200,
    exclusivityPriceUsd: 4500,
    ticketProfile: 'Ticket medio / recurrencia relevante',
    description: 'Servicios con buen valor por cliente, recurrencia o capacidad de venta cruzada.',
    open: false,
    exclusivityAllowed: true,
  },
  C: {
    tier: 'C',
    name: 'Categoría C',
    priceUsd: 600,
    exclusivityPriceUsd: 1500,
    ticketProfile: 'Ticket bajo-medio / volumen',
    description: 'Servicios donde el retorno depende más del volumen de derivaciones que de una sola operación.',
    open: false,
    exclusivityAllowed: true,
  },
  D: {
    tier: 'D',
    name: 'Categoría D',
    priceUsd: 0,
    exclusivityPriceUsd: 0,
    ticketProfile: 'Servicio de apoyo / conveniencia',
    description: 'Categoría abierta, sin cuota de membresía, sin límite de plazas y sin opción de exclusividad.',
    open: true,
    exclusivityAllowed: false,
  },
};

export const PARTNER_ZONES: Record<PartnerZoneSlug, PartnerZoneConfig> = {
  'gran-asuncion': {
    slug: 'gran-asuncion',
    name: 'Asunción, Central y Gran Asunción',
    shortName: 'Gran Asunción',
    coverage: 'Asunción, Departamento Central y área metropolitana',
    maxSeats: 5,
    membershipFactor: 1,
  },
  'itapua-encarnacion': {
    slug: 'itapua-encarnacion',
    name: 'Itapúa (Encarnación)',
    shortName: 'Itapúa · Encarnación',
    coverage: 'Encarnación y zona de Itapúa',
    maxSeats: 3,
    membershipFactor: 0.5,
  },
  'ciudad-del-este': {
    slug: 'ciudad-del-este',
    name: 'Ciudad del Este',
    shortName: 'Ciudad del Este',
    coverage: 'Ciudad del Este',
    maxSeats: 3,
    membershipFactor: 0.5,
  },
};

export const DEFAULT_PARTNER_ZONE: PartnerZoneSlug = 'gran-asuncion';
export const PARTNER_ZONE_ORDER: PartnerZoneSlug[] = ['gran-asuncion', 'itapua-encarnacion', 'ciudad-del-este'];

export const REQUIRED_TIER_A_LANGUAGES = ['Español', 'Inglés'] as const;
export const REQUIRED_EXCLUSIVITY_LANGUAGES = ['Español', 'Inglés', 'Alemán', 'Portugués'] as const;

export const EXTRA_PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    slug: 'escribania',
    name: 'Escribanía',
    description: 'Escrituras, certificaciones, poderes, actas, compraventas y actuaciones notariales.',
    seatsTaken: 0,
  },
  {
    slug: 'contadores',
    name: 'Contadores',
    description: 'Contabilidad operativa, balances, liquidaciones, cumplimiento tributario y acompañamiento contable recurrente.',
    seatsTaken: 0,
  },
];

export const ALL_PARTNER_CATEGORIES: PartnerCategory[] = [
  ...PARTNER_CATEGORIES,
  ...EXTRA_PARTNER_CATEGORIES,
];

const CATEGORY_TIER_BY_SLUG: Record<string, MembershipTier> = {
  // A — alto ticket / alto valor por cliente
  'legal-corporativo': 'A',
  inmobiliaria: 'A',
  'banca-fintech': 'A',
  'colegios-internacionales': 'A',
  'constitucion-empresas': 'A',
  relocation: 'A',
  vehiculos: 'A',
  arquitectos: 'A',
  'construccion-reformas': 'A',

  // B — ticket medio / recurrencia relevante
  'residencia-migraciones': 'B',
  'contabilidad-impuestos': 'B',
  seguros: 'B',
  'salud-privada': 'B',
  'mudanzas-logistica': 'B',
  eventos: 'B',
  marketing: 'B',
  'tecnologia-ia': 'B',
  'recursos-humanos': 'B',
  escribania: 'B',
  contadores: 'B',

  // C — ticket bajo-medio / volumen
  'telecom-internet': 'C',
  'guarderia-cuidadores-infantiles': 'C',
  'cuidado-mayores': 'C',
  veterinaria: 'C',
  'chefs-domicilio': 'C',
  traduccion: 'C',
  viajes: 'C',
  'hospitalidad-lifestyle': 'C',

  // D — abierta, gratuita y sin exclusividad
  'manitas-24-horas': 'D',
  'cuidado-mascotas': 'D',
  'servicios-hogar': 'D',
};

export const getMembershipTier = (categoryOrSlug: PartnerCategory | string): MembershipTier => {
  const slug = typeof categoryOrSlug === 'string' ? categoryOrSlug : categoryOrSlug.slug;
  return CATEGORY_TIER_BY_SLUG[slug] ?? 'C';
};

export const getMembershipTierConfig = (categoryOrSlug: PartnerCategory | string): MembershipTierConfig =>
  MEMBERSHIP_TIERS[getMembershipTier(categoryOrSlug)];

export const getPartnerZoneConfig = (zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE): PartnerZoneConfig =>
  PARTNER_ZONES[zoneSlug];

export const getRegionalMembershipPriceUsd = (
  categoryOrSlug: PartnerCategory | string,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): number => {
  const tier = getMembershipTierConfig(categoryOrSlug);
  if (tier.open) return 0;
  return Math.round(tier.priceUsd * getPartnerZoneConfig(zoneSlug).membershipFactor);
};

export const getRegionalExclusivityPriceUsd = (
  categoryOrSlug: PartnerCategory | string,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): number => {
  const tier = getMembershipTierConfig(categoryOrSlug);
  if (!tier.exclusivityAllowed) return 0;
  if (zoneSlug === DEFAULT_PARTNER_ZONE) return tier.exclusivityPriceUsd;
  return getRegionalMembershipPriceUsd(categoryOrSlug, zoneSlug) * 2;
};

export const isOpenCategory = (categoryOrSlug: PartnerCategory | string): boolean =>
  getMembershipTierConfig(categoryOrSlug).open;

export const canBlockExclusivity = (categoryOrSlug: PartnerCategory | string): boolean =>
  getMembershipTierConfig(categoryOrSlug).exclusivityAllowed;

export const getExclusivityPriceUsd = (
  categoryOrSlug: PartnerCategory | string,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): number => getRegionalExclusivityPriceUsd(categoryOrSlug, zoneSlug);

export const getSeatsTakenForZone = (
  category: PartnerCategory,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): number => (zoneSlug === DEFAULT_PARTNER_ZONE ? category.seatsTaken : 0);

export const getRegionalCategoryStatus = (
  category: PartnerCategory,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): CategoryStatus => {
  if (zoneSlug === DEFAULT_PARTNER_ZONE && category.exclusive) return 'exclusive';
  if (isOpenCategory(category)) return 'available';
  const maxSeats = getPartnerZoneConfig(zoneSlug).maxSeats;
  const remaining = Math.max(maxSeats - getSeatsTakenForZone(category, zoneSlug), 0);
  const lastSeatsThreshold = maxSeats <= 3 ? 1 : 2;
  return remaining <= lastSeatsThreshold ? 'last-seats' : 'available';
};

export const formatMembershipPrice = (
  categoryOrSlug: PartnerCategory | string,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): string => {
  const price = getRegionalMembershipPriceUsd(categoryOrSlug, zoneSlug);
  return price === 0 ? 'Sin cuota de membresía' : `USD ${price.toLocaleString('en-US')}/año`;
};

export const formatExclusivityPrice = (
  categoryOrSlug: PartnerCategory | string,
  zoneSlug: PartnerZoneSlug = DEFAULT_PARTNER_ZONE,
): string => {
  const config = getMembershipTierConfig(categoryOrSlug);
  return config.exclusivityAllowed
    ? `USD ${getRegionalExclusivityPriceUsd(categoryOrSlug, zoneSlug).toLocaleString('en-US')}/año`
    : 'Exclusividad no disponible';
};
