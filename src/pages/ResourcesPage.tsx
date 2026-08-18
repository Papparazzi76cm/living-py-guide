import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, GraduationCap, HeartPulse, Map, ReceiptText } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CLUB_RESOURCES } from '../data/clubData';

const icons = [BookOpen, ReceiptText, GraduationCap, Map, HeartPulse, Building2];

const ResourcesPage = () => (
  <Layout
    title="Recursos para vivir en Paraguay"
    description="Guías de Living Paraguay sobre residencia, fiscalidad, colegios, barrios, salud y vida práctica para expatriados."
    noHeaderPadding
  >
    <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="club-eyebrow text-primary">Recursos Living Paraguay</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
          Información útil antes de contratar a nadie.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Reunimos las guías más importantes para que entiendas el contexto, compares opciones y llegues mejor preparado a cada conversación con un profesional.
        </p>
      </div>
    </section>

    <section className="bg-gradient-sand py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLUB_RESOURCES.map((resource, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link key={resource.title} to={resource.to} className="club-card group flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{resource.tag}</span>
                </div>
                <h2 className="mt-6 text-xl font-bold text-ink">{resource.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">Abrir guía <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-ink p-8 sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: 'hsl(var(--py-white))' }}>¿La guía no resuelve tu caso?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">Pasa del contenido a la acción y consulta las categorías profesionales del Business Club.</p>
          <Link to="/profesionales" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
            Encontrar un profesional <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ResourcesPage;
