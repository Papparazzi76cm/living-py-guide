import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CalendarDays,
  CreditCard,
  FileCheck,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CLUB_EVENTS, CLUB_RESOURCES, HOME_NEED_CARDS } from '@/data/clubData';

const needIcons = { FileCheck, Home, Briefcase, Landmark, GraduationCap, HeartPulse };

const SectionHeading = ({ eyebrow, title, description, align = 'center', light = false }: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) => (
  <div className={`${align === 'center' ? 'premium-section-heading' : 'max-w-3xl'} ${light ? 'text-white' : ''}`}>
    <p className={`premium-kicker ${align === 'center' ? 'justify-center' : ''} text-primary`}>{eyebrow}</p>
    <h2 className={`premium-display mt-4 text-[clamp(2.4rem,5vw,5rem)] ${light ? '!text-white' : 'text-ink'}`}>{title}</h2>
    {description && <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/[0.52]' : 'text-muted-foreground'}`}>{description}</p>}
  </div>
);

export const PremiumNeedsSection = () => (
  <section className="premium-section bg-gradient-sand">
    <div className="container mx-auto px-5 sm:px-6">
      <SectionHeading
        eyebrow="Tu primer año, ordenado"
        title="Seis decisiones grandes. Una sola puerta de entrada."
        description="Residencia, vivienda, empresa, banca, educación y salud: primero entiende el contexto y, cuando necesites ejecutar, contrata el servicio desde la misma plataforma."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {HOME_NEED_CARDS.map((card, index) => {
          const IconCmp = needIcons[card.icon as keyof typeof needIcons];
          const inner = <><div className="flex items-start justify-between gap-5"><span className="premium-icon-shell"><IconCmp className="h-5 w-5" /></span><span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/[0.24]">0{index + 1}</span></div><div className="mt-8"><h3 className="text-xl font-bold text-ink">{card.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p></div><span className="mt-8 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">Entender primero <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" /></span></>;
          const classes = `premium-card group flex min-h-[290px] flex-col rounded-[1.7rem] border border-white/80 bg-white/[0.78] p-6 backdrop-blur-sm sm:p-7 ${index === 0 || index === 5 ? 'lg:min-h-[330px]' : ''}`;
          return 'external' in card && card.external
            ? <a key={card.title} href={card.to} target="_blank" rel="noopener noreferrer" className={classes}>{inner}</a>
            : <Link key={card.title} to={card.to} className={classes}>{inner}</Link>;
        })}
      </div>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <p className="inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white/60 px-4 py-2 text-xs font-semibold text-ink/50"><Sparkles className="h-3.5 w-3.5 text-primary" /> Infórmate gratis. Contrata solo cuando lo necesites.</p>
        <Link to="/servicios" className="text-sm font-bold text-primary hover:underline">Ir al marketplace <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
      </div>
    </div>
  </section>
);

const HOW_STEPS = [
  { icon: MessageSquare, title: 'Describe lo que necesitas', text: 'Elige un servicio y abre una solicitud con tu situación, ciudad, idioma y plazo.' },
  { icon: BadgeCheck, title: 'Recibe un presupuesto', text: 'El profesional define honorarios, gastos, alcance, plazos y condiciones por escrito.' },
  { icon: CreditCard, title: 'Acepta y paga', text: 'La operación queda vinculada a un expediente trazable. El estado del pago se confirma en servidor.' },
  { icon: Sparkles, title: 'Resuelve y valora', text: 'Habla con el profesional, sigue el trabajo, confirma la finalización y deja una reseña vinculada a una operación real.' },
];

export const PremiumHowItWorksSection = () => (
  <section className="premium-section overflow-hidden bg-ink">
    <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl" aria-hidden />
    <div className="absolute -right-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-secondary/[0.12] blur-3xl" aria-hidden />
    <div className="premium-hero-noise opacity-[0.08]" aria-hidden />
    <div className="container relative z-10 mx-auto grid gap-14 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <SectionHeading eyebrow="Cómo funciona" title="Del problema resuelto en internet al servicio contratado." description="Living Paraguay acompaña la operación completa: descubrimiento, presupuesto, contratación, conversación, pago, ejecución y valoración." align="left" light />
        <Link to="/servicios" className="premium-button mt-8">Buscar un servicio <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <ol className="relative space-y-4">
        <div className="absolute bottom-10 left-[1.65rem] top-10 w-px bg-gradient-to-b from-primary/60 via-white/[0.12] to-transparent" aria-hidden />
        {HOW_STEPS.map((step, index) => (
          <li key={step.title} className="premium-glass group relative rounded-[1.7rem] p-5 sm:p-6"><div className="flex gap-5"><span className={`relative z-10 flex h-[3.3rem] w-[3.3rem] shrink-0 items-center justify-center rounded-full border ${index === 0 ? 'border-primary/30 bg-primary text-white' : 'border-white/[0.12] bg-ink text-white/70'}`}><step.icon className="h-5 w-5" /></span><div className="pt-1"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/30">Paso 0{index + 1}</p><h3 className="mt-2 text-xl font-bold !text-white sm:text-2xl">{step.title}</h3><p className="mt-2 max-w-xl text-sm leading-7 text-white/[0.48]">{step.text}</p></div></div></li>
        ))}
      </ol>
    </div>
  </section>
);

export const PremiumCommunitySection = () => (
  <section className="premium-section bg-sand">
    <div className="container mx-auto px-5 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <SectionHeading eyebrow="Comunidad" title="Un marketplace puede resolver servicios. La comunidad resuelve adaptación." description="Los encuentros siguen siendo gratuitos y complementarios: contexto local, relaciones y aprendizaje sin obligarte a pertenecer a un club." align="left" />
        <div className="lg:justify-self-end"><Link to="/comunidad" className="premium-button-ghost">Ver la comunidad <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {CLUB_EVENTS.map((event, index) => (
          <article key={event.title} className="premium-card group rounded-[1.8rem] border border-white/80 bg-white/[0.82] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/40"><CalendarDays className="h-4 w-4 text-primary" /><span>{event.cadence}</span></div><span className="text-[10px] font-extrabold tracking-[0.2em] text-ink/20">0{index + 1}</span></div><h3 className="mt-8 text-2xl font-bold text-ink sm:text-3xl">{event.title}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{event.description}</p><div className="mt-7 flex items-center gap-2 text-xs font-semibold text-ink/[0.42]"><span className="h-2 w-2 rounded-full bg-primary" /> {event.format}</div></article>
        ))}
      </div>
    </div>
  </section>
);

export const PremiumResourcesSection = () => (
  <section className="premium-section bg-background">
    <div className="container mx-auto px-5 sm:px-6">
      <SectionHeading eyebrow="Recursos" title="Entiende antes de contratar." description="Guías directas para saber qué necesitas, qué preguntas hacer y cuándo merece la pena pasar del contenido a un servicio profesional." />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CLUB_RESOURCES.map((resource, index) => (
          <Link key={resource.title} to={resource.to} className={`premium-card group flex min-h-[260px] flex-col rounded-[1.7rem] border border-border/70 bg-card p-6 sm:p-7 ${index === 0 ? 'lg:col-span-2 lg:min-h-[300px]' : ''}`}><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-muted/70 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-ink/[0.45]"><BookOpen className="h-3.5 w-3.5 text-primary" /> {resource.tag}</span><ArrowRight className="h-4 w-4 text-ink/[0.22] transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" /></div><div className="mt-auto pt-10"><h3 className={`${index === 0 ? 'max-w-2xl text-2xl sm:text-3xl' : 'text-xl'} font-bold text-ink`}>{resource.title}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{resource.description}</p></div></Link>
        ))}
      </div>
    </div>
  </section>
);
