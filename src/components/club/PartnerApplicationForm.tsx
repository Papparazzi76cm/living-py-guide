import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import {
  ALL_PARTNER_CATEGORIES,
  canBlockExclusivity,
  formatMembershipPrice,
  getMembershipTierConfig,
  REQUIRED_EXCLUSIVITY_LANGUAGES,
  REQUIRED_TIER_A_LANGUAGES,
} from '@/data/membershipCatalog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  name: z.string().trim().min(2, 'Indica tu nombre').max(100),
  company: z.string().trim().min(2, 'Indica tu empresa o estudio').max(160),
  email: z.string().trim().email('Introduce un email válido').max(254).transform((value) => value.toLowerCase()),
  whatsapp: z.string().trim().min(6, 'Indica un WhatsApp válido').max(40),
  city: z.string().trim().min(2, 'Indica tu ciudad').max(100),
  category: z.string().trim().min(2, 'Selecciona una categoría').max(100),
  website: z.string().trim().max(300).optional(),
  description: z.string().trim().min(20, 'Describe tu servicio con al menos 20 caracteres').max(2000),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  languages: z.string().trim().min(2, 'Indica al menos un idioma').max(300),
  exclusivityInterest: z.enum(['si', 'no']),
  consent: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu consentimiento para guardar la postulación' }) }),
});

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
  consent: boolean;
  confirmationWebsite: string;
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
  consent: false,
  confirmationWebsite: '',
};

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring';
const labelClass = 'mb-1.5 block text-sm font-medium text-ink';

const normalizeLanguageText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const LANGUAGE_ALIASES: Record<string, string[]> = {
  Español: ['espanol', 'castellano', 'spanish'],
  Inglés: ['ingles', 'english'],
  Alemán: ['aleman', 'german', 'deutsch'],
  Portugués: ['portugues', 'portuguese'],
};

const getMissingLanguages = (value: string, required: readonly string[]) => {
  const normalized = normalizeLanguageText(value);
  return required.filter((language) =>
    !(LANGUAGE_ALIASES[language] ?? [normalizeLanguageText(language)]).some((alias) => normalized.includes(alias))
  );
};

interface Props { defaultCategory?: string; }

export const PartnerApplicationForm = ({ defaultCategory = '' }: Props) => {
  const [form, setForm] = useState<PartnerApplication>({ ...EMPTY, category: defaultCategory });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const selectedCategory = ALL_PARTNER_CATEGORIES.find((item) => item.slug === form.category);
  const selectedTier = selectedCategory ? getMembershipTierConfig(selectedCategory) : null;
  const exclusivityAllowed = selectedCategory ? canBlockExclusivity(selectedCategory) : true;

  const set = <K extends keyof PartnerApplication>(key: K, value: PartnerApplication[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCategoryChange = (category: string) => {
    const next = ALL_PARTNER_CATEGORIES.find((item) => item.slug === category);
    setForm((current) => ({
      ...current,
      category,
      exclusivityInterest: next && !canBlockExclusivity(next) ? 'no' : current.exclusivityInterest,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldError('');

    if (form.confirmationWebsite) {
      setSubmitted(true);
      return;
    }

    const parsed = schema.safeParse({ ...form, consent: form.consent });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Revisa los datos del formulario';
      setFieldError(message);
      toast({ title: 'Revisa la postulación', description: message, variant: 'destructive' });
      return;
    }

    const category = ALL_PARTNER_CATEGORIES.find((item) => item.slug === parsed.data.category);
    if (!category) {
      const message = 'La categoría seleccionada no es válida';
      setFieldError(message);
      toast({ title: 'Revisa la postulación', description: message, variant: 'destructive' });
      return;
    }

    const tier = getMembershipTierConfig(category);
    if (tier.tier === 'A') {
      const missing = getMissingLanguages(parsed.data.languages, REQUIRED_TIER_A_LANGUAGES);
      if (missing.length) {
        const message = `Las empresas de Categoría A deben poder atender, como mínimo, en español e inglés. Falta indicar: ${missing.join(', ')}.`;
        setFieldError(message);
        toast({ title: 'Requisito de idiomas no cumplido', description: message, variant: 'destructive' });
        return;
      }
    }

    if (parsed.data.exclusivityInterest === 'si') {
      if (!canBlockExclusivity(category)) {
        const message = 'La Categoría D es abierta, gratuita y no admite bloqueo por exclusividad.';
        setFieldError(message);
        toast({ title: 'Exclusividad no disponible', description: message, variant: 'destructive' });
        return;
      }

      const missing = getMissingLanguages(parsed.data.languages, REQUIRED_EXCLUSIVITY_LANGUAGES);
      if (missing.length) {
        const message = `Para solicitar exclusividad debes poder atender, como mínimo, en español, inglés, alemán y portugués. Falta indicar: ${missing.join(', ')}.`;
        setFieldError(message);
        toast({ title: 'Requisito de idiomas no cumplido', description: message, variant: 'destructive' });
        return;
      }
    }

    setSubmitting(true);
    const { error } = await supabase.from('partner_applications').insert([{
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      city: parsed.data.city,
      category_slug: category.slug,
      category_name: category.name,
      website: parsed.data.website || null,
      description: parsed.data.description,
      years_experience: parsed.data.yearsExperience,
      languages: parsed.data.languages,
      exclusivity_interest: parsed.data.exclusivityInterest === 'si',
      consent_privacy: true,
      source: 'partner_page',
    }]);
    setSubmitting(false);

    if (error) {
      const duplicate = error.code === '23505';
      toast({
        title: duplicate ? 'Ya tenemos una postulación en esta categoría' : 'No hemos podido guardar la postulación',
        description: duplicate
          ? 'Ese email ya tiene una candidatura para este rubro. Si necesitas modificarla, contacta con Living Paraguay.'
          : 'Inténtalo de nuevo en unos minutos.',
        variant: duplicate ? 'default' : 'destructive',
      });
      if (duplicate) setSubmitted(true);
      return;
    }

    setSubmitted(true);
    setForm({ ...EMPTY, category: defaultCategory });
    toast({ title: 'Postulación recibida', description: 'Revisaremos tu perfil antes de confirmar una plaza del Business Club.' });
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-secondary/25 bg-secondary/5 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
        <h3 className="mt-5 text-xl font-bold text-ink sm:text-2xl">Postulación registrada.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Revisaremos experiencia, referencias, capacidad de atención a expatriados y disponibilidad real de la categoría antes de confirmar la admisión. No se realiza ningún pago en esta fase.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass} htmlFor="name">Nombre y apellido *</label><input id="name" required className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="María González" /></div>
        <div><label className={labelClass} htmlFor="company">Empresa o estudio *</label><input id="company" required className={inputClass} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="González & Asociados" /></div>
        <div><label className={labelClass} htmlFor="email">Email *</label><input id="email" type="email" required className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="maria@estudio.com.py" /></div>
        <div><label className={labelClass} htmlFor="whatsapp">WhatsApp *</label><input id="whatsapp" required className={inputClass} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+595 9xx xxx xxx" /></div>
        <div><label className={labelClass} htmlFor="city">Ciudad *</label><input id="city" required className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Asunción" /></div>
        <div>
          <label className={labelClass} htmlFor="category">Categoría profesional *</label>
          <select id="category" required className={inputClass} value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {ALL_PARTNER_CATEGORIES.map((category) => {
              const tier = getMembershipTierConfig(category);
              return (
                <option key={category.slug} value={category.slug}>
                  {category.name} — Categoría {tier.tier} · {tier.priceUsd === 0 ? 'sin cuota' : `USD ${tier.priceUsd.toLocaleString('en-US')}/año`}
                </option>
              );
            })}
          </select>
          <p className="mt-1.5 text-xs text-muted-foreground">La categoría de membresía se determina por el ticket medio y la capacidad estimada de generación de ingresos.</p>
        </div>

        {selectedCategory && selectedTier && (
          <div className="sm:col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-ink">Categoría {selectedTier.tier} · {formatMembershipPrice(selectedCategory)}</strong>
              <span className="text-xs font-medium text-muted-foreground">{selectedTier.ticketProfile}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selectedTier.description}</p>
            {selectedTier.tier === 'A' && (
              <p className="mt-2 text-xs font-semibold text-primary">Requisito indispensable: atención al cliente en español e inglés.</p>
            )}
          </div>
        )}

        <div><label className={labelClass} htmlFor="website">Web o redes</label><input id="website" className={inputClass} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https:// o @usuario" /></div>
        <div><label className={labelClass} htmlFor="years">Años de experiencia *</label><input id="years" type="number" min="0" max="80" required className={inputClass} value={form.yearsExperience} onChange={(e) => set('yearsExperience', e.target.value)} placeholder="8" /></div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="languages">Idiomas de atención *</label>
          <input id="languages" required className={inputClass} value={form.languages} onChange={(e) => set('languages', e.target.value)} placeholder="Español, inglés, alemán, portugués…" />
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Categoría A: español + inglés obligatorios. Para bloquear una categoría por exclusividad: español + inglés + alemán + portugués obligatorios.
          </p>
        </div>
        <div className="sm:col-span-2"><label className={labelClass} htmlFor="description">Descripción breve de tu servicio *</label><textarea id="description" required rows={4} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Qué resuelves para un extranjero que llega a Paraguay y qué experiencia tienes en ese tipo de cliente." /></div>

        {selectedCategory && !exclusivityAllowed ? (
          <div className="sm:col-span-2 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <strong className="text-ink">Categoría D abierta.</strong> No tiene cuota de membresía, no tiene límite de plazas y no admite bloqueo por exclusividad.
          </div>
        ) : (
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>¿Te interesa la exclusividad de categoría (USD 5.000/año adicionales)?</legend>
            <div className="mt-2 flex gap-3">
              {(['si', 'no'] as const).map((value) => (
                <label key={value} className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${form.exclusivityInterest === value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:bg-muted'}`}>
                  <input type="radio" name="exclusivity" className="sr-only" checked={form.exclusivityInterest === value} onChange={() => set('exclusivityInterest', value)} />
                  {value === 'si' ? 'Sí, me interesa' : 'No por ahora'}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">La exclusividad solo puede aprobarse si la empresa acredita atención, como mínimo, en español, inglés, alemán y portugués.</p>
          </fieldset>
        )}

        <div className="hidden" aria-hidden="true">
          <label htmlFor="partner-confirmation-website">Website confirmation</label>
          <input id="partner-confirmation-website" tabIndex={-1} autoComplete="off" value={form.confirmationWebsite} onChange={(e) => set('confirmationWebsite', e.target.value)} />
        </div>

        <label className="sm:col-span-2 flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-primary" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
          <span>Acepto que Living Paraguay trate estos datos para evaluar mi candidatura, verificar mi perfil y contactarme sobre la membresía del Business Club.</span>
        </label>
      </div>

      {fieldError && <p className="mt-4 text-sm text-destructive">{fieldError}</p>}
      <button type="submit" disabled={submitting} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 sm:w-auto">
        {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
        Enviar postulación
      </button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Sin pago en esta etapa. La membresía solo se formaliza después de la revisión y aceptación de la candidatura.</p>
    </form>
  );
};
