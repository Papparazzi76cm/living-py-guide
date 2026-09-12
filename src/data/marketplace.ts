import { PARTNER_CATEGORIES } from './clubData';

export type MarketplaceCategory = {
  slug: string;
  name: string;
  description: string;
  commissionPercent: number;
};

// Comisión sobre honorarios del profesional. El servidor vuelve a calcularla y la congela
// en cada presupuesto; estos valores solo sirven para explicar la tarifa en la interfaz.
export const COMMISSION_PROPOSAL: Record<string, number> = {
  'residencia-migraciones': 12,
  'legal-corporativo': 10,
  'contabilidad-impuestos': 10,
  inmobiliaria: 8,
  'banca-fintech': 8,
  seguros: 10,
  'salud-privada': 8,
  'colegios-internacionales': 8,
  'constitucion-empresas': 12,
  relocation: 12,
  vehiculos: 8,
  'telecom-internet': 12,
  'mudanzas-logistica': 12,
  arquitectos: 10,
  'construccion-reformas': 8,
  eventos: 12,
  'guarderia-cuidadores-infantiles': 12,
  'cuidado-mayores': 12,
  'manitas-24-horas': 15,
  veterinaria: 12,
  'cuidado-mascotas': 15,
  'chefs-domicilio': 15,
  'servicios-hogar': 15,
  traduccion: 15,
  marketing: 12,
  'tecnologia-ia': 12,
  'recursos-humanos': 12,
  viajes: 12,
  'hospitalidad-lifestyle': 15,
};

export const SERVICE_CATEGORIES: MarketplaceCategory[] = PARTNER_CATEGORIES.map(({ slug, name, description }) => ({
  slug,
  name,
  description,
  commissionPercent: COMMISSION_PROPOSAL[slug] ?? 12,
}));

export const MARKETPLACE_PROMISES = [
  'Profesionales verificados antes de publicar',
  'Presupuesto y condiciones por escrito antes de contratar',
  'Pago protegido preparado para operar dentro de la plataforma',
  'Historial, conversación y valoración en un único expediente',
];
