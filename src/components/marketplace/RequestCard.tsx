import { useState } from 'react';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import type { ServiceRequest } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { COMMISSION_PROPOSAL } from '@/data/marketplace';
import { Field, Notice } from './Fields';
import { money, STATUS_LABELS } from './format';

export function RequestCard({ request, customer, onSaved }: { request: ServiceRequest; customer: boolean; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState(request.fee?.toString() ?? '');
  const [taxes, setTaxes] = useState(request.taxes.toString());
  const [expenses, setExpenses] = useState(request.expenses.toString());
  const [terms, setTerms] = useState(request.quote_terms);
  const [days, setDays] = useState('7');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const rate = COMMISSION_PROPOSAL[request.category_slug];
  const expired = request.quote_expires_at !== null && new Date(request.quote_expires_at).getTime() <= Date.now();
  async function update(status: ServiceRequest['status'], quote = false) {
    if (busy) return; setBusy(true); setNotice('');
    try {
      const payload = quote ? { status, fee: Number(fee), taxes: Number(taxes), expenses: Number(expenses), quote_terms: terms.trim(), quote_expires_at: new Date(Date.now() + Number(days) * 86400000).toISOString() } : { status };
      const result = await marketplace.from('marketplace_requests').update(payload).eq('id', request.id).eq('status', request.status).eq('quote_version', request.quote_version).select().maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) { setNotice('La solicitud ha cambiado. Actualiza la página antes de continuar.'); return; }
      setOpen(false); setNotice('Cambio guardado.'); onSaved();
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }
  const quoteTotal = Number(fee) + Number(taxes) + Number(expenses);
  const commission = rate === undefined ? null : Math.round(Number(fee) * rate / 100 * (request.currency === 'PYG' ? 1 : 100)) / (request.currency === 'PYG' ? 1 : 100);
  return <article className="space-y-4 rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-semibold">{request.service_title}</h3><span className="text-sm font-medium text-primary">{STATUS_LABELS[request.status]}</span></div><p className="text-sm text-muted-foreground">{request.city} · {request.language} · {new Date(request.created_at).toLocaleDateString('es-PY')}</p><p className="whitespace-pre-wrap">{request.details}</p>
    {request.fee !== null && <div className="space-y-2 rounded-xl bg-muted p-4"><p>Honorarios: {money(request.fee, request.currency)}</p><p>Impuestos: {money(request.taxes, request.currency)} · Gastos de terceros: {money(request.expenses, request.currency)}</p><p className="text-lg font-bold">Total: {money(request.total, request.currency)}</p>{!customer && <p>Comisión LBC: {money(request.commission_amount, request.currency)} ({request.commission_percent} %) · Honorarios netos: {money(request.provider_net, request.currency)}</p>}<p className="whitespace-pre-wrap">{request.quote_terms}</p><p className="text-sm">Válido hasta: {request.quote_expires_at ? new Date(request.quote_expires_at).toLocaleString('es-PY') : 'Sin fecha'}{expired && request.status === 'quoted' ? ' · Caducado' : ''}</p></div>}
    {customer && request.status === 'quoted' && !expired && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>He revisado el alcance, el total y las condiciones de cancelación. Aceptar el presupuesto no realiza ningún pago.</span></label>}
    <div className="flex flex-wrap gap-3">{customer && request.status === 'quoted' && <Button disabled={busy || expired || !consent} onClick={() => update('accepted')}>Aceptar presupuesto</Button>}{customer && ['requested','quoted'].includes(request.status) && <Button variant="outline" disabled={busy} onClick={() => update('cancelled')}>Cancelar solicitud</Button>}{customer && request.status === 'accepted' && <Button disabled={busy} onClick={() => update('completed')}>Confirmar servicio recibido</Button>}{!customer && ['requested','quoted'].includes(request.status) && <><Button disabled={rate === undefined || busy} onClick={() => setOpen(true)}>Preparar presupuesto</Button><Button variant="outline" disabled={busy} onClick={() => update('declined')}>No puedo atenderlo</Button></>}</div>
    {!customer && rate === undefined && <p className="text-sm text-muted-foreground">Esta actividad requiere acordar la comisión con LBC antes de emitir un presupuesto.</p>}
    {request.status === 'accepted' && <Notice>Presupuesto aceptado. Los pagos online aún no están habilitados. Contacta con Living Paraguay para coordinar los siguientes pasos.</Notice>}{notice && <Notice>{notice}</Notice>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Presupuesto para {request.service_title}</DialogTitle><DialogDescription>Detalla el alcance, los plazos y las condiciones. Todos los importes están en {request.currency}.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={e => { e.preventDefault(); void update('quoted', true); }}>{[['Honorarios', 'fee', fee, setFee],['Impuestos', 'taxes', taxes, setTaxes],['Gastos de terceros', 'expenses', expenses, setExpenses]].map(([label,name,value,setter]) => <Field key={String(name)} label={String(label)} name={String(name)} value={String(value)} onChange={setter as (v: string) => void} type="number" min={0} max={999999999} step={request.currency === 'PYG' ? '1' : '0.01'} required/>)}<Field label="Alcance, plazos y condiciones de cancelación" name="quote-terms" area value={terms} onChange={setTerms} required minLength={20} maxLength={5000}/><Field label="Validez en días" name="quote-days" type="number" min={1} max={89} step="1" value={days} onChange={setDays} required/><p>Total para el cliente: <strong>{money(Number.isFinite(quoteTotal) ? quoteTotal : null, request.currency)}</strong></p><p>Comisión orientativa: {money(commission, request.currency)} ({rate} %) · Honorarios netos: {money(commission === null ? null : Number(fee) - commission, request.currency)}</p><p className="text-sm text-muted-foreground">La comisión definitiva se calcula al guardar y queda indicada en el presupuesto.</p><Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Enviar presupuesto'}</Button>{notice && <Notice>{notice}</Notice>}</form></DialogContent></Dialog>
  </article>;
}
