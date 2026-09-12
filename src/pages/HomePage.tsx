import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
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
  ['01', 'Busca', 'El servicio que necesitas'],
  ['02', 'Compara', 'Alcance, profesional y condiciones'],
  ['03', 'Contrata', 'Con presupuesto y expediente propio'],
  ['04', 'Resuelve', 'Pago, seguimiento y valoración'],
];

const PublicHero = () => (
  <section className="premium-hero relative overflow-hidden">
    <img src={heroAsuncion} alt="Vista de Asunción, Paraguay al atardecer" className="premium-hero-image absolute inset-0 h-full w-full object-cover opacity-60" loading="eager" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,29,0.97)_0%,rgba(8,16,29,0.90)_43%,rgba(8,16,29,0.42)_78%,rgba(8,16,29,0.64)_100%)]" aria-hidden />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(255,255,255,0.10),transparent_22rem)]" aria-hidden />
    <div className="premium-hero-noise" aria-hidden />
    <div className="premium-orbit -right-40 top-28 hidden h-[36rem] w-[36rem] lg:block" aria-hidden />
    <div className="premium-orbit -right-12 top-48 hidden h-[24rem] w-[24rem] opacity-60 lg:block" aria-hidden />

    <div className="container relative z-10 mx-auto grid min-h-[min(920px,100svh)] items-center gap-12 px-5 pb-16 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-20 lg:pt-36">
      <div className="max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="premium-chip"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Profesionales verificados</span>
          <span className="premium-chip"><Sparkles className="h-3.5 w-3.5 text-primary" /> Hecho para expatriados</span>
        </div>

        <p className="premium-kicker text-primary">Marketplace de servicios en Paraguay</p>
        <h1 className="premium-display mt-5 max-w-4xl text-[clamp(3.1rem,7vw,7.1rem)] text-white">
          Todo lo que necesitas para empezar aquí, <span className="premium-serif text-white/[0.92]">en un solo lugar.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/[0.66] sm:text-lg sm:leading-8">
          Residencia, vivienda, empresa, fiscalidad, mudanzas, traducción, hogar y vida diaria. Encuentra el servicio, pide presupuesto, contrata y sigue la operación desde Living Paraguay.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/servicios" className="premium-button"><Search className="h-4 w-4" /> Buscar servicios <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/ofrecer-servicios" className="premium-button-ghost !border-white/15 !bg-white/[0.07] !text-white hover:!bg-white/[0.13]">Ofrecer mis servicios <ArrowUpRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            ['Alta gratuita', 'Los profesionales no pagan por aparecer'],
            ['Presupuesto claro', 'Condiciones antes de contratar'],
            ['Expediente único', 'Chat, pago, seguimiento y reseña'],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 backdrop-blur-sm"><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-[11px] leading-5 text-white/[0.42]">{detail}</p></div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-[520px] lg:block" data-premium-reveal>
        <div className="premium-glass relative overflow-hidden rounded-[2.2rem] p-7 xl:p-8">
          <div className="mb-7 flex items-center justify-between">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/[0.38]">Una operación, de principio a fin</p><p className="mt-2 text-xl font-bold text-white">No es un directorio de teléfonos.</p></div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-primary"><Store className="h-5 w-5" /></span>
          </div>

          <div className="space-y-2.5">
            {roadmap.map(([number, title, detail], index) => (
              <div key={number} className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition-all duration-500 hover:translate-x-1 hover:border-white/[0.16] hover:bg-white/[0.075]">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${index === 0 ? 'bg-primary text-white shadow-[0_8px_24px_-10px_rgba(213,43,30,.9)]' : 'border border-white/10 bg-white/[0.05] text-white/[0.45]'}`}>{number}</span>
                <div className="min-w-0 flex-1"><p className="text-sm font-bold text-white">{title}</p><p className="mt-0.5 text-xs text-white/[0.42]">{detail}</p></div>
                <Check className="h-4 w-4 text-white/[0.18] transition-colors group-hover:text-primary" />
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5"><div className="flex items-center gap-2 text-xs font-semibold text-white/50"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Transacción trazable dentro de la plataforma</div><ArrowUpRight className="h-4 w-4 text-white/[0.32]" /></div>
        </div>

        <div className="premium-float absolute -left-10 top-16 rounded-2xl border border-white/[0.14] bg-ink/[0.72] px-4 py-3 shadow-2xl backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/[0.38]">Cliente</p><p className="mt-1 text-sm font-bold text-white">Paga cuando acepta</p></div>
        <div className="premium-float-delayed absolute -bottom-7 -right-6 rounded-2xl border border-white/[0.14] bg-white/90 px-4 py-3 text-ink shadow-2xl backdrop-blur-xl"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/[0.35]">Profesional</p><p className="mt-1 flex items-center gap-2 text-sm font-extrabold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Paga solo si genera negocio</p></div>
      </div>

      <a href="#empezar" className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/[0.32] transition-colors hover:text-white/70 lg:flex">Descubrir <ArrowDown className="h-3.5 w-3.5 animate-bounce" /></a>
    </div>
  </section>
);

const PublicFinalCtaSection = () => (
  <section className="relative overflow-hidden bg-sand py-20 sm:py-28 lg:py-36">
    <div className="absolute left-1/2 top-0 h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-primary/[0.055] blur-3xl" aria-hidden />
    <div className="container relative mx-auto px-5 sm:px-6">
      <div className="overflow-hidden rounded-[2.2rem] bg-ink p-7 shadow-[0_45px_120px_-55px_rgba(8,16,29,.85)] sm:p-10 lg:p-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div><p className="premium-kicker text-primary">Dos maneras de entrar</p><h2 className="premium-display mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">Necesitas resolver algo o sabes <span className="premium-serif text-white/[0.88]">cómo resolverlo.</span></h2><p className="mt-6 max-w-2xl text-sm leading-7 text-white/[0.55] sm:text-base">El cliente encuentra y contrata. El profesional publica gratis y monetiza cuando llega una operación real.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Link to="/servicios" className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><Search className="h-4 w-4" /></span><p className="mt-5 font-bold text-white">Necesito un servicio</p><p className="mt-2 text-xs leading-5 text-white/[0.42]">Busca por necesidad, compara y abre tu expediente.</p><span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Explorar servicios <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></Link>
            <Link to="/ofrecer-servicios" className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.085]"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white"><Store className="h-4 w-4" /></span><p className="mt-5 font-bold text-white">Quiero vender servicios</p><p className="mt-2 text-xs leading-5 text-white/[0.42]">Alta gratuita, verificación y comisión solo con negocio.</p><span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Crear perfil <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HomePage = () => (
  <Layout
    title="Servicios para expatriados en Paraguay"
    description="Marketplace para buscar, contratar y gestionar servicios verificados para vivir, instalarte y emprender en Paraguay."
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
          description: 'Marketplace de servicios para expatriados que viven, se instalan o emprenden en Paraguay.',
          address: { '@type': 'PostalAddress', addressCountry: 'PY', addressLocality: 'Asunción' },
        })}
      </script>
    </Helmet>
    <PublicHero />
    <div id="empezar"><PremiumNeedsSection /></div>
    <PremiumHowItWorksSection />
    <PremiumCommunitySection />
    <PremiumResourcesSection />
    <PublicFinalCtaSection />
  </Layout>
);

export default HomePage;
