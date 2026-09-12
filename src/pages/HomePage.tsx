import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import heroAsuncion from '@/assets/hero-asuncion.webp';
import {
  NeedsSection,
  HowItWorksSection,
  CommunitySection,
  ResourcesSection,
} from '../components/club/HomeSections';

const PublicHero = () => (
  <section className="relative overflow-hidden bg-ink">
    <img
      src={heroAsuncion}
      alt="Vista de Asunción, Paraguay al atardecer"
      className="absolute inset-0 h-full w-full object-cover opacity-30"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-ink opacity-90" aria-hidden />
    <div className="absolute -right-24 top-16 hidden h-72 w-72 rounded-full bg-primary/20 blur-3xl lg:block" aria-hidden />

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
            to="/profesionales"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
          >
            Ver profesionales
          </Link>
        </div>

        <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
          {[
            { k: 'Red', v: 'profesionales verificados' },
            { k: 'Local', v: 'comunidad en Paraguay' },
            { k: '100%', v: 'acceso gratuito para expatriados' },
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

const PublicFinalCtaSection = () => (
  <section className="bg-ink py-16 sm:py-24">
    <div className="container mx-auto grid gap-5 px-4 sm:px-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10">
        <h3 className="text-xl font-bold sm:text-2xl" style={{ color: 'hsl(var(--py-white))' }}>
          Estoy llegando a Paraguay
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Accede a guías, recursos y orientación práctica para organizar tu llegada paso a paso.
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
          Necesito un profesional
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Consulta la red de profesionales y empresas por categoría y zona para encontrar el apoyo que necesitas.
        </p>
        <Link
          to="/profesionales"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-ink transition-opacity hover:opacity-90"
        >
          Ver profesionales <ArrowRight className="h-5 w-5" />
        </Link>
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
    <NeedsSection />
    <HowItWorksSection />
    <CommunitySection />
    <ResourcesSection />
    <PublicFinalCtaSection />
  </Layout>
);

export default HomePage;
