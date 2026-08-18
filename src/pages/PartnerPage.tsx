import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Users, Crown, LineChart, CalendarDays, BadgeCheck } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PartnerApplicationForm } from '../components/club/PartnerApplicationForm';
import {
  PARTNER_CATEGORIES,
  MEMBERSHIP_PRICE_USD,
  EXCLUSIVITY_PREMIUM_USD,
  MAX_SEATS_PER_CATEGORY,
} from '../data/clubData';
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
  { icon: Crown, title: 'Derecho preferente de exclusividad', text: 'El primer miembro admitido en una categoría puede bloquearla para la competencia.' },
];

const PartnerPage = () => {
  const [params] = useSearchParams();
  const slug = params.get('categoria');
  const preselected = PARTNER_CATEGORIES.some((category) => category.slug === slug) ? slug ?? '' : '';

  return (
    <Layout
      title="Ser Partner del Business Club"
      description="Membresía anual USD 1.200, máximo 5 partners por categoría, exclusividad opcional y garantía comercial de 30 días. Postulá al Living Paraguay Business Club."
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="club-eyebrow text-primary">Membresía profesional</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
              Tu próximo cliente puede estar aterrizando hoy en Paraguay.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              El Club recibe a los recién llegados y los deriva a una red cerrada de profesionales
              verificados. Solo {MAX_SEATS_PER_CATEGORY} miembros activos por categoría.
            </p>
            <a href="#postular" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
              Postular ahora
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Membresía anual</p>
              <p className="mt-2 text-4xl font-bold text-white">USD {MEMBERSHIP_PRICE_USD.toLocaleString('en-US')}</p>
              <p className="mt-2 text-sm text-white/60">Acceso completo a derivaciones, directorio y eventos.</p>
            </div>
            <div className="rounded-3xl border border-primary/40 bg-primary/10 p-7 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Exclusividad de categoría</p>
              <p className="mt-2 text-4xl font-bold text-white">+ USD {EXCLUSIVITY_PREMIUM_USD.toLocaleString('en-US')}</p>
              <p className="mt-2 text-sm text-white/70">Adicional a la membresía. Bloquea tu rubro mientras la exclusividad esté vigente.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Cómo funcionan las plazas</h2>
          <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
            {[
              { t: `Máximo ${MAX_SEATS_PER_CATEGORY} por categoría`, d: 'Cuando una categoría llega a cinco miembros activos, se cierra hasta que se libere una plaza.' },
              { t: 'Derecho preferente', d: 'El primer miembro admitido en una categoría tiene prioridad para solicitar la exclusividad del rubro.' },
              { t: 'Nadie pierde su plaza', d: 'Un miembro admitido nunca es expulsado porque otro quiera exclusividad. La categoría solo se vuelve exclusiva si no hay otros miembros activos o cuando sus términos finalizan.' },
            ].map((item) => (
              <div key={item.t} className="club-card rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
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
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Garantía de 30 días</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Si durante los primeros 30 días de tu membresía no se genera ningún cliente atribuible a través del Club, puedes solicitar la devolución íntegra de la inversión de membresía.
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
