import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const rate = COMMISSION_PROPOSAL[request.category_slug];
  const expired = request.quote_expires_at !== null && new Date(request.quote_expires_at).getTime() <= Date.now();

  async function update(status: ServiceRequest['status'], quote = false) {
    if (busy) return;
    setBusy(true); setNotice('');
    try {
      const payload = quote
        ? {
            status,
            fee: Number(fee),
            taxes: Number(taxes),
            expenses: Number(expenses),
            quote_terms: terms.trim(),
            quote_expires_at: new Date(Date.now() + Number(days) * 86400000).toISOString(),
          }
        : { status };
      const result = await marketplace.from('marketplace_requests').update(payload).eq('id', request.id).eq('status', request.status).eq('quote_version', request.quote_version).select().maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) {
        setNotice('El expediente ha cambiado. Actualiza la página antes de continuar.');
        return;
      }
      setOpen(false); setNotice('Cambio guardado.'); onSaved();
    } catch (error) {
      setNotice(marketplaceError(error));
    } finally {
      setBusy(false);
    }
  }

  const quoteTotal = Number(fee) + Number(taxes) + Number(expenses);
  const commission = typeof rate === 'number'
    ? Math.round(Number(fee) * rate / 100 * (request.currency === 'PYG' ? 1 : 100)) / (request.currency === 'PYG' ? 1 : 100)
    : null;

  return (
    <article className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="text-lg font-bold text-ink">{request.service_title}</h3><p className="mt-1 text-xs text-muted-foreground">{request.city} · {request.language} · {new Date(request.created_at).toLocaleDateString('es-PY')}</p></div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-primary">{STATUS_LABELS[request.status] ?? request.status}</span>
      </div>
      <p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{request.details}</p>

      {request.fee !== null && <div className="mt-5 rounded-xl bg-muted/70 p-4 text-sm"><div className="flex items-end justify-between gap-3"><span className="text-muted-foreground">Total</span><strong className="text-lg text-ink">{money(request.total, request.currency)}</strong></div>{!customer && <p className="mt-2 text-xs text-muted-foreground">Comisión Living Paraguay: {money(request.commission_amount, request.currency)} ({request.commission_percent} %) · Neto estimado: {money(request.provider_net, request.currency)}</p>}{expired && request.status === 'quoted' && <p className="mt-2 text-xs font-semibold text-destructive">Presupuesto caducado</p>}</div>}

      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={`/pedido/${request.id}`} className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft">Abrir expediente <ArrowRight className="h-4 w-4" /></Link>
        {!customer && ['requested','quoted'].includes(request.status) && <><Button disabled={typeof rate !== 'number' || busy} onClick={() => setOpen(true)}>Preparar presupuesto</Button><Button variant="outline" disabled={busy} onClick={() => update('declined')}>No puedo atenderlo</Button></>}
      </div>
      {!customer && typeof rate !== 'number' && <p className="mt-4 text-sm text-muted-foreground">La tarifa de esta actividad debe estar configurada antes de emitir presupuesto.</p>}
      {notice && <div className="mt-4"><Notice>{notice}</Notice></div>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Presupuesto para {request.service_title}</DialogTitle><DialogDescription>Detalla alcance, plazos y condiciones. Todos los importes están en {request.currency}.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void update('quoted', true); }}>
            {[
              ['Honorarios', 'fee', fee, setFee],
              ['Impuestos', 'taxes', taxes, setTaxes],
              ['Gastos de terceros', 'expenses', expenses, setExpenses],
            ].map(([label, name, value, setter]) => <Field key={String(name)} label={String(label)} name={String(name)} value={String(value)} onChange={setter as (value: string) => void} type="number" min={0} max={999999999} step={request.currency === 'PYG' ? '1' : '0.01'} required />)}
            <Field label="Alcance, entregables, plazos y condiciones de cancelación" name="quote-terms" area value={terms} onChange={setTerms} required minLength={20} maxLength={5000} />
            <Field label="Validez en días" name="quote-days" type="number" min={1} max={89} step="1" value={days} onChange={setDays} required />
            <div className="rounded-xl bg-muted p-4 text-sm"><p>Total para el cliente: <strong>{money(Number.isFinite(quoteTotal) ? quoteTotal : null, request.currency)}</strong></p><p className="mt-2">Comisión de plataforma: {money(commission, request.currency)} ({rate} %) · Neto estimado: {money(commission === null ? null : Number(fee) - commission, request.currency)}</p></div>
            <p className="text-xs leading-5 text-muted-foreground">La comisión definitiva se calcula y congela en el servidor cuando guardas el presupuesto. El navegador no puede modificarla.</p>
            <Button type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Enviar presupuesto'}</Button>
            {notice && <Notice>{notice}</Notice>}
          </form>
        </DialogContent>
      </Dialog>
    </article>
  );
}
