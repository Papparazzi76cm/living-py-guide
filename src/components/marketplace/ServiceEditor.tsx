import { useState } from 'react';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import type { Service } from '@/types/marketplace';
import { SERVICE_CATEGORIES } from '@/data/marketplace';
import { Field, Notice } from './Fields';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export function ServiceEditor({ providerId, service, onSaved }: { providerId: string; service?: Service; onSaved: () => void }) {
  const [title, setTitle] = useState(service?.title ?? '');
  const [category, setCategory] = useState(service?.category_slug ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [exclusions, setExclusions] = useState(service?.exclusions ?? '');
  const [delivery, setDelivery] = useState(service?.delivery_terms ?? '');
  const [cancellation, setCancellation] = useState(service?.cancellation_terms ?? '');
  const [price, setPrice] = useState(service?.price?.toString() ?? '');
  const [currency, setCurrency] = useState<'USD' | 'PYG'>(service?.currency ?? 'USD');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (busy) return;
    if (!category || (price !== '' && (!Number.isFinite(Number(price)) || Number(price) < 0))) { setNotice('Selecciona una categoría e indica un precio válido, o déjalo vacío para presupuesto a consultar.'); return; }
    setBusy(true); setNotice('');
    try {
      const payload = { provider_id: providerId, category_slug: category, title: title.trim(), description: description.trim(), exclusions: exclusions.trim(), delivery_terms: delivery.trim(), cancellation_terms: cancellation.trim(), price: price === '' ? null : Number(price), currency, status: 'pending' as const };
      const result = service ? await marketplace.from('marketplace_services').update(payload).eq('id', service.id).select().single() : await marketplace.from('marketplace_services').insert(payload).select().single();
      if (result.error) throw result.error;
      onSaved();
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-5"><Field label="Nombre del servicio" name="service-title" value={title} onChange={setTitle} required minLength={5} maxLength={140}/><div className="space-y-2"><label htmlFor="service-category" className="text-sm font-medium">Categoría</label><Select value={category} onValueChange={setCategory}><SelectTrigger id="service-category"><SelectValue placeholder="Selecciona una categoría"/></SelectTrigger><SelectContent>{SERVICE_CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div><Field label="Qué incluye el servicio" name="service-description" area value={description} onChange={setDescription} required minLength={30} maxLength={5000}/><Field label="Qué no incluye y qué gastos se presupuestan aparte" name="service-exclusions" area value={exclusions} onChange={setExclusions} required minLength={2} maxLength={2000}/><Field label="Plazos, modalidad y disponibilidad" name="service-delivery" area value={delivery} onChange={setDelivery} required minLength={5} maxLength={1000}/><Field label="Condiciones de cancelación" name="service-cancellation" area value={cancellation} onChange={setCancellation} required minLength={5} maxLength={2000}/><div className="grid gap-4 sm:grid-cols-2"><Field label="Honorarios orientativos (vacío: a consultar)" name="service-price" type="number" min={0} max={999999999} step={currency === 'PYG' ? '1' : '0.01'} value={price} onChange={setPrice}/><div className="space-y-2"><label htmlFor="service-currency">Moneda</label><Select value={currency} onValueChange={v => setCurrency(v as 'USD' | 'PYG')}><SelectTrigger id="service-currency"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="USD">USD · Dólares</SelectItem><SelectItem value="PYG">PYG · Guaraníes</SelectItem></SelectContent></Select></div></div><p className="text-sm text-muted-foreground">El cliente recibirá un presupuesto con el precio total, impuestos y gastos antes de aceptar. Los cambios vuelven a revisión.</p><Button disabled={busy} type="submit">{busy ? 'Guardando…' : 'Enviar servicio a revisión'}</Button>{notice && <Notice>{notice}</Notice>}</form>;
}
