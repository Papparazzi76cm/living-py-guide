import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import heroAsuncion from '@/assets/hero-asuncion.webp';
import {
  PremiumNeedsSection,
  PremiumHowItWorksSection,
  PremiumCommunitySection,
  PremiumResourcesSection,
} from '../components/club/PremiumHomeSections';

const roadmap = [
  ['01', 'Entender', 'Qué necesitas y en qué orden'],
  ['02', 'Preparar', 'Trámites, vivienda y vida práctica'],
  ['03', 'Conectar', 'Profesionales y comunidad local'],
  ['04', 'Instalarte', 'Con contexto, seguimiento y red'],
];

const PublicHero = () => (
  <section className="premium-hero relative overflow-hidden">
    <img
      src={heroAsuncion}
      alt="Vista de Asunción, Paraguay al atardecer"
      className="premium-hero-image absolute inset-0 h-full w-full object-cover opacity-60"
      loading="eager"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,29,0.97)_0%,rgba(8,16,29,0.90)_43%,rgba(8,16,29,0.42)_78%,rgba(8,16,29,0.64)_100%)]" aria-hidden />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(255,255,255,0.10),transparent_22rem)]" aria-hidden />
    <div className="premium-hero-noise" aria-hidden />
    <div className="premium-orbit -right-40 top-28 hidden h-[36rem] w-[36rem] lg:block" aria-hidden />
    <div className="premium-orbit -right-12 top-48 hidden h-[24rem] w-[24rem] opacity-60 lg:block" aria-hidden />

    <div className="container relative z-10 mx-auto grid min-h-[min(920px,100svh)] items-center gap-12 px-5 pb-16 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-20 lg:pt-36">
      <div className="max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="premium-chip"><MapPin className="h-3.5 w-3.5 text-primary" /> Paraguay, desde dentro</span>
          <span className="premium-chip"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Red verificada</span>
        </div>

        <p className="premium-kicker text-primary">La comunidad para empezar bien</p>
        <h1 className="premium-display mt-5 max-w-4xl text-[clamp(3.1rem,7vw,7.1rem)] text-white">
          Llegar a Paraguay cambia cuando ya tienes <span className="premium-serif text-white/[0.92]">una red.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/[0.66] sm:text-lg sm:leading-8">
          Living Paraguay reúne orientación práctica, profesionales verificados y comunidad local para que residencia, vivienda, empresa, banca, colegios y vida diaria dejen de sentirse como piezas sueltas.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/vivir-en-paraguay" className="premium-button">
            Estoy llegando a Paraguay
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/profesionales"
            className="premium-button-ghost !border-white/15 !bg-white/[0.07] !text-white hover:!bg-white/[0.13]"
          >
            Ver profesionales
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            ['Guías claras', 'Sin ruido ni letra pequeña'],
            ['Red local', 'Conocimiento sobre el terreno'],
            ['Acceso gratuito', 'Para expatriados y familias'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-[11px] leading-5 text-white/[0.42]">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-[520px] lg:block" data-premium-reveal>
        <div className="premium-glass relative overflow-hidden rounded-[2.2rem] p-7 xl:p-8">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/[0.38]">Tu hoja de ruta</p>
              <p className="mt-2 text-xl font-bold text-white">De la duda a sentirte ubicado.</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-primary">
              <Compass className="h-5 w-5" />
            </span>
          </div>

          <div className="space-y-2.5">
            {roadmap.map(([number, title, detail], index) => (
              <div
                key={number}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition-all duration-500 hover:translate-x-1 hover:border-white/[0.16] hover:bg-white/[0.075]"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${index === 0 ? 'bg-primary text-white shadow-[0_8px_24px_-10px_rgba(213,43,30,.9)]' : 'border border-white/10 bg-white/[0.05] text-white/[0.45]'}`}>
                  {number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-white/[0.42]">{detail}</p>
                </div>
                <Check className="h-4 w-4 text-white/[0.18] transition-colors group-hover:text-primary" />
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Información + personas + contexto
            </div>
            <ArrowUpRight className="h-4 w-4 text-white/[0.32]" />
          </div>
        </div>

        <div className="premium-float absolute -left-10 top-16 rounded-2xl border border-white/[0.14] bg-ink/[0.72] px-4 py-3 shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/[0.38]">Contexto local</p>
          <p className="mt-1 text-sm font-bold text-white">Antes de tomar decisiones</p>
        </div>
        <div className="premium-float-delayed absolute -bottom-7 -right-6 rounded-2xl border border-white/[0.14] bg-white/90 px-4 py-3 text-ink shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/[0.35]">Living Paraguay</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-extrabold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Red en movimiento</p>
        </div>
      </div>

      <a href="#empezar" className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/[0.32] transition-colors hover:text-white/70 lg:flex">
        Descubrir <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </a>
    </div>
  </section>
);

const PublicFinalCtaSection = () => (
  <section className="relative overflow-hidden bg-sand py-20 sm:py-28 lg:py-36">
    <div className="absolute left-1/2 top-0 h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-primary/[0.055] blur-3xl" aria-hidden />
    <div className="container relative mx-auto px-5 sm:px-6">
      <div className="overflow-hidden rounded-[2.2rem] bg-ink p-7 shadow-[0_45px_120px_-55px_rgba(8,16,29,.85)] sm:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="premium-kicker text-primary">Empieza por lo que necesitas hoy</p>
            <h2 className="premium-display mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
              Menos pestañas abiertas. Más <span className="premium-serif text-white/[0.88]">claridad.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/[0.55] sm:text-base">
              Organiza tu llegada con una ruta práctica o entra directamente en la red de profesionales. Sin formularios interminables ni directorios impersonales.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Link to="/vivir-en-paraguay" className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><Compass className="h-4 w-4" /></span>
              <p className="mt-5 font-bold text-white">Estoy llegando</p>
              <p className="mt-2 text-xs leading-5 text-white/[0.42]">Guías y pasos para organizar tu instalación.</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Empezar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
            <Link to="/profesionales" className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white"><ShieldCheck className="h-4 w-4" /></span>
              <p className="mt-5 font-bold text-white">Necesito un profesional</p>
              <p className="mt-2 text-xs leading-5 text-white/[0.42]">Encuentra apoyo verificado por categoría y zona.</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Explorar red <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HomePage = () => (
  <Layout
    title="Living Paraguay Business Club"
    description="La comunidad que conecta a expatriados que llegan a Paraguay con recursos prácticos, eventos y una red limitada de profesionales verificados."
    canonical="https://livingparaguay.com/"
    noHeaderPadding
  >
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Living Paraguay',
          url: 'https://livingparaguay.com',
          description: 'Comunidad y red profesional para expatriados que viven, se instalan o emprenden en Paraguay.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'PY',
            addressLocality: 'Asunción',
          },
        })}
      </script>
    </Helmet>
    <PublicHero />
    <div id="empezar">
      <PremiumNeedsSection />
    </div>
    <PremiumHowItWorksSection />
    <PremiumCommunitySection />
    <PremiumResourcesSection />
    <PublicFinalCtaSection />
  </Layout>
);

export default HomePage;
