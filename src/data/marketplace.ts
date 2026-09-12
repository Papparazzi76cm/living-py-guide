import { PARTNER_CATEGORIES } from './clubData';

export type MarketplaceCategory = {
  slug: string;
  name: string;
  description: string;
  commissionPercent: number | null;
};

// Comisión de plataforma sobre honorarios profesionales. Nunca se usa este valor del navegador para liquidar pagos:
// PostgreSQL guarda la tarifa efectiva en cada presupuesto aceptado.
export const COMMISSION_PROPOSAL: Record<string, number | null> = {
  'residencia-migraciones': 12,
  'legal-corporativo': 10,
  'contabilidad-impuestos': 10,
  'constitucion-empresas': 12,
  inmobiliaria: 10,
  relocation: 10,
  'mudanzas-logistica': 10,
  traduccion: 15,
  'servicios-hogar': 15,
  viajes: 15,
  'hospitalidad-lifestyle': 15,
};

export const SERVICE_CATEGORIES: MarketplaceCategory[] = PARTNER_CATEGORIES.map(({ slug, name, description }) => ({
  slug,
  name,
  description,
  commissionPercent: COMMISSION_PROPOSAL[slug] ?? null,
}));

export const MARKETPLACE_PROMISES = [
  'Profesionales verificados antes de publicar',
  'Presupuesto y condiciones por escrito antes de contratar',
  'Pago protegido preparado para operar dentro de la plataforma',
  'Historial, conversación y valoración en un único expediente',
];
