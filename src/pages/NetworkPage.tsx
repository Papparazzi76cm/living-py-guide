import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe2, MapPinned, ShieldCheck, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { DelegationFlagLogo } from '@/components/brand/DelegationFlagLogo';
import { LBC_EXPANSION_ROADMAP } from '@/data/expansionRoadmap';

const NetworkPage = () => (
  <Layout
    title="Red internacional LBC · Living Business Club"
    description="Hoja de expansión de Living Business Club: Living Paraguay como delegación fundadora y una red de futuras franquicias ordenada por prioridad de lanzamiento."
    noHeaderPadding
  >
    <section className="relative overflow-hidden bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
      <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" aria-hidden />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="club-eyebrow justify-center text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden />
            LBC · Living Business Club
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Un modelo nacido en Paraguay, diseñado para crecer por Latinoamérica.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-lg">
            Living Paraguay es la delegación fundadora y el laboratorio operativo de LBC. La red se expandirá mediante delegaciones y franquicias locales con una identidad común, una metodología compartida y adaptación real a cada mercado.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: MapPinned, value: 'Paraguay', label: 'mercado fundador' },
            { icon: Globe2, value: String(LBC_EXPANSION_ROADMAP.length), label: 'mercados en roadmap' },
            { icon: ShieldCheck, value: '1 red', label: 'modelo LBC compartido' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center backdrop-blur">
              <item.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 text-xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-white/50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-gradient-sand py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="club-eyebrow justify-center text-primary">Delegación fundadora</p>
          <h2 className="mt-3 text-2xl font-bold text-ink sm:text-4xl">Living Paraguay valida el sistema antes de escalarlo.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            El CRM, la captación de partners, la atribución de negocio, los límites por rubro, la exclusividad y la experiencia de la comunidad se prueban primero en Paraguay. Cada nueva delegación heredará lo que funcione, no los errores del piloto.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-primary/20 bg-card p-7 shadow-sm sm:p-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground">
              PY
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-bold text-ink">Living Paraguay</h3>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">ACTIVA · FUNDADORA</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Primera delegación LBC. Opera como banco de pruebas comercial y tecnológico para convertir el modelo en un sistema replicable antes de franquiciarlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="club-eyebrow justify-center text-primary">Hoja de expansión</p>
          <h2 className="mt-3 text-2xl font-bold text-ink sm:text-4xl">Las siguientes delegaciones, en orden de prioridad.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            La prioridad combina atractivo para expatriados, profundidad de mercado, potencial para partners y capacidad de replicar el modelo. El orden orienta la expansión, pero cada apertura requiere validación y operador local.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LBC_EXPANSION_ROADMAP.map((market) => (
            <article
              key={market.slug}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                Prioridad {String(market.priority).padStart(2, '0')}
              </div>

              <div className="flex min-h-[270px] items-center justify-center bg-gradient-to-b from-[#07172d] to-[#020711] px-5 pb-6 pt-12">
                <DelegationFlagLogo market={market.slug} countryName={market.countryName} />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    {market.stage === 'priority' ? 'Expansión prioritaria' : 'Segunda ola'}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">En estudio</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{market.brandName}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{market.rationale}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <Globe2 className="h-4 w-4 text-primary" />
                  Franquicia LBC · pricing local pendiente
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-ink py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="club-eyebrow text-primary">Un sistema, mercados diferentes</p>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-4xl">La franquicia replica el método. No copia ciegamente el mercado paraguayo.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              Cada Living local conservará la arquitectura LBC, el CRM, los estándares de atención, la trazabilidad de leads y la identidad visual de familia. Categorías, precios, zonas, límites y propuesta comercial se adaptarán a la realidad económica de cada país.
            </p>
          </div>

          <div className="space-y-3">
            {[
              'Identidad local con logo bandera propio',
              'CRM multi-tenant y datos aislados por delegación',
              'Pricing definido mediante estudio de mercado local',
              'Métricas, SLA y atribución de negocio comunes a toda LBC',
            ].map((text) => (
              <div key={text} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-sand py-16 sm:py-20">
      <div className="container mx-auto px-4 text-center sm:px-6">
        <Sparkles className="mx-auto h-7 w-7 text-primary" />
        <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">Primero demostrar. Después replicar.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Living Paraguay construye el caso de éxito que dará a las próximas delegaciones un producto probado, procesos medibles y una propuesta de franquicia con credibilidad desde el primer día.
        </p>
        <Link
          to="/ser-partner"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-semibold text-sand transition-colors hover:bg-ink-soft"
        >
          Conocer el modelo de partners <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  </Layout>
);

export default NetworkPage;
