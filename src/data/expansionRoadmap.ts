export type ExpansionMarketSlug =
  | 'mexico'
  | 'panama'
  | 'costa-rica'
  | 'republica-dominicana'
  | 'colombia'
  | 'el-salvador'
  | 'argentina'
  | 'brasil';

export interface ExpansionMarket {
  slug: ExpansionMarketSlug;
  priority: number;
  brandName: string;
  countryName: string;
  countryCode: string;
  locale: string;
  currencyCode: string;
  stage: 'priority' | 'planned';
  rationale: string;
}

/**
 * Orden comercial de expansión de LBC.
 *
 * La prioridad no representa una fecha comprometida de apertura. Cada mercado
 * seguirá necesitando validación local, operador/franquiciado, pricing propio y
 * preparación operativa antes de pasar a estado activo.
 */
export const LBC_EXPANSION_ROADMAP: ExpansionMarket[] = [
  {
    slug: 'mexico',
    priority: 1,
    brandName: 'Living México',
    countryName: 'México',
    countryCode: 'MX',
    locale: 'es-MX',
    currencyCode: 'MXN',
    stage: 'priority',
    rationale: 'Mercado ya preparado en la arquitectura LBC y uno de los destinos con mayor capacidad de escala para comunidad, servicios y partners.',
  },
  {
    slug: 'panama',
    priority: 2,
    brandName: 'Living Panamá',
    countryName: 'Panamá',
    countryCode: 'PA',
    locale: 'es-PA',
    currencyCode: 'USD',
    stage: 'priority',
    rationale: 'Alta concentración de expatriados, inversión internacional y demanda recurrente de servicios de instalación, empresa, vivienda y patrimonio.',
  },
  {
    slug: 'costa-rica',
    priority: 3,
    brandName: 'Living Costa Rica',
    countryName: 'Costa Rica',
    countryCode: 'CR',
    locale: 'es-CR',
    currencyCode: 'CRC',
    stage: 'priority',
    rationale: 'Mercado maduro para residentes internacionales, jubilados, trabajadores remotos y compradores de vivienda con ecosistema profesional consolidado.',
  },
  {
    slug: 'republica-dominicana',
    priority: 4,
    brandName: 'Living República Dominicana',
    countryName: 'República Dominicana',
    countryCode: 'DO',
    locale: 'es-DO',
    currencyCode: 'DOP',
    stage: 'priority',
    rationale: 'Fuerte encaje entre expatriación, segunda residencia, inversión inmobiliaria, turismo de larga estancia y servicios de acompañamiento local.',
  },
  {
    slug: 'colombia',
    priority: 5,
    brandName: 'Living Colombia',
    countryName: 'Colombia',
    countryCode: 'CO',
    locale: 'es-CO',
    currencyCode: 'COP',
    stage: 'priority',
    rationale: 'Gran profundidad de mercado, ciudades internacionales y crecimiento de perfiles remotos, emprendedores e inversores que demandan proveedores confiables.',
  },
  {
    slug: 'el-salvador',
    priority: 6,
    brandName: 'Living El Salvador',
    countryName: 'El Salvador',
    countryCode: 'SV',
    locale: 'es-SV',
    currencyCode: 'USD',
    stage: 'priority',
    rationale: 'Mercado emergente con creciente visibilidad internacional y potencial para capturar temprano una comunidad de nuevos residentes y empresarios.',
  },
  {
    slug: 'argentina',
    priority: 7,
    brandName: 'Living Argentina',
    countryName: 'Argentina',
    countryCode: 'AR',
    locale: 'es-AR',
    currencyCode: 'ARS',
    stage: 'planned',
    rationale: 'Mercado ya contemplado por LBC, reservado para una segunda ola tras validar el modelo en los destinos con mayor prioridad expatriada.',
  },
  {
    slug: 'brasil',
    priority: 8,
    brandName: 'Living Brasil',
    countryName: 'Brasil',
    countryCode: 'BR',
    locale: 'pt-BR',
    currencyCode: 'BRL',
    stage: 'planned',
    rationale: 'Mercado de enorme escala y potencial, previsto para una fase posterior por su complejidad operativa, lingüística y territorial.',
  },
];
