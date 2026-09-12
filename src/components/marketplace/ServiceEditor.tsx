import { useState } from 'react';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import type { DeliveryMode, PriceType, Service } from '@/types/marketplace';
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
  const [priceType, setPriceType] = useState<PriceType>(service?.price_type ?? 'quote');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(service?.delivery_mode ?? 'hybrid');
  const [duration, setDuration] = useState(service?.duration_minutes?.toString() ?? '');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const amount = price === '' ? null : Number(price);
    const durationMinutes = duration === '' ? null : Number(duration);
    if (!category || (amount !== null && (!Number.isFinite(amount) || amount < 0)) || (durationMinutes !== null && (!Number.isInteger(durationMinutes) || durationMinutes < 15))) {
      setNotice('Revisa categoría, precio y duración. La duración mínima es de 15 minutos.');
      return;
    }
    setBusy(true); setNotice('');
    try {
      const payload = {
        provider_id: providerId,
        category_slug: category,
        title: title.trim(),
        description: description.trim(),
        exclusions: exclusions.trim(),
        delivery_terms: delivery.trim(),
        cancellation_terms: cancellation.trim(),
        price: amount,
        price_type: priceType,
        delivery_mode: deliveryMode,
        duration_minutes: durationMinutes,
        currency,
        status: 'pending' as const,
      };
      const result = service
        ? await marketplace.from('marketplace_services').update(payload).eq('id', service.id).select().single()
        : await marketplace.from('marketplace_services').insert(payload).select().single();
      if (result.error) throw result.error;
      onSaved();
    } catch (error) {
      setNotice(marketplaceError(error));
    } finally {
      setBusy(false);
    }
  }

  const selectedCategory = SERVICE_CATEGORIES.find((item) => item.slug === category);

  return (
    <form onSubmit={save} className="space-y-5">
      <Field label="Nombre del servicio" name="service-title" value={title} onChange={setTitle} required minLength={5} maxLength={140} />
      <div className="space-y-2">
        <label htmlFor="service-category" className="text-sm font-medium">Categoría</label>
        <Select value={category} onValueChange={setCategory}><SelectTrigger id="service-category"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger><SelectContent>{SERVICE_CATEGORIES.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><label htmlFor="service-price-type" className="text-sm font-medium">Tipo de precio</label><Select value={priceType} onValueChange={(value) => setPriceType(value as PriceType)}><SelectTrigger id="service-price-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="quote">Presupuesto personalizado</SelectItem><SelectItem value="from">Desde</SelectItem><SelectItem value="fixed">Precio fijo</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><label htmlFor="service-delivery-mode" className="text-sm font-medium">Modalidad</label><Select value={deliveryMode} onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}><SelectTrigger id="service-delivery-mode"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="onsite">Presencial</SelectItem><SelectItem value="hybrid">Online o presencial</SelectItem></SelectContent></Select></div>
      </div>
      <Field label="Qué incluye el servicio" name="service-description" area value={description} onChange={setDescription} required minLength={30} maxLength={5000} />
      <Field label="Qué no incluye y qué gastos se presupuestan aparte" name="service-exclusions" area value={exclusions} onChange={setExclusions} required minLength={2} maxLength={2000} />
      <Field label="Plazos, entregables y disponibilidad" name="service-delivery" area value={delivery} onChange={setDelivery} required minLength={5} maxLength={1000} />
      <Field label="Condiciones de cancelación" name="service-cancellation" area value={cancellation} onChange={setCancellation} required minLength={5} maxLength={2000} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Precio orientativo" name="service-price" type="number" min={0} max={999999999} step={currency === 'PYG' ? '1' : '0.01'} value={price} onChange={setPrice} placeholder={priceType === 'quote' ? 'Opcional' : '0'} />
        <div className="space-y-2"><label htmlFor="service-currency" className="text-sm font-medium">Moneda</label><Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'PYG')}><SelectTrigger id="service-currency"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD · Dólares</SelectItem><SelectItem value="PYG">PYG · Guaraníes</SelectItem></SelectContent></Select></div>
        <Field label="Duración estimada (min.)" name="service-duration" type="number" min={15} max={10080} step="15" value={duration} onChange={setDuration} placeholder="Opcional" />
      </div>
      <div className="rounded-xl border border-border bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
        El cliente siempre recibe el total antes de pagar. {selectedCategory?.commissionPercent ? `La comisión inicial de Living Paraguay en esta categoría es del ${selectedCategory.commissionPercent}% sobre tus honorarios y se descuenta solo cuando existe una operación.` : 'La tarifa de plataforma se fijará antes de activar la categoría.'}
      </div>
      <Button disabled={busy} type="submit">{busy ? 'Guardando…' : 'Enviar servicio a revisión'}</Button>
      {notice && <Notice>{notice}</Notice>}
    </form>
  );
}
