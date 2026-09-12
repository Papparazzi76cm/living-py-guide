import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, GraduationCap, HeartPulse, Map, ReceiptText, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CLUB_RESOURCES } from '../data/clubData';

const icons = [BookOpen, ReceiptText, GraduationCap, Map, HeartPulse, Building2];

const ResourcesPage = () => (
  <Layout
    title="Recursos para vivir en Paraguay"
    description="Guías de Living Paraguay sobre residencia, fiscalidad, colegios, barrios, salud y vida práctica para expatriados."
    noHeaderPadding
  >
    <section className="bg-ink pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-5xl">
          <p className="premium-kicker text-primary">Recursos Living Paraguay</p>
          <h1 className="premium-display mt-5 !text-white">
            Información útil antes de <span className="premium-serif text-white/[0.9]">contratar a nadie.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
            Reunimos las guías más importantes para que entiendas el contexto, compares opciones y llegues mejor preparado a cada conversación con un profesional.
          </p>
          <span className="premium-chip mt-8"><Sparkles className="h-4 w-4 text-primary" /> Primero contexto. Después decisiones.</span>
        </div>
      </div>
    </section>

    <section className="premium-section bg-gradient-sand">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CLUB_RESOURCES.map((resource, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link
                key={resource.title}
                to={resource.to}
                className={`premium-card group flex min-h-[290px] flex-col rounded-[1.8rem] border border-white/80 bg-white/[0.8] p-6 backdrop-blur-sm sm:p-7 ${index === 0 ? 'lg:col-span-2 lg:min-h-[330px]' : ''}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="premium-icon-shell"><Icon className="h-5 w-5" /></span>
                  <span className="rounded-full border border-ink/[0.08] bg-muted/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink/[0.45]">{resource.tag}</span>
                </div>
                <div className="mt-auto pt-10">
                  <h2 className={`${index === 0 ? 'max-w-2xl text-3xl sm:text-4xl' : 'text-2xl'} premium-display text-ink`}>{resource.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{resource.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-primary">
                    Abrir guía <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-ink p-7 shadow-[0_35px_90px_-45px_rgba(8,16,29,.8)] sm:p-10">
          <p className="premium-kicker text-primary">Cuando la guía no basta</p>
          <h2 className="premium-display mt-4 max-w-3xl text-3xl !text-white sm:text-4xl">Pasa del contenido a la acción.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">Consulta las categorías profesionales del Business Club y encuentra apoyo específico para tu caso.</p>
          <Link to="/profesionales" className="premium-button mt-7">
            Encontrar un profesional <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ResourcesPage;
