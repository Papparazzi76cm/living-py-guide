import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
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
  const { user, isAdmin, signOut } = useAuth();
  const cache = useQueryClient();
  const [editor, setEditor] = useState<Service | 'new' | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = () => { void cache.invalidateQueries({ queryKey: ['marketplace'] }); };
  const profile = useQuery({ queryKey: ['marketplace', 'profile', user?.id], enabled: !!user, queryFn: async () => {
    const r = await marketplace.from('marketplace_providers').select('*').eq('user_id', user!.id).maybeSingle(); if (r.error) throw r.error; return r.data;
  }});
  const services = useQuery({ queryKey: ['marketplace', 'own-services', profile.data?.id], enabled: !!profile.data, queryFn: async () => {
    const r = await marketplace.from('marketplace_services').select('*').eq('provider_id', profile.data!.id).order('created_at', { ascending: false }); if (r.error) throw r.error; return r.data;
  }});
  const requests = useQuery({ queryKey: ['marketplace', 'requests', user?.id], enabled: !!user, queryFn: async () => {
    const r = await marketplace.from('marketplace_requests').select('*').order('created_at', { ascending: false }); if (r.error) throw r.error; return r.data;
  }});
  const review = useQuery({ queryKey: ['marketplace', 'review', user?.id], enabled: !!user && isAdmin, queryFn: async () => {
    const [p,s] = await Promise.all([marketplace.from('marketplace_providers').select('*'), marketplace.from('marketplace_services').select('*').eq('status','pending')]);
    if (p.error) throw p.error; if (s.error) throw s.error; return { providers: p.data, services: s.data };
  }});
  async function moderate(type: 'provider' | 'service', id: string, approved: boolean) {
    setBusy(true); setNotice('');
    try {
      const r = type === 'provider'
        ? await marketplace.from('marketplace_providers').update({ status: approved ? 'approved' : 'rejected' }).eq('id', id).select().single()
        : await marketplace.from('marketplace_services').update({ status: approved ? 'published' : 'hidden' }).eq('id', id).select().single();
      if (r.error) throw r.error; refresh(); setNotice('Revisión guardada.');
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }
  const myRequests = requests.data?.filter(r => r.customer_id === user?.id) ?? [];
  const received = requests.data?.filter(r => r.provider_id === profile.data?.id && r.customer_id !== user?.id) ?? [];
  return <Layout title="Mi cuenta" description="Gestiona tus servicios y presupuestos en Living Paraguay."><section className="container mx-auto space-y-8 px-4 py-10"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold">Mi cuenta</h1><div className="flex gap-3"><Button variant="outline" onClick={refresh}>Actualizar</Button><Button variant="outline" onClick={() => { cache.removeQueries({ queryKey: ['marketplace'] }); void signOut(); }}>Cerrar sesión</Button></div></div>{notice && <Notice>{notice}</Notice>}
    <Tabs defaultValue="requests"><TabsList className="flex h-auto flex-wrap justify-start gap-2"><TabsTrigger value="requests">Mis solicitudes</TabsTrigger><TabsTrigger value="provider">Mi actividad profesional</TabsTrigger>{isAdmin && <TabsTrigger value="review">Revisión de publicaciones</TabsTrigger>}</TabsList>
      <TabsContent value="requests" className="space-y-5 pt-5">{requests.isPending ? <Notice>Cargando solicitudes…</Notice> : requests.error ? <Notice>{marketplaceError(requests.error)}</Notice> : myRequests.length ? myRequests.map(r => <RequestCard key={r.id} request={r} customer onSaved={refresh}/>) : <Notice>No tienes solicitudes todavía. <Link to="/servicios" className="underline">Explora los servicios</Link>.</Notice>}</TabsContent>
      <TabsContent value="provider" className="space-y-8 pt-5">{profile.isPending ? <Notice>Cargando perfil…</Notice> : profile.error ? <Notice>{marketplaceError(profile.error)}</Notice> : <><ProviderForm key={profile.data?.id ?? 'new'} provider={profile.data ?? null} onSaved={refresh}/>{profile.data && <><p className="font-medium">Estado del perfil: {STATUS_LABELS[profile.data.status]}</p><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-bold">Mis servicios</h2><Button onClick={() => setEditor('new')}>Añadir servicio</Button></div>{services.error ? <Notice>{marketplaceError(services.error)}</Notice> : services.isPending ? <Notice>Cargando servicios…</Notice> : services.data?.length ? services.data.map(s => <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-5"><div><h3 className="font-semibold">{s.title}</h3><p className="text-sm">{STATUS_LABELS[s.status]}</p></div><Button variant="outline" onClick={() => setEditor(s)}>Editar servicio</Button></div>) : <Notice>Añade tu primer servicio para enviarlo a revisión.</Notice>}<h2 className="text-2xl font-bold">Solicitudes recibidas</h2>{requests.error ? <Notice>{marketplaceError(requests.error)}</Notice> : received.length ? received.map(r => <RequestCard key={r.id} request={r} customer={false} onSaved={refresh}/>) : <Notice>Todavía no hay solicitudes para tus servicios.</Notice>}</>}</>}</TabsContent>
      {isAdmin && <TabsContent value="review" className="space-y-6 pt-5"><p>Revisa primero el perfil profesional y después sus servicios. No publiques sin comprobar la información.</p>{review.error ? <Notice>{marketplaceError(review.error)}</Notice> : review.isPending ? <Notice>Cargando publicaciones…</Notice> : <>{!review.data?.providers.some(p => p.status === 'pending') && !review.data?.services.length && <Notice>No hay publicaciones pendientes.</Notice>}{review.data?.providers.filter(p => p.status === 'pending').map(p => <article key={p.id} className="space-y-3 rounded-xl border border-border p-6"><h2 className="text-xl font-bold">{p.display_name}</h2><p>{p.city} · {p.languages.join(', ')}</p><p className="whitespace-pre-wrap">{p.description}</p><div className="flex gap-3"><Button disabled={busy} onClick={() => moderate('provider',p.id,true)}>Aprobar perfil</Button><Button disabled={busy} variant="outline" onClick={() => moderate('provider',p.id,false)}>Rechazar</Button></div></article>)}{review.data?.services.map(s => <article key={s.id} className="space-y-3 rounded-xl border border-border p-6"><h2 className="text-xl font-bold">{s.title}</h2><p className="font-medium">{review.data?.providers.find(p => p.id === s.provider_id)?.display_name ?? 'Perfil no encontrado'}</p><p className="whitespace-pre-wrap">{s.description}</p><p>Exclusiones: {s.exclusions}</p><p>Plazos: {s.delivery_terms}</p><p>Cancelación: {s.cancellation_terms}</p><p>{s.price ?? 'A consultar'} {s.currency}</p><div className="flex gap-3"><Button disabled={busy} onClick={() => moderate('service',s.id,true)}>Publicar servicio</Button><Button disabled={busy} variant="outline" onClick={() => moderate('service',s.id,false)}>Mantener oculto</Button></div></article>)}</>}</TabsContent>}
    </Tabs>
    <Dialog open={editor !== null} onOpenChange={open => { if (!open) setEditor(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editor === 'new' ? 'Añadir servicio' : 'Editar servicio'}</DialogTitle><DialogDescription>Explica exactamente qué ofreces a tus clientes.</DialogDescription></DialogHeader>{profile.data && editor && <ServiceEditor key={editor === 'new' ? 'new' : editor.id} providerId={profile.data.id} service={editor === 'new' ? undefined : editor} onSaved={() => { setEditor(null); refresh(); }}/>}</DialogContent></Dialog>
  </section></Layout>;
}
