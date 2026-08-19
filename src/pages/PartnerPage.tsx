import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Users, Crown, LineChart, CalendarDays, BadgeCheck } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PartnerApplicationForm } from '../components/club/PartnerApplicationForm';
import { MAX_SEATS_PER_CATEGORY } from '../data/clubData';
import {
  ALL_PARTNER_CATEGORIES,
  MEMBERSHIP_TIERS,
  type MembershipTier,
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
  { icon: Crown, title: 'Derecho preferente de exclusividad', text: 'Disponible para categorías A, B y C si se cumplen los requisitos de idiomas y disponibilidad del rubro.' },
];

const TIER_ORDER: MembershipTier[] = ['A', 'B', 'C', 'D'];

const PartnerPage = () => {
  const [params] = useSearchParams();
  const slug = params.get('categoria');
  const preselected = ALL_PARTNER_CATEGORIES.some((category) => category.slug === slug) ? slug ?? '' : '';

  return (
    <Layout
      title="Ser Partner del Business Club"
      description="Membresías profesionales A, B, C y D según el valor medio de cada rubro, plazas limitadas en A-C, categoría D abierta y exclusividad sujeta a requisitos de idiomas."
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="club-eyebrow text-primary">Membresía profesional</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
                Tu próximo cliente puede estar aterrizando hoy en Paraguay.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                El Club recibe a los recién llegados y los deriva a una red de profesionales verificados. Las categorías A, B y C admiten hasta {MAX_SEATS_PER_CATEGORY} miembros activos; la D permanece abierta y sin cuota.
              </p>
              <a href="#postular" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                Postular ahora
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {TIER_ORDER.map((tierKey) => {
                const tier = MEMBERSHIP_TIERS[tierKey];
                return (
                  <div key={tierKey} className={`rounded-3xl border p-6 backdrop-blur ${tierKey === 'D' ? 'border-secondary/40 bg-secondary/10' : 'border-white/15 bg-white/5'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Categoría {tier.tier}</p>
                      {tier.open && <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">Abierta</span>}
                    </div>
                    <p className="mt-2 text-3xl font-bold text-white">
                      {tier.priceUsd === 0 ? 'Sin cuota' : `USD ${tier.priceUsd.toLocaleString('en-US')}`}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{tier.priceUsd === 0 ? 'sin membresía anual' : 'por año'}</p>
                    <p className="mt-3 text-sm font-medium text-white/80">{tier.ticketProfile}</p>
                    <p className="mt-2 text-xs leading-relaxed text-white/55">{tier.description}</p>
                    {tier.exclusivityAllowed && (
                      <p className="mt-3 border-t border-white/10 pt-3 text-xs font-semibold text-primary">
                        Bloqueo exclusivo: USD {tier.exclusivityPriceUsd.toLocaleString('en-US')}/año
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm leading-relaxed text-white/75">
            <strong className="text-white">Exclusividad:</strong> A: USD 7.500/año · B: USD 4.500/año · C: USD 1.500/año. Para solicitarla, la empresa debe poder atender como mínimo en español, inglés, alemán y portugués. La Categoría D no admite exclusividad.
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Cómo funcionan las categorías</h2>
          <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-4">
            {[
              { t: 'A · USD 2.400/año', d: 'Alto ticket o alto valor por cliente. Requisito indispensable: atención en español e inglés. Exclusividad: USD 7.500/año.' },
              { t: 'B · USD 1.200/año', d: 'Ticket medio, recurrencia o buen potencial de venta cruzada. Exclusividad: USD 4.500/año.' },
              { t: 'C · USD 600/año', d: 'Ticket bajo-medio donde el retorno depende más del volumen de derivaciones. Exclusividad: USD 1.500/año.' },
              { t: 'D · Abierta y gratuita', d: 'Sin cuota de membresía, sin límite de plazas y sin posibilidad de bloqueo por exclusividad.' },
            ].map((item) => (
              <div key={item.t} className="club-card rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
            {[
              { t: `Máximo ${MAX_SEATS_PER_CATEGORY} por rubro en A-C`, d: 'Cuando una categoría A, B o C llega a cinco miembros activos, se cierra hasta que se libere una plaza.' },
              { t: 'Derecho preferente', d: 'El primer miembro admitido puede solicitar la exclusividad si el rubro lo permite y cumple los requisitos lingüísticos.' },
              { t: 'Categoría D siempre abierta', d: 'Los rubros D priorizan utilidad para la comunidad: pueden incorporarse nuevos proveedores sin cuota ni límite de plazas.' },
            ].map((item) => (
              <div key={item.t} className="club-card rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink">Requisitos de idiomas</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-ink">Toda empresa de Categoría A</strong><br />Debe poder atender a sus clientes, como mínimo, en español e inglés.
              </div>
              <div className="rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-muted-foreground">
                <strong className="text-ink">Cualquier empresa que solicite exclusividad</strong><br />Debe poder atender, como mínimo, en español, inglés, alemán y portugués.
              </div>
            </div>
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
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">Cuéntanos quién eres y qué resuelves. Sin pago en esta etapa.</p>
          <div className="mt-8"><PartnerApplicationForm defaultCategory={preselected} /></div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerPage;
