import { PARTNER_CATEGORIES, type PartnerCategory } from './clubData';

export type MembershipTier = 'A' | 'B' | 'C' | 'D';

export interface MembershipTierConfig {
  tier: MembershipTier;
  name: string;
  priceUsd: number;
  ticketProfile: string;
  description: string;
  open: boolean;
  exclusivityAllowed: boolean;
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierConfig> = {
  A: {
    tier: 'A',
    name: 'Categoría A',
    priceUsd: 2400,
    ticketProfile: 'Alto ticket / alto valor de cliente',
    description: 'Servicios capaces de generar un retorno elevado con pocas operaciones cerradas.',
    open: false,
    exclusivityAllowed: true,
  },
  B: {
    tier: 'B',
    name: 'Categoría B',
    priceUsd: 1200,
    ticketProfile: 'Ticket medio / recurrencia relevante',
    description: 'Servicios con buen valor por cliente, recurrencia o capacidad de venta cruzada.',
    open: false,
    exclusivityAllowed: true,
  },
  C: {
    tier: 'C',
    name: 'Categoría C',
    priceUsd: 600,
    ticketProfile: 'Ticket bajo-medio / volumen',
    description: 'Servicios donde el retorno depende más del volumen de derivaciones que de una sola operación.',
    open: false,
    exclusivityAllowed: true,
  },
  D: {
    tier: 'D',
    name: 'Categoría D',
    priceUsd: 0,
    ticketProfile: 'Servicio de apoyo / conveniencia',
    description: 'Categoría abierta, sin cuota de membresía, sin límite de plazas y sin opción de exclusividad.',
    open: true,
    exclusivityAllowed: false,
  },
};

export const EXCLUSIVITY_PREMIUM_USD = 5000;

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

export const isOpenCategory = (categoryOrSlug: PartnerCategory | string): boolean =>
  getMembershipTierConfig(categoryOrSlug).open;

export const canBlockExclusivity = (categoryOrSlug: PartnerCategory | string): boolean =>
  getMembershipTierConfig(categoryOrSlug).exclusivityAllowed;

export const formatMembershipPrice = (categoryOrSlug: PartnerCategory | string): string => {
  const config = getMembershipTierConfig(categoryOrSlug);
  return config.priceUsd === 0 ? 'Sin cuota de membresía' : `USD ${config.priceUsd.toLocaleString('en-US')}/año`;
};
