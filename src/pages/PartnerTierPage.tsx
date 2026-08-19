import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, Globe2, LockKeyhole, Users } from 'lucide-react';
import { Layout } from '../components/Layout';
import {
  ALL_PARTNER_CATEGORIES,
  getMembershipTier,
  PARTNER_ZONE_ORDER,
  PARTNER_ZONES,
  type MembershipTier,
} from '../data/membershipCatalog';

const SLUG_TO_TIER: Record<string, MembershipTier> = {
  'categoria-a': 'A',
  'categoria-b': 'B',
  'categoria-c': 'C',
  'categoria-d': 'D',
};

const PUBLIC_TIER_COPY: Record<MembershipTier, {
  eyebrow: string;
  title: string;
  lead: string;
  profile: string;
  exclusivity: string;
}> = {
  A: {
    eyebrow: 'Categoría A',
    title: 'Servicios de alto valor y relación estratégica.',
    lead: 'Pensada para actividades donde una sola operación o relación comercial puede generar un valor elevado y donde la confianza del cliente es decisiva.',
    profile: 'Buscamos empresas con experiencia demostrable, capacidad de respuesta rápida y atención profesional a clientes internacionales.',
    exclusivity: 'Puede optar a bloqueo por exclusividad cuando el rubro esté disponible y se cumplan los requisitos de idiomas.',
  },
  B: {
    eyebrow: 'Categoría B',
    title: 'Servicios de valor medio y relación recurrente.',
    lead: 'Agrupa actividades con buena capacidad de retorno por cliente, recurrencia o potencial de venta cruzada dentro de la comunidad.',
    profile: 'Priorizamos empresas capaces de acompañar al expatriado durante varias fases de su instalación o actividad en Paraguay.',
    exclusivity: 'Puede optar a bloqueo por exclusividad cuando el rubro esté disponible y se cumplan los requisitos de idiomas.',
  },
  C: {
    eyebrow: 'Categoría C',
    title: 'Servicios donde el volumen y la recurrencia importan.',
    lead: 'Incluye actividades con una demanda frecuente dentro de la comunidad y donde el retorno se construye a través de múltiples derivaciones.',
    profile: 'Valoramos especialmente disponibilidad, cobertura operativa y una experiencia de cliente consistente.',
    exclusivity: 'Puede optar a bloqueo por exclusividad cuando el rubro esté disponible y se cumplan los requisitos de idiomas.',
  },
  D: {
    eyebrow: 'Categoría D',
    title: 'Servicios de apoyo y conveniencia para la comunidad.',
    lead: 'Reúne actividades útiles para el día a día del expatriado que funcionan mejor con un modelo abierto y una oferta amplia de proveedores.',
    profile: 'Buscamos profesionales fiables, ágiles y con capacidad real de atención en la zona elegida.',
    exclusivity: 'Es una categoría abierta y no contempla bloqueo por exclusividad.',
  },
};

const PartnerTierPage = () => {
  const { tierSlug = '' } = useParams();
  const tier = SLUG_TO_TIER[tierSlug];

  if (!tier) return <Navigate to="/ser-partner" replace />;

  const copy = PUBLIC_TIER_COPY[tier];
  const categories = ALL_PARTNER_CATEGORIES
    .filter((category) => getMembershipTier(category) === tier)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return (
    <Layout
      title={`${copy.eyebrow} · Partners Living Paraguay`}
      description={`${copy.title} Conoce el encaje, requisitos y rubros de ${copy.eyebrow} del Living Paraguay Business Club.`}
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <Link to="/ser-partner" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver a Ser Partner
          </Link>
          <p className="club-eyebrow mt-8 text-primary">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-lg">{copy.lead}</p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/70">
            <strong className="text-white">Condiciones comerciales a consultar.</strong> Las tarifas y modalidades se presentan de forma personalizada después de revisar el perfil, la zona, el rubro y la disponibilidad real.
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <BadgeCheck className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-bold text-ink">Perfil buscado</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.profile}</p>
            </article>
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-bold text-ink">Plazas por zona</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tier === 'D'
                  ? 'Modelo abierto, sin límite de plazas por rubro.'
                  : 'Hasta 5 empresas por rubro en Gran Asunción y hasta 3 en Itapúa (Encarnación) y Ciudad del Este.'}
              </p>
            </article>
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <LockKeyhole className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-bold text-ink">Exclusividad</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.exclusivity}</p>
            </article>
          </div>

          {tier === 'A' && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-3">
                <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong className="text-ink">Requisito indispensable:</strong> toda empresa que postule a Categoría A debe poder atender a sus clientes, como mínimo, en español e inglés.
                </p>
              </div>
            </div>
          )}

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="club-eyebrow text-primary">Rubros incluidos</p>
              <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Actividades de {copy.eyebrow}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/ser-partner?categoria=${category.slug}`}
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <p className="font-semibold text-ink">{category.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{category.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl bg-ink p-7 text-white sm:p-8">
              <p className="club-eyebrow text-primary">Zonas disponibles</p>
              <div className="mt-5 space-y-3">
                {PARTNER_ZONE_ORDER.map((zoneSlug) => {
                  const zone = PARTNER_ZONES[zoneSlug];
                  return (
                    <div key={zone.slug} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold text-white">{zone.name}</p>
                      <p className="mt-1 text-xs text-white/55">{zone.coverage}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/65">
                La disponibilidad y las condiciones comerciales se confirman tras revisar la candidatura.
              </p>
              <Link to={`/ser-partner?categoria=${categories[0]?.slug ?? ''}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                Postular mi empresa <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerTierPage;
