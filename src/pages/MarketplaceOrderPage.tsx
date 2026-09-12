import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { supabase } from '@/integrations/supabase/client';
import { money, STATUS_LABELS } from '@/components/marketplace/format';
import { Notice } from '@/components/marketplace/Fields';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function MarketplaceOrderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const cache = useQueryClient();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const order = useQuery({
    queryKey: ['marketplace', 'order', id],
    enabled: !!id && !!user,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_requests').select('*').eq('id', id!).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const provider = useQuery({
    queryKey: ['marketplace', 'order-provider', order.data?.provider_id],
    enabled: !!order.data,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_providers').select('*').eq('id', order.data!.provider_id).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const messages = useQuery({
    queryKey: ['marketplace', 'messages', id],
    enabled: !!order.data,
    refetchInterval: 6000,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_messages').select('*').eq('request_id', id!).order('created_at', { ascending: true });
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const existingReview = useQuery({
    queryKey: ['marketplace', 'review-order', id],
    enabled: order.data?.status === 'completed',
    queryFn: async () => {
      const result = await marketplace.from('marketplace_reviews').select('*').eq('request_id', id!).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const isCustomer = order.data?.customer_id === user?.id;
  const isProvider = provider.data?.user_id === user?.id;
  const total = order.data?.total ?? null;
  const timeline = useMemo(() => [
    ['requested', 'Solicitud'], ['quoted', 'Presupuesto'], ['accepted', 'Aceptado'],
    ['paid', 'Pagado'], ['in_progress', 'En ejecución'], ['completed', 'Finalizado'],
  ], []);

  async function transition(status: 'accepted' | 'cancelled' | 'in_progress' | 'completed' | 'disputed') {
    if (!order.data || busy) return;
    setBusy(true); setNotice('');
    try {
      const result = await marketplace.from('marketplace_requests').update({ status }).eq('id', order.data.id).select().single();
      if (result.error) throw result.error;
      await cache.invalidateQueries({ queryKey: ['marketplace'] });
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }

  async function startPayment() {
    if (!order.data || busy) return;
    setBusy(true); setNotice('');
    try {
      const { data, error } = await supabase.functions.invoke('marketplace-checkout', { body: { requestId: order.data.id } });
      if (error) throw error;
      if (!data?.url) throw new Error('Checkout URL missing');
      window.location.assign(data.url);
    } catch {
      setNotice('El pago online aún no está activado para esta operación. El expediente queda guardado y podrás pagarlo cuando la pasarela esté habilitada.');
    } finally { setBusy(false); }
  }

  async function sendMessage() {
    if (!user || !id || !message.trim() || busy) return;
    setBusy(true); setNotice('');
    try {
      const result = await marketplace.from('marketplace_messages').insert({ request_id: id, sender_id: user.id, body: message.trim() });
      if (result.error) throw result.error;
      setMessage('');
      await messages.refetch();
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }

  async function sendReview() {
    if (!id || busy) return;
    setBusy(true); setNotice('');
    try {
      const result = await marketplace.from('marketplace_reviews').insert({ request_id: id, rating, comment: review.trim() });
      if (result.error) throw result.error;
      await existingReview.refetch();
      setNotice('Gracias. Tu valoración ya forma parte del historial verificado del profesional.');
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }

  return (
    <Layout title="Expediente de servicio" description="Gestiona tu contratación, conversación, pago y valoración.">
      <section className="bg-gradient-sand py-10 sm:py-16">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <Link to="/mi-cuenta" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" /> Mi cuenta</Link>
          {order.isPending ? <div className="mt-8"><Notice>Cargando expediente…</Notice></div> : order.error ? <div className="mt-8"><Notice>{marketplaceError(order.error)}</Notice></div> : !order.data ? <div className="mt-8"><Notice>No tienes acceso a este expediente.</Notice></div> : (
            <div className="mt-7 space-y-6">
              <div className="rounded-[2rem] bg-ink p-6 text-white shadow-xl sm:p-9">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="premium-kicker text-primary">Pedido {order.data.id.slice(0, 8).toUpperCase()}</p>
                    <h1 className="mt-4 text-3xl font-bold !text-white sm:text-4xl">{order.data.service_title}</h1>
                    <p className="mt-3 text-sm text-white/55">{provider.data?.display_name ?? 'Profesional'} · {order.data.city} · {order.data.language}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4"><p className="text-xs uppercase tracking-[0.16em] text-white/40">Estado</p><p className="mt-1 font-bold text-white">{STATUS_LABELS[order.data.status] ?? order.data.status}</p></div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {timeline.map(([key, label]) => {
                    const current = timeline.findIndex(([value]) => value === order.data!.status);
                    const index = timeline.findIndex(([value]) => value === key);
                    const active = current >= index && current !== -1;
                    return <div key={key} className={`rounded-xl border px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider ${active ? 'border-primary/40 bg-primary/15 text-white' : 'border-white/8 bg-white/[0.03] text-white/25'}`}>{label}</div>;
                  })}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <article className="rounded-[1.7rem] border border-border bg-card p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-ink">Tu solicitud</h2>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{order.data.details}</p>
                    {order.data.preferred_date && <p className="mt-4 text-sm"><strong>Fecha preferida:</strong> {order.data.preferred_date}</p>}
                  </article>

                  <article className="rounded-[1.7rem] border border-border bg-card p-6 sm:p-8">
                    <div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-ink">Conversación del expediente</h2></div>
                    <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                      {messages.isPending ? <p className="text-sm text-muted-foreground">Cargando mensajes…</p> : messages.data?.length ? messages.data.map((item) => {
                        const own = item.sender_id === user?.id;
                        return <div key={item.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${own ? 'bg-ink text-white' : 'bg-muted text-ink'}`}><p>{item.body}</p><p className={`mt-1 text-[10px] ${own ? 'text-white/40' : 'text-muted-foreground'}`}>{new Date(item.created_at).toLocaleString('es-PY')}</p></div></div>;
                      }) : <p className="text-sm text-muted-foreground">Aquí quedará registrada toda la conversación sobre el servicio.</p>}
                    </div>
                    <div className="mt-5 flex gap-3"><Textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={4000} placeholder="Escribe un mensaje…" /><Button onClick={sendMessage} disabled={busy || !message.trim()}>Enviar</Button></div>
                  </article>
                </div>

                <aside className="space-y-6">
                  {order.data.quote_version > 0 && <article className="rounded-[1.7rem] border border-border bg-card p-6 shadow-sm">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">Presupuesto v{order.data.quote_version}</p>
                    <p className="mt-4 text-3xl font-bold text-ink">{money(total, order.data.currency)}</p>
                    <div className="mt-4 space-y-1 text-sm text-muted-foreground"><p>Honorarios: {money(order.data.fee, order.data.currency)}</p><p>Impuestos: {money(order.data.taxes, order.data.currency)}</p><p>Gastos: {money(order.data.expenses, order.data.currency)}</p></div>
                    <p className="mt-5 whitespace-pre-wrap border-t border-border pt-5 text-sm leading-6 text-muted-foreground">{order.data.quote_terms}</p>
                    {isCustomer && order.data.status === 'quoted' && <Button className="mt-5 w-full" onClick={() => transition('accepted')} disabled={busy}>Aceptar presupuesto</Button>}
                    {isCustomer && order.data.status === 'accepted' && <Button className="mt-5 w-full" onClick={startPayment} disabled={busy}><CreditCard className="mr-2 h-4 w-4" /> Pagar de forma segura</Button>}
                    {order.data.payment_status === 'paid' && <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><ShieldCheck className="h-4 w-4" /> Pago confirmado</p>}
                  </article>}

                  <article className="rounded-[1.7rem] border border-border bg-card p-6">
                    <h2 className="font-bold text-ink">Acciones</h2>
                    <div className="mt-4 space-y-2">
                      {isProvider && order.data.status === 'paid' && <Button className="w-full" onClick={() => transition('in_progress')} disabled={busy}>Iniciar servicio</Button>}
                      {isCustomer && ['paid','in_progress'].includes(order.data.status) && <Button className="w-full" onClick={() => transition('completed')} disabled={busy}>Confirmar servicio finalizado</Button>}
                      {isCustomer && ['paid','in_progress'].includes(order.data.status) && <Button variant="outline" className="w-full" onClick={() => transition('disputed')} disabled={busy}>Tengo un problema</Button>}
                      {isCustomer && ['requested','quoted','accepted','payment_pending'].includes(order.data.status) && order.data.payment_status !== 'paid' && <Button variant="outline" className="w-full" onClick={() => transition('cancelled')} disabled={busy}>Cancelar solicitud</Button>}
                    </div>
                  </article>

                  {isCustomer && order.data.status === 'completed' && !existingReview.data && <article className="rounded-[1.7rem] border border-border bg-card p-6">
                    <div className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" /><h2 className="font-bold text-ink">Valora el servicio</h2></div>
                    <div className="mt-4 flex gap-2">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${rating >= value ? 'border-primary bg-primary text-white' : 'border-border'}`}>{value}</button>)}</div>
                    <Textarea className="mt-4" value={review} onChange={(event) => setReview(event.target.value)} maxLength={2000} placeholder="¿Cómo fue tu experiencia?" />
                    <Button className="mt-4 w-full" onClick={sendReview} disabled={busy}>Publicar valoración</Button>
                  </article>}
                  {existingReview.data && <Notice>Valoración verificada: {existingReview.data.rating}/5</Notice>}
                  {notice && <Notice>{notice}</Notice>}
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
