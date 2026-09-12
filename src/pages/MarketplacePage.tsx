import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CreditCard, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ServiceCatalog } from '@/components/marketplace/ServiceCatalog';
import { MARKETPLACE_PROMISES, SERVICE_CATEGORIES } from '@/data/marketplace';

const featured = ['residencia-migraciones', 'inmobiliaria', 'constitucion-empresas', 'contabilidad-impuestos', 'relocation', 'servicios-hogar'];

export default function MarketplacePage() {
  const categories = SERVICE_CATEGORIES.filter((category) => featured.includes(category.slug));

  return (
    <Layout
      title="Servicios para expatriados"
      description="Contrata profesionales y servicios verificados para instalarte, vivir y emprender en Paraguay desde una única plataforma."
      canonical="https://livingparaguay.com/servicios"
      noHeaderPadding
    >
      <section className="premium-hero relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="premium-hero-noise" aria-hidden />
        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <div className="max-w-4xl">
            <p className="premium-kicker text-primary">Marketplace Living Paraguay</p>
            <h1 className="premium-display mt-5 text-[clamp(3rem,7vw,6.8rem)] !text-white">
              Lo que necesitas para vivir en Paraguay, <span className="premium-serif text-white/90">en un solo lugar.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Busca, compara, solicita presupuesto, contrata y sigue cada servicio desde la plataforma. El profesional entra gratis; Living Paraguay solo participa cuando se genera una operación.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#catalogo" className="premium-button"><Search className="h-4 w-4" /> Buscar servicios</a>
              <Link to="/ofrecer-servicios" className="premium-button-ghost !border-white/15 !bg-white/[0.07] !text-white">Ofrecer mis servicios <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [BadgeCheck, 'Profesionales verificados'],
              [ShieldCheck, 'Condiciones por escrito'],
              [CreditCard, 'Pago dentro de la plataforma'],
              [Sparkles, 'Valoraciones tras servicios reales'],
            ].map(([Icon, label]) => {
              const IconCmp = Icon as typeof BadgeCheck;
              return <div key={label as string} className="premium-glass flex items-center gap-3 rounded-2xl p-4"><IconCmp className="h-5 w-5 text-primary" /><span className="text-sm font-semibold text-white">{label as string}</span></div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="premium-kicker text-primary">Empieza por una necesidad</p>
              <h2 className="premium-display mt-4 text-4xl text-ink sm:text-5xl">Servicios pensados para el momento de instalarte.</h2>
            </div>
            <Link to="/ofrecer-servicios" className="premium-button-ghost">Soy profesional <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link key={category.slug} to={`/servicios/${category.slug}`} className="premium-card group rounded-[1.7rem] border border-white/80 bg-white/80 p-6">
                <div className="flex items-start justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/25">0{index + 1}</span><ArrowRight className="h-4 w-4 text-ink/20 transition-all group-hover:translate-x-1 group-hover:text-primary" /></div>
                <h3 className="mt-8 text-xl font-bold text-ink">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-5 sm:px-6">
          <ServiceCatalog />
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="container mx-auto grid gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="premium-kicker text-primary">Un marketplace, no un directorio</p>
            <h2 className="premium-display mt-4 text-4xl !text-white sm:text-5xl">La relación no termina cuando encuentras un teléfono.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MARKETPLACE_PROMISES.map((promise) => <div key={promise} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm leading-6 text-white/70"><span className="mb-3 block h-2 w-2 rounded-full bg-primary" />{promise}</div>)}
          </div>
        </div>
      </section>
    </Layout>
  );
}
