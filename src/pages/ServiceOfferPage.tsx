import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { Field, Notice } from '@/components/marketplace/Fields';
import { money } from '@/components/marketplace/format';
import { Button } from '@/components/ui/button';

export default function ServiceOfferPage() {
  const { id } = useParams(); const { user } = useAuth(); const cache = useQueryClient();
  const [city, setCity] = useState(''); const [language, setLanguage] = useState('Español');
  const [details, setDetails] = useState(''); const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(''); const [saved, setSaved] = useState(false);
  const offer = useQuery({ queryKey: ['marketplace','offer',id], enabled: !!id, queryFn: async () => {
    if (!/^[a-f0-9-]{36}$/.test(id!)) return null;
    const s = await marketplace.from('marketplace_services').select('*').eq('id', id!).eq('status','published').maybeSingle();
    if (s.error) throw s.error; if (!s.data) return null;
    const p = await marketplace.from('marketplace_providers').select('*').eq('id',s.data.provider_id).eq('status','approved').maybeSingle();
    if (p.error) throw p.error; return p.data ? { ...s.data, provider: p.data } : null;
  }});
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (!user || !offer.data || !consent || busy || saved) return;
    setBusy(true); setNotice('');
    try {
      const r = await marketplace.from('marketplace_requests').insert({ service_id: offer.data.id, city: city.trim(), language: language.trim(), details: details.trim() }).select('id').single();
      if (r.error) throw r.error; setSaved(true); void cache.invalidateQueries({ queryKey: ['marketplace','requests'] });
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }
  const s = offer.data;
  return <Layout title={s?.title ?? 'Detalle del servicio'} description={s?.description.slice(0,160) ?? 'Consulta alcance y presupuesto del servicio.'}><section className="container mx-auto space-y-8 px-4 py-10"><Link to="/servicios" className="text-primary underline">Volver a servicios</Link>{offer.isPending ? <Notice>Cargando servicio…</Notice> : offer.error ? <Notice>{marketplaceError(offer.error)}</Notice> : !s ? <Notice>Este servicio no está disponible.</Notice> : <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]"><div className="space-y-6"><h1 className="text-3xl font-bold sm:text-4xl">{s.title}</h1><p className="text-lg font-semibold">{s.provider.display_name}</p><p>{s.provider.city} · {s.provider.languages.join(', ')}</p><p className="whitespace-pre-wrap text-muted-foreground">{s.provider.description}</p>{[['Incluye',s.description],['No incluye',s.exclusions],['Plazos y modalidad',s.delivery_terms],['Cancelaciones',s.cancellation_terms]].map(([title,text]) => <div key={title}><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 whitespace-pre-wrap">{text}</p></div>)}</div><aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6"><h2 className="text-2xl font-bold">{s.price === null ? 'Presupuesto a consultar' : money(s.price,s.currency)}</h2><p className="text-sm text-muted-foreground">Honorarios orientativos. Recibirás el precio total, incluidos impuestos y gastos aplicables, antes de aceptar. Esta solicitud no reserva disponibilidad ni realiza un pago.</p>{saved ? <Notice>Solicitud registrada. <Link to="/mi-cuenta" className="underline">Ver mis solicitudes</Link>.</Notice> : !user ? <Link className="inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground" to={'/acceso?next='+encodeURIComponent('/oferta/'+s.id)}>Acceder para solicitar presupuesto</Link> : user.id === s.provider.user_id ? <Notice>Este es uno de tus servicios. Puedes editarlo desde tu cuenta.</Notice> : <form className="space-y-4" onSubmit={submit}><Field label="Ciudad donde necesitas el servicio" name="request-city" value={city} onChange={setCity} required minLength={2} maxLength={100}/><Field label="Idioma de atención" name="request-language" value={language} onChange={setLanguage} required minLength={2} maxLength={100}/><Field label="Qué necesitas y para cuándo" name="request-details" area value={details} onChange={setDetails} required minLength={20} maxLength={3000}/><p className="text-sm text-muted-foreground">No incluyas pasaportes, información médica o datos bancarios en esta solicitud.</p><label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Autorizo que Living Paraguay y este profesional consulten estos datos para preparar mi presupuesto.</span></label><Button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Solicitar presupuesto'}</Button></form>}{notice && <Notice>{notice}</Notice>}</aside></div>}</section></Layout>;
}
