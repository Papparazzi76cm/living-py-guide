import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileCheck,
  Home,
  Briefcase,
  Landmark,
  GraduationCap,
  HeartPulse,
  MessageSquare,
  Compass,
  Handshake,
  LineChart,
  ShieldCheck,
  Users,
  CalendarDays,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import heroAsuncion from '@/assets/hero-asuncion.webp';
import { CategoryCard } from './CategoryCard';
import {
  HOME_NEED_CARDS,
  CLUB_EVENTS,
  CLUB_RESOURCES,
  MAX_SEATS_PER_CATEGORY,
} from '@/data/clubData';
import {
  ALL_PARTNER_CATEGORIES,
  EXCLUSIVITY_PREMIUM_USD,
  MEMBERSHIP_TIERS,
} from '@/data/membershipCatalog';

const needIcons = { FileCheck, Home, Briefcase, Landmark, GraduationCap, HeartPulse };

export const ClubHero = () => (
  <section className="relative overflow-hidden bg-ink">
    <img
      src={heroAsuncion}
      alt="Vista de Asunción, Paraguay al atardecer"
      className="absolute inset-0 h-full w-full object-cover opacity-30"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-ink opacity-90" aria-hidden />
    <div
      className="absolute -right-24 top-16 hidden h-72 w-72 rounded-full bg-primary/20 blur-3xl lg:block"
      aria-hidden
    />

    <div className="container relative z-10 mx-auto px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:pb-32 lg:pt-44">
      <div className="max-w-3xl">
        <p className="club-eyebrow text-primary">
          <span className="h-px w-8 bg-primary" aria-hidden />
          La comunidad para empezar tu vida en Paraguay
        </p>

        <h1 className="mt-5 text-[2rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Llegar a Paraguay es más fácil cuando ya tienes una red.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Living Paraguay Business Club conecta a quienes recién llegan con profesionales de
          confianza, recursos prácticos y una comunidad real. Residencia, vivienda, empresa,
          banca, colegios y salud: todo resuelto con gente que ya pasó por ahí.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/vivir-en-paraguay"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
          >
            Estoy llegando a Paraguay
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/ser-partner"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            Quiero ser Partner
          </Link>
        </div>

        <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
          {[
            { k: String(ALL_PARTNER_CATEGORIES.length), v: 'categorías profesionales' },
            { k: '5', v: 'plazas máximas por rubro A-C' },
            { k: '100%', v: 'gratis para expatriados' },
          ].map((s) => (
            <div key={s.v}>
              <dt className="text-2xl font-bold text-white sm:text-3xl">{s.k}</dt>
              <dd className="mt-1 text-xs leading-snug text-white/60 sm:text-sm">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
}) => (
  <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
    {eyebrow && (
      <p className={`club-eyebrow justify-center ${light ? 'text-primary' : 'text-primary'}`}>{eyebrow}</p>
    )}
    <h2
      className={`mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-4xl ${
        light ? 'text-white' : 'text-ink'
      }`}
      style={light ? { color: 'hsl(var(--py-white))' } : undefined}
    >
      {title}
    </h2>
    {description && (
      <p className={`mt-4 text-sm leading-relaxed sm:text-base ${light ? 'text-white/70' : 'text-muted-foreground'}`}>
        {description}
      </p>
    )}
  </div>
);

/* A — Needs grid */
export const NeedsSection = () => (
  <section className="bg-gradient-sand py-16 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionHeading
        eyebrow="Para expatriados"
        title="Todo lo que necesitas, en un solo lugar"
        description="Las seis áreas que definen tu primer año en Paraguay, con guías propias y profesionales verificados detrás de cada una."
      />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {HOME_NEED_CARDS.map((card) => {
          const IconCmp = needIcons[card.icon as keyof typeof needIcons];
          const inner = (
            <>
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconCmp className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Explorar <ArrowRight className="h-4 w-4" />
              </span>
            </>
          );
          return 'external' in card && card.external ? (
            <a
              key={card.title}
              href={card.to}
              target="_blank"
              rel="noopener noreferrer"
              className="club-card flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={card.title}
              to={card.to}
              className="club-card flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

/* B — How it works */
const HOW_STEPS = [
  { icon: MessageSquare, title: 'Contanos qué necesitás', text: 'Escribinos tu situación real: familia, empresa, plazos y presupuesto.' },
  { icon: Compass, title: 'Recibí orientación confiable', text: 'Te damos el marco: qué trámite corresponde, qué cuesta y en qué orden hacerlo.' },
  { icon: Handshake, title: 'Conectá con profesionales verificados', text: 'Te derivamos a partners del Club revisados por categoría, no a listados abiertos.' },
  { icon: LineChart, title: 'Resolvé y seguí tu avance', text: 'Acompañamos el caso hasta cerrarlo y registramos el resultado de cada derivación.' },
];

export const HowItWorksSection = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionHeading eyebrow="Cómo funciona" title="Cómo funciona para expatriados" />
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HOW_STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              0{i + 1}
            </span>
            <s.icon className="mt-4 h-6 w-6 text-primary" />
            <h3 className="mt-4 text-base font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* C — Partner proposition */
export const PartnerPitchSection = () => (
  <section className="relative overflow-hidden bg-ink py-16 sm:py-24">
    <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" aria-hidden />
    <div className="container relative mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="club-eyebrow text-primary">Para profesionales y empresas</p>
        <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-4xl" style={{ color: 'hsl(var(--py-white))' }}>
          Tu próximo cliente puede estar aterrizando hoy en Paraguay.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
          Cada semana llegan familias, emprendedores e inversionistas que necesitan abogado,
          contador, banco, colegio, seguro y vivienda. El Club los recibe primero y los deriva a
          una red cerrada de partners verificados.
        </p>
        <ul className="mt-8 space-y-4">
          {[
            { icon: Users, t: 'Modelo A–D', d: `A, B y C tienen hasta ${MAX_SEATS_PER_CATEGORY} miembros por rubro; D es abierta y gratuita.` },
            { icon: ShieldCheck, t: 'Red verificada', d: 'Admisión revisada: referencias, experiencia y capacidad de atención a extranjeros.' },
            { icon: LineChart, t: 'Seguimiento de derivaciones', d: 'Trazabilidad de cada lead derivado para medir retorno real (en desarrollo).' },
          ].map((b) => (
            <li key={b.t} className="flex gap-4">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-white">{b.t}</p>
                <p className="mt-1 text-sm text-white/65">{b.d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/ser-partner"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Quiero ser Partner <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/profesionales"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Ver categorías
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Membresía anual por nivel</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {(['A', 'B', 'C', 'D'] as const).map((tierKey) => {
            const tier = MEMBERSHIP_TIERS[tierKey];
            return (
              <div key={tierKey} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Categoría {tierKey}</p>
                <p className="mt-1 text-xl font-bold text-white">{tier.priceUsd === 0 ? 'Gratis' : `USD ${tier.priceUsd.toLocaleString('en-US')}`}</p>
                <p className="mt-1 text-xs text-white/50">{tier.ticketProfile}</p>
              </div>
            );
          })}
        </div>
        <ul className="mt-6 space-y-3 text-sm text-white/75">
          {[
            'Derivaciones cualificadas de la comunidad',
            'Perfil verificado en el directorio del Club',
            'Participación en eventos y networking mensual',
            'Visibilidad en contenidos y recursos',
            'Exclusividad opcional en A-C si se cumplen los requisitos',
          ].map((x) => (
            <li key={x} className="flex gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-white/15 pt-5 text-xs leading-relaxed text-white/50">
          Exclusividad opcional en A, B y C: USD {EXCLUSIVITY_PREMIUM_USD.toLocaleString('en-US')}/año adicionales. Requiere atención en español, inglés, alemán y portugués. Categoría D: sin exclusividad.
        </p>
      </div>
    </div>
  </section>
);

/* D — Scarcity */
export const ScarcitySection = () => {
  const sample = ALL_PARTNER_CATEGORIES.filter((c) =>
    ['residencia-migraciones', 'inmobiliaria', 'contabilidad-impuestos', 'banca-fintech', 'traduccion', 'tecnologia-ia'].includes(c.slug)
  );
  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Plazas por categoría"
          title="A, B y C limitadas. D siempre abierta."
          description="Las categorías de pago admiten un máximo de cinco miembros activos por rubro. La categoría D no tiene límite de plazas ni posibilidad de exclusividad."
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {sample.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/profesionales"
            className="inline-flex items-center gap-2 rounded-xl border border-ink/20 bg-card px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-muted"
          >
            Ver las {ALL_PARTNER_CATEGORIES.length} categorías <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* E — Guarantee */
export const GuaranteeSection = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-clay/30 bg-clay-soft p-7 sm:p-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-clay text-white">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div>
            <p className="club-eyebrow text-clay">Garantía comercial</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-ink sm:text-3xl">
              30 días para ver resultados, o te devolvemos la membresía.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Si en tus primeros 30 días como partner de pago (A, B o C) no se genera ningún cliente atribuible a
              través del Club, podés solicitar la devolución íntegra de la membresía.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-ink-soft/80">
              Garantía comercial sujeta a condiciones de participación (asistencia a eventos,
              perfil completo y respuesta a las derivaciones en los plazos acordados) y a los
              términos finales del programa, que se entregan antes de la firma.
            </p>
            <Link
              to="/ser-partner#garantia"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clay hover:underline"
            >
              Ver condiciones <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* F — Community */
export const CommunitySection = () => (
  <section className="bg-sand py-16 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionHeading
        eyebrow="Comunidad"
        title="Encuentros que valen más que un grupo de WhatsApp"
        description="Programación mensual pensada para que llegues, entiendas y te conectes rápido."
      />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {CLUB_EVENTS.map((e) => (
          <article key={e.title} className="club-card rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>{e.cadence}</span>
              <span aria-hidden>·</span>
              <span>{e.format}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{e.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/comunidad" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
          Ver la agenda de la comunidad <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

/* G — Resources */
export const ResourcesSection = () => (
  <section className="bg-background py-16 sm:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionHeading
        eyebrow="Recursos"
        title="Guías propias, actualizadas y sin humo"
        description="El contenido que ya usan miles de personas para planificar su mudanza a Paraguay."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLUB_RESOURCES.map((r) => (
          <Link
            key={r.title}
            to={r.to}
            className="club-card group flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-3 w-3" /> {r.tag}
            </span>
            <h3 className="text-base font-semibold text-ink">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* H — Final dual CTA */
export const FinalCtaSection = () => (
  <section className="bg-ink py-16 sm:py-24">
    <div className="container mx-auto grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10">
        <h3 className="text-xl font-bold sm:text-2xl" style={{ color: 'hsl(var(--py-white))' }}>
          Estoy llegando a Paraguay
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Acceso gratuito a guías, eventos y a la red de profesionales verificados del Club.
        </p>
        <Link
          to="/vivir-en-paraguay"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Empezar mi mudanza <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
      <div className="rounded-3xl border border-primary/40 bg-primary/10 p-8 sm:p-10">
        <h3 className="text-xl font-bold sm:text-2xl" style={{ color: 'hsl(var(--py-white))' }}>
          Quiero ser Partner
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Membresías A–C según ticket medio y categoría D abierta sin cuota.
        </p>
        <Link
          to="/ser-partner"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-ink transition-opacity hover:opacity-90"
        >
          Postular al Club <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  </section>
);
