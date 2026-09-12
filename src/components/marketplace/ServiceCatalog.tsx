import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BadgeCheck, MapPin, Search } from 'lucide-react';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Notice } from './Fields';
import { money } from './format';

export function ServiceCatalog({ category }: { category?: string }) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('all');
  const [language, setLanguage] = useState('all');

  const catalog = useQuery({
    queryKey: ['marketplace', 'catalog', category],
    queryFn: async () => {
      let query = marketplace.from('marketplace_services').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (category) query = query.eq('category_slug', category);
      const [services, providers] = await Promise.all([
        query,
        marketplace.from('marketplace_providers').select('*').eq('status', 'approved'),
      ]);
      if (services.error) throw services.error;
      if (providers.error) throw providers.error;
      const byId = new Map(providers.data.map((provider) => [provider.id, provider]));
      return services.data.flatMap((service) => {
        const provider = byId.get(service.provider_id);
        return provider ? [{ ...service, provider }] : [];
      });
    },
  });

  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const cities = [...new Set(catalog.data?.map((service) => service.provider.city) ?? [])].sort();
  const languages = [...new Set(catalog.data?.flatMap((service) => service.provider.languages) ?? [])].sort();
  const results = catalog.data?.filter((service) =>
    (city === 'all' || service.provider.city === city)
    && (language === 'all' || service.provider.languages.includes(language))
    && normalize(`${service.title} ${service.description} ${service.provider.display_name}`).includes(normalize(search)),
  ) ?? [];

  const priceLabel = (service: NonNullable<typeof catalog.data>[number]) => {
    if (service.price === null || service.price_type === 'quote') return 'Presupuesto personalizado';
    const formatted = money(service.price, service.currency);
    return service.price_type === 'from' ? `Desde ${formatted}` : formatted;
  };

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="premium-kicker text-primary">Catálogo</p><h2 className="premium-display mt-3 text-3xl text-ink sm:text-4xl">Servicios disponibles</h2></div>
        <p className="text-sm text-muted-foreground">{results.length} {results.length === 1 ? 'servicio' : 'servicios'}</p>
      </div>

      <div className="premium-panel grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
        <div><label htmlFor="offer-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-ink/50">Buscar</label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" /><Input className="pl-9" id="offer-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Servicio o profesional" /></div></div>
        <div><label htmlFor="offer-city" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-ink/50">Ciudad</label><Select value={city} onValueChange={setCity}><SelectTrigger id="offer-city"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todas las ciudades</SelectItem>{cities.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
        <div><label htmlFor="offer-language" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-ink/50">Idioma</label><Select value={language} onValueChange={setLanguage}><SelectTrigger id="offer-language"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los idiomas</SelectItem>{languages.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
      </div>

      {catalog.isPending ? <Notice>Cargando servicios…</Notice> : catalog.error ? <Notice>{marketplaceError(catalog.error)} <Link className="underline" to="/contact">Contactar</Link></Notice> : results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((service) => (
            <Link key={service.id} to={`/oferta/${service.id}`} className="premium-card group flex min-h-[330px] flex-col rounded-[1.7rem] border border-border/70 bg-card p-6">
              <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary"><BadgeCheck className="h-4 w-4" /> Verificado</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {service.provider.city}</span></div>
              <h3 className="mt-7 text-xl font-bold text-ink">{service.title}</h3>
              <p className="mt-2 text-sm font-semibold text-ink/70">{service.provider.display_name}</p>
              <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
              <div className="mt-6 border-t border-border pt-5"><p className="font-bold text-ink">{priceLabel(service)}</p><div className="mt-3 flex items-center justify-between"><span className="text-xs text-muted-foreground">{service.delivery_mode === 'online' ? 'Online' : service.delivery_mode === 'onsite' ? 'Presencial' : 'Online o presencial'}</span><span className="inline-flex items-center gap-1 text-sm font-bold text-primary">Ver servicio <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></div></div>
            </Link>
          ))}
        </div>
      ) : (
        <Notice>{catalog.data?.length ? 'No hay servicios que coincidan con estos filtros.' : 'Estamos incorporando profesionales. Todavía no hay servicios publicados aquí.'} <Link to={category ? `/contact?servicio=${encodeURIComponent(category)}` : '/contact'} className="underline">Cuéntanos qué necesitas</Link>.</Notice>
      )}
    </section>
  );
}
