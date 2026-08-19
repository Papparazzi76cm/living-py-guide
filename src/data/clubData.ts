/**
 * DEMO DATA — Living Paraguay Business Club
 *
 * IMPORTANT: All partner/company names below are PLACEHOLDER DEMO DATA used
 * to illustrate the directory UI. They are not real members and must not be
 * presented publicly as claims. Replace with verified data before launch.
 */

export type CategoryStatus = 'available' | 'last-seats' | 'exclusive';

export interface PartnerCategory {
  slug: string;
  name: string;
  description: string;
  seatsTaken: number;
  exclusive?: boolean;
  /** DEMO ONLY */
  demoPartners?: { name: string; city: string; blurb: string }[];
}

export const MAX_SEATS_PER_CATEGORY = 5;

export const MEMBERSHIP_PRICE_USD = 1200;
export const EXCLUSIVITY_PREMIUM_USD = 5000;

export const getCategoryStatus = (c: PartnerCategory): CategoryStatus => {
  if (c.exclusive) return 'exclusive';
  if (MAX_SEATS_PER_CATEGORY - c.seatsTaken <= 2) return 'last-seats';
  return 'available';
};

export const CATEGORY_STATUS_LABEL: Record<CategoryStatus, string> = {
  available: 'Disponible',
  'last-seats': 'Últimas plazas',
  exclusive: 'Categoría exclusiva',
};

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    slug: 'residencia-migraciones',
    name: 'Residencia y migraciones',
    description: 'Residencia temporal y permanente, cédula, apostillas y trámites migratorios.',
    seatsTaken: 4,
    demoPartners: [
      { name: 'Estudio Migratorio Ñande (demo)', city: 'Asunción', blurb: 'Residencia permanente y SUACE.' },
      { name: 'Guaraní Legal Partners (demo)', city: 'Asunción', blurb: 'Trámites express para inversionistas.' },
    ],
  },
  {
    slug: 'legal-corporativo',
    name: 'Legal y corporativo',
    description: 'Asesoría societaria, contratos, compliance y representación legal.',
    seatsTaken: 2,
  },
  {
    slug: 'contabilidad-impuestos',
    name: 'Contabilidad e impuestos',
    description: 'IRP, IVA, renta territorial, contabilidad mensual y planificación fiscal.',
    seatsTaken: 3,
    demoPartners: [
      { name: 'Tributaria Sur (demo)', city: 'Asunción', blurb: 'Contabilidad para extranjeros y SRL.' },
    ],
  },
  {
    slug: 'inmobiliaria',
    name: 'Inmobiliaria',
    description: 'Alquiler y compra de vivienda, oficinas y proyectos de inversión.',
    seatsTaken: 5,
    exclusive: true,
    demoPartners: [
      { name: 'Tekoha Estate (demo)', city: 'Asunción', blurb: 'Vivienda e inversión para expatriados.' },
    ],
  },
  {
    slug: 'banca-fintech',
    name: 'Banca y fintech',
    description: 'Apertura de cuentas, banca corporativa, cambio de divisas y pagos.',
    seatsTaken: 1,
  },
  {
    slug: 'seguros',
    name: 'Seguros',
    description: 'Seguros de salud, vida, hogar y automotor para residentes extranjeros.',
    seatsTaken: 2,
  },
  {
    slug: 'salud-privada',
    name: 'Salud privada',
    description: 'Clínicas, medicina prepaga, especialistas y atención en varios idiomas.',
    seatsTaken: 3,
  },
  {
    slug: 'colegios-internacionales',
    name: 'Colegios internacionales',
    description: 'Educación bilingüe e internacional para familias que se instalan.',
    seatsTaken: 4,
  },
  {
    slug: 'constitucion-empresas',
    name: 'Constitución de empresas',
    description: 'SRL, SAS, EAS, habilitaciones municipales y registro de marcas.',
    seatsTaken: 2,
  },
  {
    slug: 'relocation',
    name: 'Relocation',
    description: 'Acompañamiento integral de llegada, orientación y soft landing.',
    seatsTaken: 1,
  },
  {
    slug: 'vehiculos',
    name: 'Vehículos',
    description: 'Compra, importación, alquiler mensual y transferencia de rodados.',
    seatsTaken: 2,
  },
  {
    slug: 'telecom-internet',
    name: 'Telecomunicaciones e internet',
    description: 'Fibra óptica, líneas móviles y conectividad para trabajo remoto.',
    seatsTaken: 1,
  },
  {
    slug: 'mudanzas-logistica',
    name: 'Mudanzas y logística',
    description: 'Mudanza internacional, despacho aduanero y almacenamiento.',
    seatsTaken: 3,
  },
  {
    slug: 'arquitectos',
    name: 'Arquitectos',
    description: 'Proyecto arquitectónico, diseño, documentación técnica y dirección profesional.',
    seatsTaken: 2,
  },
  {
    slug: 'construccion-reformas',
    name: 'Construcción y reformas',
    description: 'Construcción, remodelaciones, ampliaciones, dirección de obra y reformas integrales.',
    seatsTaken: 0,
  },
  {
    slug: 'eventos',
    name: 'Eventos',
    description: 'Organización, producción, catering, espacios y servicios profesionales para eventos.',
    seatsTaken: 0,
  },
  {
    slug: 'guarderia-cuidadores-infantiles',
    name: 'Guardería y cuidadores infantiles',
    description: 'Guarderías, cuidado infantil, niñeras y apoyo profesional para familias.',
    seatsTaken: 0,
  },
  {
    slug: 'cuidado-mayores',
    name: 'Cuidado de mayores',
    description: 'Asistencia domiciliaria, acompañamiento y cuidadores profesionales para personas mayores.',
    seatsTaken: 0,
  },
  {
    slug: 'manitas-24-horas',
    name: 'Servicio manitas 24 horas',
    description: 'Reparaciones urgentes y pequeñas incidencias del hogar con atención disponible las 24 horas.',
    seatsTaken: 0,
  },
  {
    slug: 'veterinaria',
    name: 'Servicio de Veterinaria',
    description: 'Clínicas veterinarias, consultas, urgencias, vacunación y atención sanitaria para mascotas.',
    seatsTaken: 0,
  },
  {
    slug: 'cuidado-mascotas',
    name: 'Cuidado de mascotas',
    description: 'Pet sitting, paseos, guardería, alojamiento y cuidado de mascotas a domicilio.',
    seatsTaken: 0,
  },
  {
    slug: 'chefs-domicilio',
    name: 'Chefs a domicilio',
    description: 'Chefs privados, cocina a domicilio, menús personalizados y servicios gastronómicos para hogares y eventos.',
    seatsTaken: 0,
  },
  {
    slug: 'servicios-hogar',
    name: 'Servicios para el hogar',
    description: 'Mantenimiento, climatización, seguridad y personal doméstico.',
    seatsTaken: 1,
  },
  {
    slug: 'traduccion',
    name: 'Traducción',
    description: 'Traductores públicos matriculados y traducción jurada de documentos.',
    seatsTaken: 4,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Marca, contenidos, medios y generación de demanda local.',
    seatsTaken: 1,
  },
  {
    slug: 'tecnologia-ia',
    name: 'Web, IA y tecnología',
    description: 'Desarrollo de software, automatización e inteligencia artificial aplicada.',
    seatsTaken: 2,
  },
  {
    slug: 'recursos-humanos',
    name: 'Recursos humanos',
    description: 'Selección de talento, nómina, IPS y contratación local.',
    seatsTaken: 1,
  },
  {
    slug: 'viajes',
    name: 'Viajes',
    description: 'Vuelos, viajes corporativos y experiencias por Paraguay.',
    seatsTaken: 0,
  },
  {
    slug: 'hospitalidad-lifestyle',
    name: 'Hospitalidad y lifestyle',
    description: 'Hoteles, gastronomía, clubes y experiencias para la comunidad.',
    seatsTaken: 3,
  },
];

export interface ClubEvent {
  title: string;
  format: string;
  cadence: string;
  description: string;
  audience: 'expats' | 'partners' | 'both';
}

export const CLUB_EVENTS: ClubEvent[] = [
  {
    title: 'Welcome Breakfast',
    format: 'Presencial · Asunción',
    cadence: 'Mensual',
    description:
      'Desayuno de bienvenida para quienes acaban de llegar: presentaciones, dudas reales y contactos útiles desde el primer día.',
    audience: 'expats',
  },
  {
    title: 'Business Networking',
    format: 'Presencial · Asunción',
    cadence: 'Mensual',
    description:
      'Encuentro entre partners y miembros de la comunidad con intención de negocio: presentación breve, mesas temáticas y seguimiento.',
    audience: 'both',
  },
  {
    title: 'Sesiones prácticas de relocation',
    format: 'Online y presencial',
    cadence: 'Quincenal',
    description:
      'Sesiones cortas sobre residencia, impuestos, banca, colegios y vivienda, con especialistas verificados de la red.',
    audience: 'expats',
  },
  {
    title: 'Mesa de partners',
    format: 'Privado · solo miembros',
    cadence: 'Trimestral',
    description:
      'Espacio cerrado para revisar demanda de la comunidad, derivaciones y oportunidades conjuntas entre categorías.',
    audience: 'partners',
  },
];

export interface JourneyStage {
  id: string;
  title: string;
  subtitle: string;
  steps: { label: string; description: string; to?: string; external?: boolean }[];
}

export const RELOCATION_JOURNEY: JourneyStage[] = [
  {
    id: 'antes',
    title: 'Antes de llegar',
    subtitle: 'Documentación, expectativas y presupuesto antes del vuelo.',
    steps: [
      {
        label: 'Entender la residencia',
        description: 'Temporal, permanente y la vía inversionista SUACE: qué te conviene según tu caso.',
        to: '/permits',
      },
      {
        label: 'Apostillar y traducir documentos',
        description: 'Partida de nacimiento, antecedentes penales y la Apostilla de La Haya.',
        to: '/blog/apostillar-documentos',
      },
      {
        label: 'Calcular tu costo de vida',
        description: 'Presupuesto realista por perfil: soltero, pareja o familia.',
        to: '/blog/costo-de-vida-paraguay',
      },
      {
        label: 'Elegir zona y colegio',
        description: 'Barrios de Asunción y colegios internacionales según tu familia.',
        to: '/neighborhoods',
      },
    ],
  },
  {
    id: 'primeros-30',
    title: 'Primeros 30 días',
    subtitle: 'Los trámites que desbloquean todo lo demás.',
    steps: [
      { label: 'Iniciar residencia', description: 'Presentación de carpeta y seguimiento del expediente.', to: '/permits' },
      { label: 'Cédula de identidad', description: 'La llave para banca, contratos y servicios.', to: '/permits' },
      { label: 'Vivienda temporal y definitiva', description: 'Alquiler, garantías y contratos.', to: 'https://tekoha.estate', external: true },
      { label: 'Línea móvil e internet', description: 'Conectividad estable para trabajo remoto.', to: '/faq' },
    ],
  },
  {
    id: 'instalarse',
    title: 'Instalarse',
    subtitle: 'Vida cotidiana: salud, familia, finanzas y comunidad.',
    steps: [
      { label: 'Salud y seguros', description: 'Medicina prepaga, IPS y cobertura para la familia.', to: '/social-security' },
      { label: 'Colegios y familia', description: 'Admisiones, calendarios y costos por institución.', to: '/schools' },
      { label: 'Banca personal', description: 'Apertura de cuentas y manejo de divisas.', to: '/faq' },
      { label: 'Comunidad', description: 'Eventos, desayunos y networking para no empezar de cero.', to: '/comunidad' },
    ],
  },
  {
    id: 'emprender',
    title: 'Emprender',
    subtitle: 'Empresa, fiscalidad e inversión con reglas claras.',
    steps: [
      { label: 'Fiscalidad territorial', description: 'IRP, IVA y qué se grava realmente en Paraguay.', to: '/taxation' },
      { label: 'Constituir tu empresa', description: 'SAS, SRL, habilitaciones y aportes al IPS.', to: '/social-security' },
      { label: 'Inversión inmobiliaria', description: 'Marco fiscal y oportunidades para inversionistas.', to: '/blog/inversion-inmobiliaria-paraguay' },
      { label: 'Encontrar profesionales', description: 'Contadores, abogados y bancos verificados por el Club.', to: '/profesionales' },
    ],
  },
];

export interface ResourceLink {
  title: string;
  description: string;
  to: string;
  external?: boolean;
  tag: string;
}

export const CLUB_RESOURCES: ResourceLink[] = [
  { title: 'Guía de residencia y cédula', description: 'Requisitos, plazos y costos actualizados de la residencia paraguaya.', to: '/permits', tag: 'Residencia' },
  { title: 'Calculadora de impuestos', description: 'Estima tu IRP sobre renta neta y compara con otros países.', to: '/taxation', tag: 'Fiscalidad' },
  { title: 'Colegios internacionales', description: '16 instituciones con costos, idiomas y perfiles académicos.', to: '/schools', tag: 'Familia' },
  { title: 'Barrios de Asunción', description: 'Los 10 barrios más elegidos y para qué perfil funciona cada uno.', to: '/neighborhoods', tag: 'Vivienda' },
  { title: 'Seguridad social e IPS', description: 'Aportes de empleados, empleadores e independientes.', to: '/social-security', tag: 'Salud' },
  { title: 'Blog y análisis', description: 'Artículos sobre apostillas, costo de vida, inversión y marco fiscal.', to: '/blog', tag: 'Análisis' },
];

export const HOME_NEED_CARDS = [
  { icon: 'FileCheck', title: 'Residencia y documentación', description: 'Residencia temporal o permanente, cédula, apostillas y traducciones juradas.', to: '/permits' },
  { icon: 'Home', title: 'Vivienda', description: 'Alquilar o comprar en los barrios adecuados, con contratos claros.', to: 'https://tekoha.estate', external: true },
  { icon: 'Briefcase', title: 'Empresa y fiscalidad', description: 'Constitución de empresas, renta territorial, IRP e IVA sin sorpresas.', to: '/taxation' },
  { icon: 'Landmark', title: 'Banca y finanzas', description: 'Apertura de cuentas, divisas y estructura financiera local.', to: '/profesionales' },
  { icon: 'GraduationCap', title: 'Colegios y familia', description: 'Colegios internacionales, admisiones y vida familiar en Asunción.', to: '/schools' },
  { icon: 'HeartPulse', title: 'Salud y seguros', description: 'Medicina prepaga, IPS, clínicas y coberturas para toda la familia.', to: '/social-security' },
] as const;
