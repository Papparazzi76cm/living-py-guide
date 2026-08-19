import { ArrowRight, BadgeDollarSign, Globe2, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLockup } from '@/components/brand/BrandLockup';
import { Layout } from '@/components/Layout';
import { LBC_NETWORK, MARKET_ORDER, MARKETS } from '@/config/network';

const statusLabel = {
  active: 'Operativa',
  planned: 'Próxima apertura',
  'market-study': 'En estudio',
} as const;

const operatorLabel = {
  'founding-delegation': 'Delegación fundadora',
  franchise: 'Delegación franquicia',
} as const;

const NetworkPage = () => {
  return (
    <Layout
      title={`${LBC_NETWORK.initials} · ${LBC_NETWORK.name}`}
      description="Red LATAM de comunidades y clubes de negocio Living, con delegaciones locales, criterios de admisión y precios adaptados a cada mercado."
    >
      <section className="bg-gradient-ink px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="container mx-auto max-w-6xl">
          <BrandLockup variant="network" inverted />
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Una red regional diseñada para conectar a expatriados, emprendedores y proveedores verificados en cada país, con una marca matriz común y ejecución local.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full bg-white/10 px-4 py-2">Matriz: {LBC_NETWORK.initials}</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Expansión: {LBC_NETWORK.expansionRegion}</span>
            <span className="rounded-full bg-white/10 px-4 py-2">Modelo: delegaciones y franquicias</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="club-eyebrow text-primary">Arquitectura de red</p>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Una plataforma, múltiples mercados.</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Cada Living mantiene el modelo de LBC, pero adapta su identidad visual, zonas, límites de plazas, moneda y precios a la realidad económica de su país. Los precios de una delegación nunca se heredan automáticamente de otra.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <Globe2 className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-bold text-ink">Marca matriz</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">LBC define estándares, arquitectura de producto, criterios comunes y expansión regional.</p>
            </article>
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <Store className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-bold text-ink">Delegación local</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Living Paraguay, Living Argentina, Living Brasil y Living México operan como marcas locales de la red.</p>
            </article>
            <article className="club-card rounded-2xl border border-border bg-card p-6">
              <BadgeDollarSign className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-xl font-bold text-ink">Pricing local</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Cada mercado requiere estudio propio de poder adquisitivo, ticket medio, competencia y capacidad de retorno.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="club-eyebrow text-primary">Mercados</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Hoja de expansión LATAM</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">Los mercados no activos permanecen sin precios publicados hasta completar su estudio económico y comercial.</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_ORDER.map((slug) => {
              const market = MARKETS[slug];
              return (
                <article key={market.slug} className="club-card rounded-2xl border border-border bg-card p-5">
                  <BrandLockup market={market} compact />
                  <div className="mt-5 space-y-2 text-sm">
                    <p className="font-semibold text-ink">{statusLabel[market.status]}</p>
                    <p className="text-muted-foreground">{operatorLabel[market.operatorModel]}</p>
                    <p className="text-muted-foreground">
                      Pricing: {market.pricingStatus === 'active' ? 'activo' : 'pendiente de estudio de mercado'}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto max-w-5xl rounded-3xl bg-ink p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Expansión y franquicias</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Abrir un Living en un nuevo mercado.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/75">
            La red está preparada para trabajar con delegaciones franquicia. La activación de cada país requiere validación de territorio, operador, pricing, identidad local y capacidad de servicio antes de lanzamiento.
          </p>
          <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
            Hablar sobre una delegación
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NetworkPage;
