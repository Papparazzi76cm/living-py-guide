import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const STAGES = [
  { value: 'planning', label: 'Estoy preparando mi mudanza' },
  { value: 'arriving', label: 'Estoy llegando / primeros 90 días' },
  { value: 'living', label: 'Ya vivo en Paraguay' },
] as const;

const INTERESTS = [
  { value: 'residencia', label: 'Residencia y documentación' },
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'banca', label: 'Banca y finanzas' },
  { value: 'empresa', label: 'Empresa y fiscalidad' },
  { value: 'colegios', label: 'Colegios y familia' },
  { value: 'salud', label: 'Salud y seguros' },
  { value: 'networking', label: 'Comunidad y networking' },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, 'Indica tu nombre').max(100),
  email: z.string().trim().email('Introduce un email válido').max(254).transform((value) => value.toLowerCase()),
  whatsapp: z.string().trim().max(40).optional(),
  nationality: z.string().trim().max(80).optional(),
  stage: z.enum(['planning', 'arriving', 'living']),
  city: z.string().trim().max(100).optional(),
  interests: z.array(z.string()).max(12),
  notes: z.string().trim().max(1500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu consentimiento para guardar la solicitud' }) }),
});

type CommunityForm = {
  name: string;
  email: string;
  whatsapp: string;
  nationality: string;
  stage: 'planning' | 'arriving' | 'living';
  city: string;
  interests: string[];
  notes: string;
  consent: boolean;
  website: string;
};

const EMPTY: CommunityForm = {
  name: '',
  email: '',
  whatsapp: '',
  nationality: '',
  stage: 'planning',
  city: '',
  interests: [],
  notes: '',
  consent: false,
  website: '',
};

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring';
const labelClass = 'mb-1.5 block text-sm font-medium text-ink';

export const CommunityJoinForm = () => {
  const [form, setForm] = useState<CommunityForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const set = <K extends keyof CommunityForm>(key: K, value: CommunityForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleInterest = (value: string) => {
    set('interests', form.interests.includes(value)
      ? form.interests.filter((item) => item !== value)
      : [...form.interests, value]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldError('');

    if (form.website) {
      setSubmitted(true);
      return;
    }

    const parsed = schema.safeParse({ ...form, consent: form.consent });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Revisa los datos del formulario';
      setFieldError(message);
      toast({ title: 'Revisa el formulario', description: message, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('community_signups').insert([{
      name: parsed.data.name,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp || null,
      nationality: parsed.data.nationality || null,
      stage: parsed.data.stage,
      city: parsed.data.city || null,
      interests: parsed.data.interests,
      notes: parsed.data.notes || null,
      consent_privacy: true,
      source: 'community_page',
    }]);
    setSubmitting(false);

    if (error) {
      const duplicate = error.code === '23505';
      toast({
        title: duplicate ? 'Ya formas parte de la lista' : 'No hemos podido guardar tu solicitud',
        description: duplicate
          ? 'Ese email ya está registrado en la comunidad. Si necesitas actualizar tus datos, escríbenos desde Contacto.'
          : 'Inténtalo de nuevo en unos minutos.',
        variant: duplicate ? 'default' : 'destructive',
      });
      if (duplicate) setSubmitted(true);
      return;
    }

    setSubmitted(true);
    setForm(EMPTY);
    toast({ title: 'Bienvenido a Living Paraguay', description: 'Hemos recibido tu alta en la comunidad.' });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-secondary/25 bg-secondary/5 p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
        <h3 className="mt-5 text-xl font-bold text-ink sm:text-2xl">Tu solicitud está registrada.</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Te avisaremos de próximos encuentros, recursos útiles y novedades de la comunidad. El alta es gratuita y no te suscribe automáticamente al newsletter comercial.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="community-name">Nombre y apellido *</label>
          <input id="community-name" required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Tu nombre" />
        </div>
        <div>
          <label className={labelClass} htmlFor="community-email">Email *</label>
          <input id="community-email" type="email" required className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="tu@email.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="community-whatsapp">WhatsApp</label>
          <input id="community-whatsapp" className={inputClass} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+595 …" />
        </div>
        <div>
          <label className={labelClass} htmlFor="community-nationality">Nacionalidad</label>
          <input id="community-nationality" className={inputClass} value={form.nationality} onChange={(e) => set('nationality', e.target.value)} placeholder="España, Alemania, Brasil…" />
        </div>
        <div>
          <label className={labelClass} htmlFor="community-stage">¿En qué momento estás? *</label>
          <select id="community-stage" className={inputClass} value={form.stage} onChange={(e) => set('stage', e.target.value as CommunityForm['stage'])}>
            {STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="community-city">Ciudad de interés o residencia</label>
          <input id="community-city" className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Asunción, Encarnación…" />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>¿Qué te interesa resolver?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {INTERESTS.map((interest) => (
              <label key={interest.value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors ${form.interests.includes(interest.value) ? 'border-primary bg-primary/5 text-ink' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                <input type="checkbox" className="mr-2 accent-current" checked={form.interests.includes(interest.value)} onChange={() => toggleInterest(interest.value)} />
                {interest.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="community-notes">Cuéntanos brevemente qué necesitas</label>
          <textarea id="community-notes" rows={4} className={inputClass} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Por ejemplo: llego con mi familia en octubre y necesito vivienda, colegio y residencia…" />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="community-website">Website</label>
          <input id="community-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </div>

        <label className="sm:col-span-2 flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-primary" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
          <span>Acepto que Living Paraguay trate estos datos para gestionar mi alta y contactarme sobre la comunidad. Este consentimiento no incluye el newsletter comercial.</span>
        </label>
      </div>

      {fieldError && <p className="mt-4 text-sm text-destructive">{fieldError}</p>}
      <button type="submit" disabled={submitting} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 sm:w-auto">
        {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
        Unirme gratis
      </button>
    </form>
  );
};
