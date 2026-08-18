import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { PARTNER_CATEGORIES, getCategoryStatus } from '@/data/clubData';
import { toast } from '@/hooks/use-toast';

export interface PartnerApplication {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  city: string;
  category: string;
  website: string;
  description: string;
  yearsExperience: string;
  languages: string;
  exclusivityInterest: 'si' | 'no';
}

const EMPTY: PartnerApplication = {
  name: '',
  company: '',
  email: '',
  whatsapp: '',
  city: '',
  category: '',
  website: '',
  description: '',
  yearsExperience: '',
  languages: '',
  exclusivityInterest: 'no',
};

const inputClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring';
const labelClass = 'mb-1.5 block text-sm font-medium text-ink';

interface Props {
  defaultCategory?: string;
}

/**
 * MOCK SUBMISSION: no backend yet. The application is kept in local component
 * state so the flow can be validated before wiring persistence.
 */
export const PartnerApplicationForm = ({ defaultCategory = '' }: Props) => {
  const [form, setForm] = useState<PartnerApplication>({ ...EMPTY, category: defaultCategory });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<PartnerApplication | null>(null);

  const set = (k: keyof PartnerApplication, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(form);
    toast({
      title: 'Postulación recibida',
      description: 'Revisaremos tu perfil y te contactaremos para la entrevista de admisión.',
    });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-secondary/25 bg-secondary/5 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
        <h3 className="mt-5 text-xl font-bold text-ink sm:text-2xl">Gracias, {submitted.name.split(' ')[0]}.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Tu postulación para la categoría <strong className="text-ink">{submitted.category || 'sin definir'}</strong>{' '}
          quedó registrada. El comité de admisión revisa las solicitudes y responde en un plazo
          aproximado de 5 días hábiles.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(null);
            setForm({ ...EMPTY, category: defaultCategory });
          }}
          className="mt-7 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-muted"
        >
          Enviar otra postulación
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">Nombre y apellido *</label>
          <input id="name" required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="María González" />
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Empresa o estudio *</label>
          <input id="company" required className={inputClass} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="González & Asociados" />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" type="email" required className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="maria@estudio.com.py" />
        </div>
        <div>
          <label className={labelClass} htmlFor="whatsapp">WhatsApp *</label>
          <input id="whatsapp" required className={inputClass} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+595 9xx xxx xxx" />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">Ciudad *</label>
          <input id="city" required className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Asunción" />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">Categoría profesional *</label>
          <select id="category" required className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">Seleccioná una categoría</option>
            {PARTNER_CATEGORIES.map((c) => {
              const exclusive = getCategoryStatus(c) === 'exclusive';
              return (
                <option key={c.slug} value={c.name} disabled={exclusive}>
                  {c.name}
                  {exclusive ? ' — categoría exclusiva (sin plazas)' : ''}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="website">Web o redes</label>
          <input id="website" className={inputClass} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
        </div>
        <div>
          <label className={labelClass} htmlFor="years">Años de experiencia *</label>
          <input id="years" type="number" min="0" required className={inputClass} value={form.yearsExperience} onChange={(e) => set('yearsExperience', e.target.value)} placeholder="8" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="languages">Idiomas de atención *</label>
          <input id="languages" required className={inputClass} value={form.languages} onChange={(e) => set('languages', e.target.value)} placeholder="Español, inglés, portugués" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">Descripción breve de tu servicio *</label>
          <textarea id="description" required rows={4} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Qué resolvés para un extranjero que llega a Paraguay y por qué sos la mejor opción de tu categoría." />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>¿Te interesa la exclusividad de categoría (USD 5.000/año adicionales)?</legend>
          <div className="mt-2 flex gap-3">
            {(['si', 'no'] as const).map((v) => (
              <label
                key={v}
                className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                  form.exclusivityInterest === v
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="exclusivity"
                  className="sr-only"
                  checked={form.exclusivityInterest === v}
                  onChange={() => set('exclusivityInterest', v)}
                />
                {v === 'si' ? 'Sí, me interesa' : 'No por ahora'}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 sm:w-auto"
      >
        {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
        Enviar postulación
      </button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Sin pago en esta etapa. La postulación inicia un proceso de admisión; la membresía se
        formaliza solo tras la aprobación del comité.
      </p>
    </form>
  );
};
