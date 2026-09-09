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
  const [description, setDescription] = useState(provider?.description ?? '');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!user || !consent || busy) return;
    setBusy(true); setNotice('');
    const payload = { user_id: user.id, display_name: name.trim(), city: city.trim(), languages: [...new Set(languages.split(',').map(s => s.trim()).filter(Boolean))], description: description.trim(), status: 'pending' as const };
    try {
      const result = provider ? await marketplace.from('marketplace_providers').update(payload).eq('id', provider.id).select().single() : await marketplace.from('marketplace_providers').insert(payload).select().single();
      if (result.error) throw result.error;
      setNotice('Perfil enviado a revisión. El alta es gratuita.'); onSaved();
    } catch (error) { setNotice(marketplaceError(error)); } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-5 rounded-2xl border border-border p-6"><h2 className="text-2xl font-bold">Tu perfil profesional</h2><p>Estos datos serán públicos cuando se apruebe el perfil. No incluyas documentos de identidad ni información privada.</p><Field label="Nombre profesional o empresa" name="provider-name" value={name} onChange={setName} required minLength={2} maxLength={160}/><Field label="Ciudad de atención" name="provider-city" value={city} onChange={setCity} required minLength={2} maxLength={100}/><Field label="Idiomas de atención, separados por comas" name="provider-languages" value={languages} onChange={setLanguages} required maxLength={300}/><Field label="Experiencia y presentación" name="provider-description" area value={description} onChange={setDescription} required minLength={20} maxLength={2000}/><label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Autorizo la revisión y publicación de este perfil profesional. Entiendo que el alta es gratuita y que las comisiones se mostrarán antes de cada presupuesto.</span></label><p className="text-sm text-muted-foreground">Los cambios en un perfil aprobado vuelven a revisión y ocultan temporalmente sus servicios.</p><Button disabled={busy} type="submit">{busy ? 'Guardando…' : 'Enviar perfil a revisión'}</Button>{notice && <Notice>{notice}</Notice>}</form>;
}
