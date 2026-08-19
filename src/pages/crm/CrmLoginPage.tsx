import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLockup } from '@/components/brand/BrandLockup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const CrmLoginPage = () => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) return <Navigate to="/crm" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const result = mode === 'signin' ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setSubmitting(false);

    if (result.error) {
      toast({
        title: mode === 'signin' ? 'No hemos podido iniciar sesión' : 'No hemos podido crear el acceso',
        description: result.error.message,
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'signup') {
      toast({
        title: 'Acceso creado',
        description: 'Revisa tu email si Supabase requiere confirmación. Usa el mismo email con el que tu empresa fue admitida como partner.',
      });
      setMode('signin');
      return;
    }

    navigate('/crm', { replace: true });
  };

  return (
    <main className="min-h-screen bg-gradient-ink px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="text-white">
            <BrandLockup variant="network" inverted />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-primary">Partner CRM</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Cada lead, cada respuesta y cada negocio cerrado, medido.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              El CRM privado de Living Business Club conecta las derivaciones de la comunidad con los partners de cada delegación, controla tiempos de respuesta, tareas, conversión y retorno real de la membresía.
            </p>
            <div className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>El acceso está segmentado por delegación y empresa. Cada partner solo puede consultar los leads y datos que le han sido asignados.</p>
            </div>
          </section>

          <Card className="border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle>{mode === 'signin' ? 'Entrar al CRM' : 'Crear acceso de partner'}</CardTitle>
              <CardDescription>
                {mode === 'signin'
                  ? 'Usa las credenciales vinculadas a tu empresa o delegación.'
                  : 'Regístrate con el mismo email usado en la candidatura aprobada.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="crm-email">Email</Label>
                  <Input id="crm-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="partner@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm-password">Contraseña</Label>
                  <Input id="crm-password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'signin' ? 'Entrar al CRM' : 'Crear acceso'}
                </Button>
              </form>

              <button
                type="button"
                className="mt-5 w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setMode((current) => current === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? '¿Es tu primer acceso? Crear cuenta' : 'Ya tengo cuenta · Iniciar sesión'}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CrmLoginPage;
