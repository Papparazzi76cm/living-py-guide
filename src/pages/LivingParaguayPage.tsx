import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPinned, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { RELOCATION_JOURNEY } from '../data/clubData';

const LivingParaguayPage = () => (
  <Layout
    title="Vivir en Paraguay"
    description="Ruta práctica para mudarte a Paraguay: antes de llegar, primeros 30 días, instalación y emprendimiento, con recursos y servicios de Living Paraguay."
    noHeaderPadding
  >
    <section className="bg-ink pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-5xl">
          <p className="premium-kicker text-primary">Tu ruta de llegada</p>
          <h1 className="premium-display mt-5 !text-white">De preparar la maleta a sentirte <span className="premium-serif text-white/[0.9]">ubicado.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">Hemos ordenado la información de Living Paraguay como un recorrido real: qué preparar antes del viaje, qué resolver al llegar y cómo construir después tu vida y tu negocio.</p>
          <div className="mt-8 flex flex-wrap gap-2"><span className="premium-chip"><MapPinned className="h-4 w-4 text-primary" /> Acceso gratuito para expatriados</span><span className="premium-chip"><Sparkles className="h-4 w-4 text-primary" /> Ruta práctica, no enciclopedia</span></div>
        </div>
      </div>
    </section>

    <section className="premium-section bg-gradient-sand">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="space-y-5">
          {RELOCATION_JOURNEY.map((stage, index) => (
            <article key={stage.id} id={stage.id} className="premium-card scroll-mt-32 rounded-[2rem] border border-white/80 bg-white/[0.78] p-6 backdrop-blur-sm sm:p-9 lg:p-10">
              <div className="grid gap-9 lg:grid-cols-[0.32fr_0.68fr] lg:gap-12">
                <div><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">0{index + 1}</span><span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Etapa</span></div><h2 className="premium-display mt-6 text-3xl text-ink sm:text-4xl">{stage.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{stage.subtitle}</p></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {stage.steps.map((step) => {
                    const content = <><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="text-base font-bold text-ink">{step.label}</h3><p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.description}</p><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">Ver recurso <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div></>;
                    return step.external
                      ? <a key={step.label} href={step.to} target="_blank" rel="noopener noreferrer" className="club-card group flex gap-3 rounded-2xl border border-border/70 bg-background/75 p-5">{content}</a>
                      : <Link key={step.label} to={step.to || '/recursos'} className="club-card group flex gap-3 rounded-2xl border border-border/70 bg-background/75 p-5">{content}</Link>;
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-ink p-7 shadow-[0_35px_90px_-45px_rgba(8,16,29,.8)] sm:p-10">
          <p className="premium-kicker text-primary">Cuando ya sabes qué necesitas</p>
          <h2 className="premium-display mt-4 max-w-3xl text-3xl !text-white sm:text-4xl">Pasa de la información al servicio contratado.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">Busca profesionales verificados, solicita presupuesto y gestiona la operación sin salir de Living Paraguay.</p>
          <Link to="/servicios" className="premium-button mt-7">Buscar servicios <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default LivingParaguayPage;
