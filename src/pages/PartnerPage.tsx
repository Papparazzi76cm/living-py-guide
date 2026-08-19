import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Users, Crown, LineChart, CalendarDays, BadgeCheck, MapPin } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PartnerApplicationForm } from '../components/club/PartnerApplicationForm';
import {
  ALL_PARTNER_CATEGORIES,
  DEFAULT_PARTNER_ZONE,
  MEMBERSHIP_TIERS,
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
  { icon: Users, title: 'Derivaciones cualificadas', text: 'Leads de personas que ya están mudándose o instalándose, con contexto y necesidad concreta.' },
  { icon: BadgeCheck, title: 'Posicionamiento verificado', text: 'Perfil admitido y revisado dentro del directorio cerrado del Club.' },
  { icon: CalendarDays, title: 'Eventos y networking', text: 'Welcome Breakfast, Business Networking y mesas de partners cada mes.' },
  { icon: ShieldCheck, title: 'Visibilidad en la comunidad', text: 'Presencia en contenidos, sesiones prácticas y recursos del Club.' },
  { icon: LineChart, title: 'Atribución y ROI (próximamente)', text: 'CRM de derivaciones para seguir lead, contacto, propuesta y negocio cerrado.' },
  { icon: Crown, title: 'Derecho preferente de exclusividad', text: 'Disponible para categorías A, B y C si se cumplen los requisitos de idiomas y disponibilidad del rubro en la zona.' },
];

const TIER_ORDER: MembershipTier[] = ['A', 'B', 'C', 'D'];

const getTierZonePrices = (tierKey: MembershipTier, zoneSlug: PartnerZoneSlug) => {
  const tier = MEMBERSHIP_TIERS[tierKey];
  const zone = PARTNER_ZONES[zoneSlug];
  const membership = tier.open ? 0 : Math.round(tier.priceUsd * zone.membershipFactor);
  const exclusivity = !tier.exclusivityAllowed
    ? 0
    : zoneSlug === DEFAULT_PARTNER_ZONE
      ? tier.exclusivityPriceUsd
      : membership * 2;
  return { membership, exclusivity };
};

const PartnerPage = () => {
  const [params] = useSearchParams();
  const slug = params.get('categoria');
  const zoneParam = params.get('zona') as PartnerZoneSlug | null;
  const preselected = ALL_PARTNER_CATEGORIES.some((category) => category.slug === slug) ? slug ?? '' : '';
  const defaultZone = zoneParam && PARTNER_ZONE_ORDER.includes(zoneParam) ? zoneParam : DEFAULT_PARTNER_ZONE;

  return (
    <Layout
      title="Ser Partner del Business Club"
      description="Membresías profesionales por zona: Gran Asunción, Itapúa (Encarnación) y Ciudad del Este. Categorías A-D, límites de plazas y exclusividad según territorio."
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="club-eyebrow text-primary">Membresía profesional por zona</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
                Tu próximo cliente puede estar aterrizando hoy en Paraguay.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Living Paraguay organiza la red por territorios independientes. Gran Asunción mantiene el modelo principal; Itapúa (Encarnación) y Ciudad del Este tienen cuotas al 50% y un máximo de 3 empresas por rubro en A, B y C.
              </p>
              <a href="#postular" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                Postular ahora
              </a>
            </div>

            <div className="grid gap-3">
              {PARTNER_ZONE_ORDER.map((zoneSlug) => {
                const zone = PARTNER_ZONES[zoneSlug];
                return (
                  <div key={zone.slug} className={`rounded-3xl border p-6 backdrop-blur ${zoneSlug === DEFAULT_PARTNER_ZONE ? 'border-primary/35 bg-primary/10' : 'border-white/15 bg-white/5'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="font-semibold text-white">{zone.name}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                        {zone.membershipFactor === 1 ? 'Tarifa base' : '50% tarifa'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/60">{zone.coverage}</p>
                    <p className="mt-3 text-xs font-semibold text-primary">Máximo {zone.maxSeats} empresas por rubro A-C</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="tarifas" className="scroll-mt-24 bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Tarifas y límites por zona</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            La clasificación A-D es la misma en todo Paraguay. Lo que cambia por zona es el precio de la membresía, el máximo de empresas por rubro y el coste del bloqueo exclusivo.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {PARTNER_ZONE_ORDER.map((zoneSlug) => {
              const zone = PARTNER_ZONES[zoneSlug];
              return (
                <article key={zone.slug} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Zona</p>
                      <h3 className="mt-2 text-xl font-bold text-ink">{zone.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{zone.coverage}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Máx. {zone.maxSeats}</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {TIER_ORDER.map((tierKey) => {
                      const tier = MEMBERSHIP_TIERS[tierKey];
                      const prices = getTierZonePrices(tierKey, zoneSlug);
                      return (
                        <div key={tierKey} className="rounded-2xl border border-border bg-background p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold text-ink">Categoría {tierKey}</span>
                            <span className="text-sm font-semibold text-primary">
                              {prices.membership === 0 ? 'Gratis' : `USD ${prices.membership.toLocaleString('en-US')}/año`}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{tier.ticketProfile}</p>
                          {tier.exclusivityAllowed ? (
                            <p className="mt-2 text-xs font-semibold text-ink-soft">Bloqueo: USD {prices.exclusivity.toLocaleString('en-US')}/año adicionales</p>
                          ) : (
                            <p className="mt-2 text-xs font-semibold text-muted-foreground">Sin exclusividad · sin límite de plazas</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
            {[
              { t: 'Gran Asunción', d: 'A/B/C: 5 empresas por rubro. Membresías USD 2.400 / 1.200 / 600. Bloqueos USD 7.500 / 4.500 / 1.500.' },
              { t: 'Itapúa (Encarnación)', d: 'A/B/C: 3 empresas por rubro. Membresías USD 1.200 / 600 / 300. Bloqueos USD 2.400 / 1.200 / 600.' },
              { t: 'Ciudad del Este', d: 'A/B/C: 3 empresas por rubro. Membresías USD 1.200 / 600 / 300. Bloqueos USD 2.400 / 1.200 / 600.' },
            ].map((item) => (
              <div key={item.t} className="club-card rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink">Reglas comunes a las tres zonas</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-ink">Toda empresa de Categoría A</strong><br />Debe poder atender a sus clientes, como mínimo, en español e inglés.
              </div>
              <div className="rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-ink">Cualquier empresa que solicite exclusividad</strong><br />Debe poder atender, como mínimo, en español, inglés, alemán y portugués.
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">La categoría D permanece abierta y gratuita en todas las zonas y nunca admite bloqueo por exclusividad.</p>
          </div>

          <h2 className="mt-16 text-2xl font-bold text-ink sm:text-3xl">Beneficios de la membresía</h2>
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
            <p className="club-eyebrow text-clay">Garantía comercial</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Garantía de 30 días para membresías A, B y C</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Si durante los primeros 30 días de una membresía de pago no se genera ningún cliente atribuible a través del Club, puedes solicitar la devolución íntegra de la inversión de membresía.
            </p>
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="cond" className="border-clay/20">
                <AccordionTrigger className="text-left text-sm font-semibold text-ink">Condiciones de participación (borrador)</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-ink-soft">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Perfil de partner completo y publicado en el directorio.</li>
                    <li>Respuesta a cada derivación dentro de las 24 horas hábiles.</li>
                    <li>Asistencia a los encuentros de comunidad del período.</li>
                    <li>Registro del estado de cada lead recibido (contactado, propuesta, cerrado, perdido).</li>
                    <li>Solicitud de devolución dentro de los 7 días posteriores al día 30.</li>
                  </ul>
                  <p className="mt-4 text-xs">Texto preliminar. Las condiciones definitivas se entregan por escrito antes de la firma de la membresía y prevalecen sobre este resumen.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="postular" className="scroll-mt-24 bg-sand py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Postulación de partner</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">Selecciona tu zona y rubro. El formulario calculará automáticamente la cuota y el coste de exclusividad aplicables.</p>
          <div className="mt-8"><PartnerApplicationForm defaultCategory={preselected} defaultZone={defaultZone} /></div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerPage;