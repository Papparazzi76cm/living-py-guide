import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarDays, Crown, LineChart, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PartnerApplicationForm } from '../components/club/PartnerApplicationForm';
import {
  ALL_PARTNER_CATEGORIES,
  DEFAULT_PARTNER_ZONE,
  PARTNER_ZONE_ORDER,
  PARTNER_ZONES,
  type MembershipTier,
  type PartnerZoneSlug,
} from '../data/membershipCatalog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const BENEFITS = [
  { icon: Users, title: 'Derivaciones cualificadas', text: 'Leads de personas que ya están mudándose o instalándose, con contexto y una necesidad concreta.' },
  { icon: BadgeCheck, title: 'Posicionamiento verificado', text: 'Perfil admitido y revisado dentro del directorio profesional del Club.' },
  { icon: CalendarDays, title: 'Eventos y networking', text: 'Welcome Breakfast, Business Networking y mesas de partners para crear relaciones y negocio.' },
  { icon: ShieldCheck, title: 'Visibilidad en la comunidad', text: 'Presencia en contenidos, sesiones prácticas y recursos del Club.' },
  { icon: LineChart, title: 'Atribución y ROI', text: 'Trazabilidad de derivaciones para poder medir contacto, propuesta y negocio generado.' },
  { icon: Crown, title: 'Exclusividad disponible', text: 'Las categorías A, B y C pueden optar al bloqueo de rubro cuando exista disponibilidad y se cumplan los requisitos.' },
];

const TIER_CARDS: Array<{ tier: MembershipTier; title: string; text: string; slug: string }> = [
  { tier: 'A', title: 'Alto valor estratégico', text: 'Servicios donde una operación puede generar un retorno elevado y la confianza es decisiva.', slug: 'categoria-a' },
  { tier: 'B', title: 'Valor medio y recurrencia', text: 'Actividades con buen valor por cliente, recurrencia o capacidad de venta cruzada.', slug: 'categoria-b' },
  { tier: 'C', title: 'Volumen y frecuencia', text: 'Servicios cuyo retorno se construye a través de múltiples derivaciones y demanda recurrente.', slug: 'categoria-c' },
  { tier: 'D', title: 'Servicios de apoyo', text: 'Modelo abierto para actividades útiles en el día a día de la comunidad, sin exclusividad.', slug: 'categoria-d' },
];

const PartnerPage = () => {
  const [params] = useSearchParams();
  const slug = params.get('categoria');
  const zoneParam = params.get('zona') as PartnerZoneSlug | null;
  const preselected = ALL_PARTNER_CATEGORIES.some((category) => category.slug === slug) ? slug ?? '' : '';
  const defaultZone = zoneParam && PARTNER_ZONE_ORDER.includes(zoneParam) ? zoneParam : DEFAULT_PARTNER_ZONE;

  return (
    <Layout
      title="Ser Partner del Living Paraguay Business Club"
      description="Postula tu empresa al Living Paraguay Business Club. Conoce el modelo A-D, las zonas de actividad, los requisitos y el proceso de admisión."
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="club-eyebrow text-primary">Red profesional verificada</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
                Tu próximo cliente puede estar aterrizando hoy en Paraguay.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Living Paraguay conecta a expatriados, familias, emprendedores e inversionistas con una red limitada de empresas y profesionales seleccionados por rubro y territorio.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                Primero revisamos el encaje de tu empresa, la categoría y la disponibilidad. Las condiciones comerciales y modalidades de membresía se presentan después, de forma personalizada.
              </p>
              <a href="#postular" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                Postular mi empresa
              </a>
            </div>

            <div className="grid gap-3">
              {PARTNER_ZONE_ORDER.map((zoneSlug) => {
                const zone = PARTNER_ZONES[zoneSlug];
                return (
                  <div key={zone.slug} className={`rounded-3xl border p-6 backdrop-blur ${zoneSlug === DEFAULT_PARTNER_ZONE ? 'border-primary/35 bg-primary/10' : 'border-white/15 bg-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-semibold text-white">{zone.name}</p>
                    </div>
                    <p className="mt-2 text-sm text-white/60">{zone.coverage}</p>
                    <p className="mt-3 text-xs font-semibold text-primary">
                      {zoneSlug === DEFAULT_PARTNER_ZONE ? 'Hasta 5 empresas por rubro A-C' : 'Hasta 3 empresas por rubro A-C'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="club-eyebrow justify-center text-primary">Modelo de membresía</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-4xl">Cuatro categorías. Cuatro perfiles de negocio.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              La clasificación A-D se basa en el valor potencial por cliente, recurrencia y volumen de derivaciones. Cada categoría cuenta con su propia página para entender el encaje antes de postular.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIER_CARDS.map((item) => (
              <Link key={item.tier} to={`/ser-partner/${item.slug}`} className="club-card group flex flex-col rounded-2xl border border-border bg-card p-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Categoría {item.tier}</span>
                <h3 className="mt-3 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Conocer categoría <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-ink">Tarifas a consultar tras la revisión de la candidatura.</strong> La propuesta se adapta a la categoría, la zona, la disponibilidad y el tipo de participación solicitado.
            </p>
          </div>

          <h2 className="mt-16 text-2xl font-bold text-ink sm:text-3xl">Qué obtiene un Partner</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="club-card rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><benefit.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="garantia" className="scroll-mt-24 bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl border border-clay/30 bg-clay-soft p-7 sm:p-10">
            <p className="club-eyebrow text-clay">Compromiso comercial</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Garantía de 30 días para las membresías de pago</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Si durante los primeros 30 días no se genera ningún cliente atribuible a través del Club, la empresa puede solicitar la devolución íntegra de la inversión de membresía, conforme a las condiciones entregadas antes de la firma.
            </p>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="cond" className="border-clay/20">
                <AccordionTrigger className="text-left text-sm font-semibold text-ink">Condiciones de participación</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-ink-soft">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Perfil de partner completo y publicado en el directorio.</li>
                    <li>Respuesta a cada derivación dentro de las 24 horas hábiles.</li>
                    <li>Participación en los encuentros definidos para el período.</li>
                    <li>Registro del estado de cada lead recibido.</li>
                    <li>Solicitud de devolución dentro del plazo indicado en las condiciones contractuales.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="postular" className="scroll-mt-24 bg-sand py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Postulación de Partner</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Selecciona tu zona y rubro. Revisaremos el perfil, la categoría y la disponibilidad antes de presentarte las condiciones comerciales y modalidades aplicables.
          </p>
          <div className="mt-8"><PartnerApplicationForm defaultCategory={preselected} defaultZone={defaultZone} /></div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerPage;
