import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, Banknote, Store, Users } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { ProviderForm } from '@/components/marketplace/ProviderForm';
import { Notice } from '@/components/marketplace/Fields';

export default function ProviderApplyPage() {
  const { user } = useAuth();
  const profile = useQuery({
    queryKey: ['marketplace', 'provider-onboarding', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const result = await marketplace.from('marketplace_providers').select('*').eq('user_id', user!.id).maybeSingle();
      if (result.error) throw result.error;
      return result.data;
    },
  });

  return (
    <Layout title="Ofrecer servicios" description="Publica servicios para expatriados en Living Paraguay sin cuotas fijas y paga comisión solo cuando generas negocio." noHeaderPadding>
      <section className="premium-hero relative overflow-hidden pb-18 pt-32 sm:pb-24 sm:pt-40">
        <div className="premium-hero-noise" aria-hidden />
        <div className="container relative z-10 mx-auto grid gap-10 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="premium-kicker text-primary">Para profesionales y empresas</p>
            <h1 className="premium-display mt-5 text-[clamp(3rem,6vw,6rem)] !text-white">Vende servicios a expatriados <span className="premium-serif text-white/90">sin pagar por entrar.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">Crea tu perfil, publica servicios concretos y recibe solicitudes de clientes. Living Paraguay monetiza la operación, no el acceso al escaparate.</p>
          </div>
          <div className="premium-glass rounded-[2rem] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Banknote, '0 cuota fija', 'Sin membresía mensual ni anual.'],
                [Store, 'Escaparate propio', 'Servicios, precio orientativo y condiciones.'],
                [Users, 'Demanda cualificada', 'Solicitudes de personas que necesitan resolver algo.'],
                [BadgeCheck, 'Confianza', 'Verificación y reseñas vinculadas a operaciones reales.'],
              ].map(([Icon, title, text]) => {
                const IconCmp = Icon as typeof Banknote;
                return <div key={title as string} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"><IconCmp className="h-5 w-5 text-primary" /><p className="mt-4 font-bold text-white">{title as string}</p><p className="mt-1 text-xs leading-5 text-white/45">{text as string}</p></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-sand py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          {!user ? (
            <div className="rounded-[2rem] border border-white bg-white/85 p-7 shadow-xl sm:p-10">
              <p className="premium-kicker text-primary">Alta gratuita</p>
              <h2 className="premium-display mt-4 text-3xl text-ink sm:text-4xl">Primero crea tu cuenta.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Necesitamos una cuenta para vincular tu perfil, tus servicios, tus solicitudes y, más adelante, tus cobros.</p>
              <Link to="/acceso?next=%2Fofrecer-servicios" className="premium-button mt-7">Crear cuenta o acceder <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : profile.isPending ? <Notice>Cargando tu perfil…</Notice> : profile.error ? <Notice>{marketplaceError(profile.error)}</Notice> : (
            <div className="space-y-8">
              <div>
                <p className="premium-kicker text-primary">Tu perfil profesional</p>
                <h2 className="premium-display mt-4 text-3xl text-ink sm:text-4xl">{profile.data ? 'Actualiza tus datos' : 'Solicita la verificación'}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">La publicación requiere revisión. No hay plazas artificiales ni categorías bloqueadas por membresía.</p>
              </div>
              <div className="rounded-[2rem] border border-white bg-white/85 p-6 shadow-xl sm:p-9"><ProviderForm provider={profile.data ?? null} onSaved={() => void profile.refetch()} /></div>
              {profile.data && <Link to="/mi-cuenta" className="premium-button-ghost">Gestionar mis servicios <ArrowRight className="h-4 w-4" /></Link>}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
