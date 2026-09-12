import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Field, Notice } from '@/components/marketplace/Fields';

const SAFE_NEXT = /^\/(?:mi-cuenta|ofrecer-servicios|oferta\/[a-f0-9-]{36}|pedido\/[a-f0-9-]{36})$/;

export default function MarketplaceLoginPage() {
  const { user, isLoading } = useAuth();
  const [params] = useSearchParams();
  const requested = params.get('next') ?? '/mi-cuenta';
  const next = SAFE_NEXT.test(requested) ? requested : '/mi-cuenta';
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  if (isLoading) return <Layout title="Acceso" description="Accede a tu cuenta"><section className="container mx-auto px-5 py-16"><Notice>Cargando tu sesión…</Notice></section></Layout>;
  if (user) return <Navigate to={next} replace />;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setNotice('');
    try {
      const result = register
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: `${window.location.origin}/acceso?next=${encodeURIComponent(next)}` },
          })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        setNotice(register
          ? 'No hemos podido crear la cuenta. Revisa el correo y la contraseña o prueba a iniciar sesión.'
          : 'No hemos podido iniciar sesión. Revisa tus datos y confirma tu correo si acabas de registrarte.');
        return;
      }
      if (register && !result.data.session) setNotice('Revisa tu correo para confirmar la cuenta. Después volverás al punto donde estabas.');
    } catch {
      setNotice('No se ha podido conectar. Inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout title="Tu cuenta en Living Paraguay" description="Solicita servicios, gestiona pedidos o publica tu oferta profesional.">
      <section className="bg-gradient-sand py-12 sm:py-20">
        <div className="mx-auto max-w-lg px-5">
          <div className="rounded-[2rem] border border-white bg-white/90 p-7 shadow-xl sm:p-9">
            <p className="premium-kicker text-primary">Living Paraguay</p>
            <h1 className="premium-display mt-4 text-3xl text-ink sm:text-4xl">{register ? 'Crea tu cuenta gratuita' : 'Bienvenido de nuevo'}</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Una sola cuenta para contratar servicios, seguir tus expedientes o vender como profesional.</p>
            <form onSubmit={submit} className="mt-7 space-y-5">
              <Field label="Correo electrónico" name="email" type="email" required maxLength={254} value={email} onChange={setEmail} />
              <Field label="Contraseña" name="password" type="password" required minLength={register ? 10 : 1} maxLength={128} value={password} onChange={setPassword} />
              <Button disabled={busy} type="submit" className="w-full">{busy ? 'Un momento…' : register ? 'Crear cuenta' : 'Iniciar sesión'}</Button>
            </form>
            {notice && <div className="mt-5"><Notice>{notice}</Notice></div>}
            <Button className="mt-4 w-full" variant="outline" onClick={() => { setRegister(!register); setNotice(''); }}>{register ? 'Ya tengo cuenta' : 'Crear una cuenta gratuita'}</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
