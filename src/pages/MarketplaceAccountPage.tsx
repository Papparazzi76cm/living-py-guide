import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, CreditCard, Plus, RefreshCw, Store } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { supabase } from '@/integrations/supabase/client';
import { ProviderForm } from '@/components/marketplace/ProviderForm';
import { ServiceEditor } from '@/components/marketplace/ServiceEditor';
import { RequestCard } from '@/components/marketplace/RequestCard';
import { Notice } from '@/components/marketplace/Fields';
import { STATUS_LABELS } from '@/components/marketplace/format';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Service } from '@/types/marketplace';

export default function MarketplaceAccountPage() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const cache = useQueryClient();
  const [editor, setEditor] = useState<Service | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = () => { void cache.invalidateQueries({ queryKey: ['marketplace'] }); };

  const profile = useQuery({
    queryKey: ['marketplace', 'profile', user?.id], enabled: !!user,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_providers').select('*').eq('user_id', user!.id).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const services = useQuery({
    queryKey: ['marketplace', 'own-services', profile.data?.id], enabled: !!profile.data,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_services').select('*').eq('provider_id', profile.data!.id).order('created_at', { ascending: false });
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const requests = useQuery({
    queryKey: ['marketplace', 'requests', user?.id], enabled: !!user,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_requests').select('*').order('created_at', { ascending: false });
      if (result.error) throw result.error;
      return result.data;
    },
  });

  const reviewQueue = useQuery({
    queryKey: ['marketplace', 'review', user?.id], enabled: !!user && isAdmin,
    queryFn: async () => {
      const [providers, pendingServices] = await Promise.all([
        marketplace.from('marketplace_providers').select('*'),
        marketplace.from('marketplace_services').select('*').eq('status', 'pending'),
      ]);
      if (providers.error) throw providers.error;
      if (pendingServices.error) throw pendingServices.error;
      return { providers: providers.data, services: pendingServices.data };
    },
  });

  if (isLoading) return <Layout title="Mi cuenta" description="Gestiona tus contrataciones."><section className="container mx-auto px-5 py-16"><Notice>Cargando tu sesión…</Notice></section></Layout>;
  if (!user) return <Navigate to="/acceso?next=%2Fmi-cuenta" replace />;

  async function moderate(type: 'provider' | 'service', id: string, approved: boolean) {
    setBusy(true); setNotice('');
    try {
      const result = type === 'provider'
        ? await marketplace.from('marketplace_providers').update({ status: approved ? 'approved' : 'rejected' }).eq('id', id).select().single()
        : await marketplace.from('marketplace_services').update({ status: approved ? 'published' : 'hidden' }).eq('id', id).select().single();
      if (result.error) throw result.error;
      refresh(); setNotice('Revisión guardada.');
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }

  async function connectStripe() {
    if (!profile.data || busy) return;
    setBusy(true); setNotice('');
    try {
      const { data, error } = await supabase.functions.invoke('marketplace-connect-onboarding', { body: { providerId: profile.data.id } });
      if (error) throw error;
      if (!data?.url) throw new Error('Missing onboarding URL');
      window.location.assign(data.url);
    } catch {
      setNotice('La conexión de cobros está preparada, pero todavía no está activada en este entorno. Tu perfil y tus servicios pueden seguir configurándose.');
    } finally { setBusy(false); }
  }

  const myRequests = requests.data?.filter((request) => request.customer_id === user.id) ?? [];
  const received = requests.data?.filter((request) => request.provider_id === profile.data?.id && request.customer_id !== user.id) ?? [];

  return (
    <Layout title="Mi cuenta" description="Gestiona contrataciones, servicios, presupuestos y cobros en Living Paraguay.">
      <section className="bg-gradient-sand py-10 sm:py-16">
        <div className="container mx-auto space-y-8 px-5 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="premium-kicker text-primary">Panel de operaciones</p><h1 className="premium-display mt-3 text-4xl text-ink sm:text-5xl">Mi cuenta</h1><p className="mt-3 text-sm text-muted-foreground">{user.email}</p></div>
            <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={refresh}><RefreshCw className="mr-2 h-4 w-4" /> Actualizar</Button><Button variant="outline" onClick={() => { cache.removeQueries({ queryKey: ['marketplace'] }); void signOut(); }}>Cerrar sesión</Button></div>
          </div>
          {notice && <Notice>{notice}</Notice>}

          <Tabs defaultValue="requests">
            <TabsList className="flex h-auto flex-wrap justify-start gap-2 rounded-2xl bg-white/70 p-2">
              <TabsTrigger value="requests">Mis contrataciones</TabsTrigger>
              <TabsTrigger value="provider">Vender servicios</TabsTrigger>
              {isAdmin && <TabsTrigger value="review">Moderación</TabsTrigger>}
            </TabsList>

            <TabsContent value="requests" className="space-y-5 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-ink">Mis pedidos</h2><p className="mt-1 text-sm text-muted-foreground">Presupuestos, pagos, conversación y seguimiento.</p></div><Link to="/servicios" className="premium-button">Buscar un servicio <ArrowRight className="h-4 w-4" /></Link></div>
              {requests.isPending ? <Notice>Cargando pedidos…</Notice> : requests.error ? <Notice>{marketplaceError(requests.error)}</Notice> : myRequests.length ? myRequests.map((request) => <RequestCard key={request.id} request={request} customer onSaved={refresh} />) : <Notice>Aún no has solicitado ningún servicio.</Notice>}
            </TabsContent>

            <TabsContent value="provider" className="space-y-8 pt-6">
              {profile.isPending ? <Notice>Cargando perfil…</Notice> : profile.error ? <Notice>{marketplaceError(profile.error)}</Notice> : !profile.data ? (
                <div className="rounded-[1.7rem] border border-white bg-white/85 p-7 shadow-sm"><Store className="h-7 w-7 text-primary" /><h2 className="mt-5 text-2xl font-bold text-ink">¿Quieres vender servicios?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">El alta profesional es gratuita. Publicas tus servicios y Living Paraguay cobra la comisión configurada solo cuando se genera una operación.</p><Link to="/ofrecer-servicios" className="premium-button mt-6">Crear perfil profesional <ArrowRight className="h-4 w-4" /></Link></div>
              ) : <>
                <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
                  <div className="rounded-[1.7rem] border border-white bg-white/85 p-6 shadow-sm"><div className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-primary" /><h2 className="text-xl font-bold text-ink">{profile.data.display_name}</h2></div><p className="mt-3 text-sm text-muted-foreground">Estado: <strong>{STATUS_LABELS[profile.data.status]}</strong></p><p className="mt-2 text-sm text-muted-foreground">{profile.data.city} · {profile.data.languages.join(', ')}</p><div className="mt-5"><ProviderForm key={profile.data.id} provider={profile.data} onSaved={refresh} /></div></div>
                  <div className="rounded-[1.7rem] bg-ink p-6 text-white"><CreditCard className="h-6 w-6 text-primary" /><h2 className="mt-5 text-xl font-bold !text-white">Cobros y payouts</h2><p className="mt-3 text-sm leading-6 text-white/55">Los cobros se procesarán en la plataforma y tu parte se enviará a la cuenta conectada, descontando la comisión del marketplace.</p><p className="mt-5 text-sm font-semibold text-white">Estado: {profile.data.payouts_enabled ? 'Cobros activados' : profile.data.stripe_onboarding_status === 'pending' ? 'Verificación en curso' : 'Pendiente de conectar'}</p><Button className="mt-5 w-full" onClick={connectStripe} disabled={busy || profile.data.status !== 'approved'}>{profile.data.payouts_enabled ? 'Revisar cuenta de cobros' : 'Configurar cobros'}</Button>{profile.data.status !== 'approved' && <p className="mt-3 text-xs text-white/40">Podrás conectar cobros cuando el perfil esté aprobado.</p>}</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-ink">Mis servicios</h2><p className="mt-1 text-sm text-muted-foreground">Cada servicio se revisa antes de aparecer en el marketplace.</p></div><Button onClick={() => setEditor('new')}><Plus className="mr-2 h-4 w-4" /> Añadir servicio</Button></div>
                {services.error ? <Notice>{marketplaceError(services.error)}</Notice> : services.isPending ? <Notice>Cargando servicios…</Notice> : services.data?.length ? <div className="grid gap-4 md:grid-cols-2">{services.data.map((service) => <div key={service.id} className="rounded-[1.5rem] border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-ink">{service.title}</h3><p className="mt-1 text-xs text-muted-foreground">{STATUS_LABELS[service.status]}</p></div><Button size="sm" variant="outline" onClick={() => setEditor(service)}>Editar</Button></div></div>)}</div> : <Notice>Añade tu primer servicio para enviarlo a revisión.</Notice>}

                <div><h2 className="text-2xl font-bold text-ink">Solicitudes recibidas</h2><p className="mt-1 text-sm text-muted-foreground">Responde con un presupuesto y gestiona el pedido desde su expediente.</p></div>
                {requests.error ? <Notice>{marketplaceError(requests.error)}</Notice> : received.length ? received.map((request) => <RequestCard key={request.id} request={request} customer={false} onSaved={refresh} />) : <Notice>Todavía no hay solicitudes para tus servicios.</Notice>}
              </>}
            </TabsContent>

            {isAdmin && <TabsContent value="review" className="space-y-6 pt-6">
              <div><h2 className="text-2xl font-bold text-ink">Cola de verificación</h2><p className="mt-2 text-sm text-muted-foreground">Verifica identidad comercial, alcance y condiciones antes de publicar.</p></div>
              {reviewQueue.error ? <Notice>{marketplaceError(reviewQueue.error)}</Notice> : reviewQueue.isPending ? <Notice>Cargando publicaciones…</Notice> : <>
                {!reviewQueue.data?.providers.some((provider) => provider.status === 'pending') && !reviewQueue.data?.services.length && <Notice>No hay publicaciones pendientes.</Notice>}
                {reviewQueue.data?.providers.filter((provider) => provider.status === 'pending').map((provider) => <article key={provider.id} className="rounded-[1.5rem] border border-border bg-card p-6"><h3 className="text-xl font-bold text-ink">{provider.display_name}</h3><p className="mt-2 text-sm text-muted-foreground">{provider.city} · {provider.languages.join(', ')}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-6">{provider.description}</p><div className="mt-5 flex gap-3"><Button disabled={busy} onClick={() => moderate('provider', provider.id, true)}>Aprobar</Button><Button disabled={busy} variant="outline" onClick={() => moderate('provider', provider.id, false)}>Rechazar</Button></div></article>)}
                {reviewQueue.data?.services.map((service) => <article key={service.id} className="rounded-[1.5rem] border border-border bg-card p-6"><h3 className="text-xl font-bold text-ink">{service.title}</h3><p className="mt-2 text-sm text-muted-foreground">{reviewQueue.data?.providers.find((provider) => provider.id === service.provider_id)?.display_name ?? 'Perfil no encontrado'}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-6">{service.description}</p><div className="mt-5 flex gap-3"><Button disabled={busy} onClick={() => moderate('service', service.id, true)}>Publicar</Button><Button disabled={busy} variant="outline" onClick={() => moderate('service', service.id, false)}>Ocultar</Button></div></article>)}
              </>}
            </TabsContent>}
          </Tabs>

          <Dialog open={editor !== null} onOpenChange={(open) => { if (!open) setEditor(null); }}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{editor === 'new' ? 'Añadir servicio' : 'Editar servicio'}</DialogTitle><DialogDescription>Describe un servicio comprensible y contratabile, no solo tu empresa.</DialogDescription></DialogHeader>{profile.data && editor && <ServiceEditor key={editor === 'new' ? 'new' : editor.id} providerId={profile.data.id} service={editor === 'new' ? undefined : editor} onSaved={() => { setEditor(null); refresh(); }} />}</DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
}
