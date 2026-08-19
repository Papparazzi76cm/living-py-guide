import { BrandLockup } from '@/components/brand/BrandLockup';
import { ACTIVE_MARKET, LBC_NETWORK } from '@/config/network';

const MarketComingSoonPage = () => (
  <main className="min-h-screen bg-gradient-ink px-4 py-16 text-white sm:px-6 sm:py-24">
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col justify-center">
      <BrandLockup market={ACTIVE_MARKET} inverted />
      <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Próxima delegación de {LBC_NETWORK.initials}</p>
      <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">{ACTIVE_MARKET.brandName} está en preparación.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
        La plataforma ya reconoce este mercado, pero no publicará servicios, partners ni precios hasta completar el estudio local, validar la operación y activar oficialmente la delegación.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
        <span className="rounded-full bg-white/10 px-4 py-2">Modelo: franquicia</span>
        <span className="rounded-full bg-white/10 px-4 py-2">Pricing: pendiente de estudio</span>
        <span className="rounded-full bg-white/10 px-4 py-2">Red: {LBC_NETWORK.name}</span>
      </div>
    </div>
  </main>
);

export default MarketComingSoonPage;
