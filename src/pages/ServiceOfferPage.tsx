import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BadgeCheck, CalendarDays, MapPin, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { Field, Notice } from '@/components/marketplace/Fields';
import { money } from '@/components/marketplace/format';
import { Button } from '@/components/ui/button';

export default function ServiceOfferPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const cache = useQueryClient();
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState('Español');
  const [details, setDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const offer = useQuery({
    queryKey: ['marketplace', 'offer', id],
    enabled: !!id,
    queryFn: async () => {
      if (!/^[a-f0-9-]{36}$/.test(id!)) return null;
      const service = await marketplace.from('marketplace_services').select('*').eq('id', id!).eq('status', 'published').maybeSingle();
      if (service.error) throw service.error;
      if (!service.data) return null;
      const provider = await marketplace.from('marketplace_providers').select('*').eq('id', service.data.provider_id).eq('status', 'approved').maybeSingle();
      if (provider.error) throw provider.error;
      const reviews = await marketplace.from('marketplace_reviews').select('*').eq('provider_id', service.data.provider_id);
      if (reviews.error && !['42P01', 'PGRST205'].includes(String(reviews.error.code))) throw reviews.error;
      return provider.data ? { ...service.data, provider: provider.data, reviews: reviews.data ?? [] } : null;
    },
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !offer.data || !consent || busy || savedId) return;
    setBusy(true); setNotice('');
    try {
      const result = await marketplace.from('marketplace_requests').insert({
        service_id: offer.data.id,
        city: city.trim(),
        language: language.trim(),
        details: details.trim(),
        preferred_date: preferredDate || null,
      }).select('id').single();
      if (result.error) throw result.error;
      setSavedId(result.data.id);
      void cache.invalidateQueries({ queryKey: ['marketplace', 'requests'] });
    } catch (error) {
      setNotice(marketplaceError(error));
    } finally {
      setBusy(false);
    }
  }

  const service = offer.data;
  const average = service?.reviews.length ? service.reviews.reduce((sum, item) => sum + item.rating, 0) / service.reviews.length : null;
  const priceLabel = service?.price === null
    ? 'Presupuesto personalizado'
    : service?.price_type === 'from'
      ? `Desde ${money(service.price, service.currency)}`
      : money(service?.price ?? null, service?.currency ?? 'USD');

  return (
    <Layout title={service?.title ?? 'Detalle del servicio'} description={service?.description.slice(0, 160) ?? 'Consulta alcance, profesional y condiciones del servicio.'}>
      <section className="bg-gradient-sand py-10 sm:py-16">
        <div className="container mx-auto px-5 sm:px-6">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Volver a servicios</Link>
          {offer.isPending ? <div className="mt-8"><Notice>Cargando servicio…</Notice></div> : offer.error ? <div className="mt-8"><Notice>{marketplaceError(offer.error)}</Notice></div> : !service ? <div className="mt-8"><Notice>Este servicio no está disponible.</Notice></div> : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><BadgeCheck className="h-4 w-4" /> Profesional verificado</div>
                  <h1 className="premium-display mt-4 max-w-4xl text-4xl text-ink sm:text-5xl lg:text-6xl">{service.title}</h1>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="font-bold text-ink">{service.provider.display_name}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {service.provider.city}</span>
                    <span>{service.provider.languages.join(' · ')}</span>
                    {average !== null && <span>★ {average.toFixed(1)} ({service.reviews.length})</span>}
                  </div>
                </div>

                <article className="rounded-[1.7rem] border border-white bg-white/80 p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-ink">Sobre este servicio</h2>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{service.description}</p>
                </article>
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[1.7rem] border border-border bg-card p-6"><h2 className="font-bold text-ink">Qué no incluye</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{service.exclusions}</p></article>
                  <article className="rounded-[1.7rem] border border-border bg-card p-6"><h2 className="font-bold text-ink">Plazos y modalidad</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{service.delivery_terms}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">{service.delivery_mode === 'online' ? 'Online' : service.delivery_mode === 'onsite' ? 'Presencial' : 'Online o presencial'}</p></article>
                </div>
                <article className="rounded-[1.7rem] border border-border bg-card p-6"><h2 className="font-bold text-ink">Cancelaciones</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{service.cancellation_terms}</p></article>
                {service.reviews.length > 0 && <article className="rounded-[1.7rem] border border-border bg-card p-6"><h2 className="text-xl font-bold text-ink">Experiencias verificadas</h2><div className="mt-5 space-y-4">{service.reviews.slice(0, 6).map((item) => <div key={item.id} className="border-t border-border pt-4 first:border-0 first:pt-0"><p className="font-bold text-primary">{'★'.repeat(item.rating)}</p>{item.comment && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.comment}</p>}</div>)}</div></article>}
              </div>

              <aside className="sticky top-28 h-fit rounded-[2rem] border border-white bg-white/90 p-6 shadow-xl backdrop-blur sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Precio</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">{priceLabel}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Antes de pagar recibirás un presupuesto final con honorarios, impuestos, gastos, alcance y condiciones. Solicitar no supone ningún cargo.</p>
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/70 p-3 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> El pago se confirma dentro del expediente, no por mensajes externos.</div>

                {savedId ? (
                  <div className="mt-6 space-y-3"><Notice>Solicitud registrada. El profesional ya puede preparar tu presupuesto.</Notice><Link to={`/pedido/${savedId}`} className="premium-button w-full">Abrir expediente</Link></div>
                ) : !user ? (
                  <Link className="premium-button mt-6 w-full" to={`/acceso?next=${encodeURIComponent('/oferta/' + service.id)}`}>Acceder para solicitar</Link>
                ) : user.id === service.provider.user_id ? (
                  <div className="mt-6"><Notice>Este es uno de tus servicios. Puedes editarlo desde tu cuenta.</Notice></div>
                ) : (
                  <form className="mt-6 space-y-4" onSubmit={submit}>
                    <Field label="Ciudad donde necesitas el servicio" name="request-city" value={city} onChange={setCity} required minLength={2} maxLength={100} placeholder="Asunción, Encarnación…" />
                    <Field label="Idioma de atención" name="request-language" value={language} onChange={setLanguage} required minLength={2} maxLength={100} />
                    <Field label="Fecha preferida" name="request-date" type="date" value={preferredDate} onChange={setPreferredDate} />
                    <Field label="Qué necesitas exactamente" name="request-details" area value={details} onChange={setDetails} required minLength={20} maxLength={3000} placeholder="Describe tu situación, objetivo y plazo." />
                    <p className="text-xs leading-5 text-muted-foreground">No incluyas pasaportes, información médica, claves ni datos bancarios.</p>
                    <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input className="mt-1" type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Autorizo a Living Paraguay y al profesional a consultar estos datos para preparar y gestionar este servicio.</span></label>
                    <Button type="submit" className="w-full" disabled={busy}><CalendarDays className="mr-2 h-4 w-4" />{busy ? 'Enviando…' : 'Solicitar presupuesto'}</Button>
                  </form>
                )}
                {notice && <div className="mt-4"><Notice>{notice}</Notice></div>}
              </aside>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
