import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Field, Notice } from '@/components/marketplace/Fields';

export default function MarketplaceLoginPage() {
  const { user, isLoading } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('next') ?? '/mi-cuenta';
  const next = /^\/(?:mi-cuenta|oferta\/[a-f0-9-]+)$/.test(requested) ? requested : '/mi-cuenta';
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  if (isLoading) return <Layout title="Acceso" description="Accede a tu cuenta"><Notice>Cargando tu sesión…</Notice></Layout>;
  if (user) return <Navigate to={next} replace />;
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setNotice('');
    try {
      const result = register
        ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${window.location.origin}/acceso?next=${encodeURIComponent(next)}` } })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) { setNotice(register ? 'No hemos podido crear la cuenta. Revisa el correo y la contraseña o prueba a iniciar sesión.' : 'No hemos podido iniciar sesión. Revisa tus datos y confirma tu correo si acabas de registrarte.'); return; }
      if (register && !result.data.session) setNotice('Revisa tu correo para confirmar la cuenta. Si ya tienes una cuenta, inicia sesión.');
    } catch { setNotice('No se ha podido conectar. Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  return <Layout title="Tu cuenta en Living Paraguay" description="Solicita servicios y gestiona tus propuestas."><section className="mx-auto max-w-lg space-y-6 px-4 py-12"><h1 className="text-3xl font-bold">{register ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}</h1><p>Utiliza tu cuenta para solicitar servicios o publicar tu perfil profesional.</p><form onSubmit={submit} className="space-y-5"><Field label="Correo electrónico" name="email" type="email" required maxLength={254} value={email} onChange={setEmail}/><Field label="Contraseña" name="password" type="password" required minLength={register ? 10 : 1} maxLength={128} value={password} onChange={setPassword}/><Button disabled={busy} type="submit" className="w-full">{busy ? 'Un momento…' : register ? 'Crear cuenta' : 'Iniciar sesión'}</Button></form>{notice && <Notice>{notice}</Notice>}<Button variant="outline" onClick={() => { setRegister(!register); setNotice(''); }}>{register ? 'Ya tengo cuenta' : 'Crear una cuenta gratuita'}</Button></section></Layout>;
}
