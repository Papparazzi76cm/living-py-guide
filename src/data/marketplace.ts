import { PARTNER_CATEGORIES } from './clubData';

// Initial commercial proposal. Never use browser values to settle a payment.
export const COMMISSION_PROPOSAL: Record<string, number> = {
  'residencia-migraciones':12, 'legal-corporativo':10, 'contabilidad-impuestos':10,
  'constitucion-empresas':12, inmobiliaria:10, relocation:10,
  'mudanzas-logistica':10, traduccion:15, 'servicios-hogar':15,
  viajes:15, 'hospitalidad-lifestyle':15,
};
export const SERVICE_CATEGORIES = PARTNER_CATEGORIES.map(({slug,name,description}) => ({slug,name,description}));
