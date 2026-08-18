import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPinned } from 'lucide-react';
import { Layout } from '../components/Layout';
import { RELOCATION_JOURNEY } from '../data/clubData';

const LivingParaguayPage = () => (
  <Layout
    title="Vivir en Paraguay"
    description="Ruta práctica para mudarte a Paraguay: antes de llegar, primeros 30 días, instalación y emprendimiento, con recursos y profesionales de Living Paraguay."
    noHeaderPadding
  >
    <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="club-eyebrow text-primary">Tu ruta de llegada</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
          De preparar la maleta a sentirte en casa en Paraguay.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Hemos ordenado la información de Living Paraguay como un recorrido real: qué preparar antes del viaje, qué resolver al llegar y cómo construir después tu vida y tu negocio.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70">
          <MapPinned className="h-4 w-4 text-primary" /> Acceso gratuito para expatriados
        </div>
      </div>
    </section>

    <section className="bg-gradient-sand py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          {RELOCATION_JOURNEY.map((stage, index) => (
            <article key={stage.id} id={stage.id} className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
              <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Etapa {index + 1}</span>
                  <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{stage.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stage.subtitle}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {stage.steps.map((step) => {
                    const content = (
                      <>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <h3 className="text-base font-semibold text-ink">{step.label}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            Ver recurso <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </>
                    );
                    return step.external ? (
                      <a key={step.label} href={step.to} target="_blank" rel="noopener noreferrer" className="club-card flex gap-3 rounded-2xl border border-border bg-background p-5">
                        {content}
                      </a>
                    ) : (
                      <Link key={step.label} to={step.to || '/recursos'} className="club-card flex gap-3 rounded-2xl border border-border bg-background p-5">
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-ink p-8 sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: 'hsl(var(--py-white))' }}>¿Necesitas ayuda en un punto concreto?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">Consulta las categorías del Club y encuentra el tipo de profesional que necesitas para avanzar.</p>
          <Link to="/profesionales" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
            Ver profesionales <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default LivingParaguayPage;
