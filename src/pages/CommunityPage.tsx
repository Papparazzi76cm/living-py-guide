import { CalendarDays, Coffee, Sparkles, Users, Video } from 'lucide-react';
import { Layout } from '../components/Layout';
import { CommunityJoinForm } from '../components/club/CommunityJoinForm';
import { CLUB_EVENTS } from '../data/clubData';

const eventIcons = [Coffee, Users, Video, CalendarDays];

const CommunityPage = () => (
  <Layout
    title="Comunidad Living Paraguay"
    description="Eventos, bienvenida, networking y sesiones prácticas gratuitas para expatriados que viven o están llegando a Paraguay."
    noHeaderPadding
  >
    <section className="bg-ink pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="max-w-5xl">
          <p className="premium-kicker text-primary">Comunidad abierta</p>
          <h1 className="premium-display mt-5 !text-white">Llegar con contactos cambia por completo <span className="premium-serif text-white/[0.9]">la experiencia.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">La comunidad es la capa humana de Living Paraguay: encuentros presenciales y online para compartir experiencia local. No exige membresía y no condiciona el uso del marketplace.</p>
          <div className="mt-8 flex flex-wrap gap-2"><span className="premium-chip"><Users className="h-4 w-4 text-primary" /> Personas antes que grupos impersonales</span><span className="premium-chip"><Sparkles className="h-4 w-4 text-primary" /> Acceso gratuito para expatriados</span></div>
        </div>
      </div>
    </section>

    <section className="premium-section bg-gradient-sand">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {CLUB_EVENTS.map((event, index) => {
            const Icon = eventIcons[index % eventIcons.length];
            return <article key={event.title} className="premium-card rounded-[1.8rem] border border-white/80 bg-white/[0.8] p-6 backdrop-blur-sm sm:p-8"><div className="flex items-center justify-between gap-4"><span className="premium-icon-shell"><Icon className="h-5 w-5" /></span><span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/[0.22]">0{index + 1}</span></div><div className="mt-7 flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink/40"><span>{event.cadence}</span><span>·</span><span>{event.format}</span></div><h2 className="premium-display mt-3 text-2xl text-ink sm:text-3xl">{event.title}</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">{event.description}</p></article>;
          })}
        </div>

        <div id="unirme" className="mt-16 scroll-mt-32">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-32"><p className="premium-kicker text-primary">Acceso para expatriados</p><h2 className="premium-display mt-4 text-4xl text-ink sm:text-5xl">Entrar a la comunidad es gratis.</h2><p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">Cuéntanos en qué momento estás y qué necesitas. Usaremos esa información para invitarte a encuentros y conectarte con recursos relevantes para tu llegada o tu vida en Paraguay.</p></div>
            <div className="premium-panel p-5 sm:p-7 lg:p-8"><CommunityJoinForm /></div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default CommunityPage;
