import { CalendarDays, Coffee, Users, Video } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CommunityJoinForm } from '../components/club/CommunityJoinForm';
import { CLUB_EVENTS } from '../data/clubData';

const eventIcons = [Coffee, Users, Video, CalendarDays];

const CommunityPage = () => (
  <Layout
    title="Comunidad Living Paraguay"
    description="Eventos, bienvenida, networking y sesiones prácticas para expatriados y partners de Living Paraguay Business Club."
    noHeaderPadding
  >
    <section className="bg-ink pb-16 pt-28 sm:pb-24 sm:pt-40">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="club-eyebrow text-primary">Comunidad</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl" style={{ color: 'hsl(var(--py-white))' }}>
          Llegar con contactos cambia completamente la experiencia.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          Living Paraguay combina información útil con encuentros presenciales y online para que expatriados y profesionales de confianza se conozcan antes de que aparezca una urgencia.
        </p>
      </div>
    </section>

    <section className="bg-gradient-sand py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {CLUB_EVENTS.map((event, index) => {
            const Icon = eventIcons[index % eventIcons.length];
            return (
              <article key={event.title} className="club-card rounded-3xl border border-border bg-card p-6 sm:p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>{event.cadence}</span><span>·</span><span>{event.format}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-ink sm:text-2xl">{event.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
              </article>
            );
          })}
        </div>

        <div id="unirme" className="mt-14 scroll-mt-28">
          <div className="mb-8 max-w-2xl">
            <p className="club-eyebrow text-primary">Acceso para expatriados</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">Entrar a la comunidad es gratis.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cuéntanos en qué momento estás y qué necesitas. Guardaremos tu solicitud para poder invitarte a encuentros y conectarte con recursos relevantes para tu llegada o tu vida en Paraguay.
            </p>
          </div>
          <CommunityJoinForm />
        </div>
      </div>
    </section>
  </Layout>
);

export default CommunityPage;
