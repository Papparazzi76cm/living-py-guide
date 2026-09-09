import { useSearchParams } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '@/data/marketplace';
import { useState } from 'react';
import { AnimatedDiv } from '../AnimatedDiv';
import { Icon } from '../Icon';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT_INFO } from '../../constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ACTIVE_MARKET } from '@/config/network';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es requerido').max(100, 'El nombre debe tener menos de 100 caracteres'),
  email: z.string().trim().email('Email inválido').max(254, 'El email debe tener menos de 255 caracteres').transform((value) => value.toLowerCase()),
  subject: z.string().trim().min(2, 'El asunto es requerido').max(200, 'El asunto debe tener menos de 200 caracteres'),
  message: z.string().trim().min(10, 'El mensaje debe tener al menos 10 caracteres').max(2000, 'El mensaje debe tener menos de 2000 caracteres'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu consentimiento para guardar la consulta' }) }),
});

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string;
};

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
};

export const ContactSection = () => {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>(() => ({ ...EMPTY_FORM, subject: params.get('profesional') === '1' ? 'Solicitud de alta gratuita como profesional' : (SERVICE_CATEGORIES.find(c => c.slug === params.get('servicio'))?.name ?? '') }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.website) {
      setFormData(EMPTY_FORM);
      toast({ title: t.contact.formSuccess, description: t.contact.subtitle });
      return;
    }

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      toast({
        title: 'Error de validación',
        description: parsed.error.issues[0]?.message ?? 'Por favor, corrige los errores en el formulario',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('contact_inquiries').insert([{
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      consent_privacy: true,
      source: 'contact_page',
      market_slug: ACTIVE_MARKET.slug,
      market_name: ACTIVE_MARKET.brandName,
      country_code: ACTIVE_MARKET.countryCode,
      network_brand_slug: 'lbc',
    }]);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'No hemos podido enviar tu consulta',
        description: 'Inténtalo de nuevo en unos minutos o contáctanos por WhatsApp.',
        variant: 'destructive',
      });
      return;
    }

    setFormData(EMPTY_FORM);
    toast({
      title: t.contact.formSuccess,
      description: t.contact.subtitle,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatedDiv className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t.contact.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </AnimatedDiv>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <AnimatedDiv delay={100}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">{t.contact.formTitle}</h3>
              <div className="space-y-5">
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary">
                    <Icon name="mail" size={24} className="text-primary transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t.contact.email}</h4>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">{CONTACT_INFO.email}</p>
                  </div>
                </a>

                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary">
                    <Icon name="phone" size={24} className="text-primary transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t.contact.phone}</h4>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">{CONTACT_INFO.phone}</p>
                  </div>
                </a>

                <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary">
                    <Icon name="chat" size={24} className="text-primary transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{t.contact.whatsapp}</h4>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">{CONTACT_INFO.whatsapp}</p>
                  </div>
                </a>
              </div>
            </div>
          </AnimatedDiv>

          <AnimatedDiv delay={200}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h3 className="text-2xl font-bold mb-6">{t.contact.formTitle}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input name="name" type="text" placeholder={t.contact.formName} value={formData.name} onChange={handleChange} className={errors.name ? 'border-destructive' : ''} required />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Input name="email" type="email" placeholder={t.contact.formEmail} value={formData.email} onChange={handleChange} className={errors.email ? 'border-destructive' : ''} required />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <Input name="subject" type="text" placeholder={t.contact.formSubject} value={formData.subject} onChange={handleChange} className={errors.subject ? 'border-destructive' : ''} required />
                  {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <Textarea name="message" placeholder={t.contact.formMessage} rows={5} value={formData.message} onChange={handleChange} className={errors.message ? 'border-destructive' : ''} required />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <Input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                </div>

                <label className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-primary" checked={formData.consent} onChange={(e) => setFormData((current) => ({ ...current, consent: e.target.checked }))} />
                  <span>Acepto que {ACTIVE_MARKET.brandName} trate estos datos para responder a mi consulta.</span>
                </label>
                {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full py-3">
                  {isSubmitting ? t.contact.formSubmitting : t.contact.formSubmit}
                </Button>
              </form>
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
};
