import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().trim().email('Email inválido').max(255, 'El email debe tener menos de 255 caracteres').toLowerCase(),
});

export const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const validatedData = emailSchema.parse({ email });
      setIsLoading(true);

      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: validatedData.email, source: 'website' }]);

      if (dbError) {
        if (dbError.code === '23505') {
          toast({
            title: t.newsletter.errorTitle || 'Error',
            description: t.newsletter.errorExists || 'Este email ya está suscrito',
            variant: 'destructive',
          });
        } else {
          throw dbError;
        }
      } else {
        toast({
          title: t.newsletter.successTitle || '¡Suscripción exitosa!',
          description: t.newsletter.successMessage || 'Gracias por suscribirte a nuestro newsletter',
        });
        setEmail('');
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || 'Email inválido';
        setError(errorMessage);
        toast({
          title: t.newsletter.errorTitle || 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        console.error('Newsletter subscription error:', err);
        toast({
          title: t.newsletter.errorTitle || 'Error',
          description: t.newsletter.errorGeneric || 'Hubo un error al procesar tu suscripción',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary">Newsletter</p>
      <h4 className="mt-3 text-xl font-bold !text-white">
        {t.newsletter.title || 'Actualizaciones sin ruido'}
      </h4>
      <p className="mb-5 mt-2 text-sm leading-6 text-white/55">
        {t.newsletter.description || 'Cambios importantes, guías nuevas y agenda útil sobre Paraguay.'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={17} />
          <Input
            type="email"
            placeholder={t.newsletter.placeholder || 'tu@email.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 rounded-2xl border-white/10 bg-white/[0.06] pl-11 text-white shadow-none placeholder:text-white/28 focus-visible:ring-primary ${error ? 'border-destructive' : ''}`}
            disabled={isLoading}
          />
          {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
        </div>
        <Button
          type="submit"
          className="group h-12 w-full rounded-2xl bg-white font-extrabold text-ink shadow-none transition-all hover:-translate-y-0.5 hover:bg-white/90"
          disabled={isLoading}
        >
          {isLoading
            ? (t.newsletter.subscribing || 'Suscribiendo...')
            : (t.newsletter.subscribe || 'Suscribirme')}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </Button>
      </form>
    </div>
  );
};
