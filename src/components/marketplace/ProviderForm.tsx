import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import type { Provider } from '@/types/marketplace';
import { Field, Notice } from './Fields';
import { Button } from '@/components/ui/button';

export function ProviderForm({ provider, onSaved }: { provider: Provider | null; onSaved: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(provider?.display_name ?? '');
  const [city, setCity] = useState(provider?.city ?? '');
  const [languages, setLanguages] = useState(provider?.languages.join(', ') ?? 'Español');
  const [website, setWebsite] = useState(provider?.website ?? '');
  const [description, setDescription] = useState(provider?.description ?? '');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !consent || busy) return;
    setBusy(true); setNotice('');
    const languageList = [...new Set(languages.split(',').map((item) => item.trim()).filter(Boolean))];
    const payload = {
      user_id: user.id,
      display_name: name.trim(),
      city: city.trim(),
      languages: languageList,
      website: website.trim() || null,
      description: description.trim(),
      status: 'pending' as const,
    };
    try {
      const result = provider
        ? await marketplace.from('marketplace_providers').update(payload).eq('id', provider.id).select().single()
        : await marketplace.from('marketplace_providers').insert(payload).select().single();
      if (result.error) throw result.error;
      setNotice('Perfil enviado a revisión. El alta es gratuita.');
      onSaved();
    } catch (error) {
      setNotice(marketplaceError(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div><h2 className="text-2xl font-bold text-ink">Tu perfil profesional</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Publica solo información comercial. La conversación con clientes, la verificación y los datos necesarios para cobros se gestionan por canales privados del marketplace.</p></div>
      <Field label="Nombre profesional o empresa" name="provider-name" value={name} onChange={setName} required minLength={2} maxLength={160} />
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Ciudad de atención" name="provider-city" value={city} onChange={setCity} required minLength={2} maxLength={100} /><Field label="Idiomas, separados por comas" name="provider-languages" value={languages} onChange={setLanguages} required maxLength={300} /></div>
      <Field label="Web profesional (opcional)" name="provider-website" type="url" value={website} onChange={setWebsite} maxLength={500} placeholder="https://…" />
      <Field label="Experiencia, especialización y cómo trabajas" name="provider-description" area value={description} onChange={setDescription} required minLength={40} maxLength={2000} />
      <label className="flex items-start gap-3 text-sm leading-6"><input className="mt-1" type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>Autorizo la revisión y publicación de este perfil profesional. Entiendo que el alta es gratuita y que Living Paraguay aplica una comisión únicamente sobre operaciones generadas en la plataforma.</span></label>
      <p className="text-xs leading-5 text-muted-foreground">Los cambios relevantes en un perfil aprobado vuelven a revisión y ocultan temporalmente sus servicios para mantener la confianza del marketplace.</p>
      <Button disabled={busy} type="submit">{busy ? 'Guardando…' : 'Enviar perfil a revisión'}</Button>
      {notice && <Notice>{notice}</Notice>}
    </form>
  );
}
