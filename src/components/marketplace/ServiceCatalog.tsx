import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { marketplace, marketplaceError } from '@/integrations/supabase/marketplace';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Notice } from './Fields';
import { money } from './format';

export function ServiceCatalog({ category }: { category?: string }) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('all');
  const [language, setLanguage] = useState('all');
  const catalog = useQuery({ queryKey: ['marketplace', 'catalog', category], queryFn: async () => {
    let query = marketplace.from('marketplace_services').select('*').eq('status','published').order('created_at', { ascending: false });
    if (category) query = query.eq('category_slug', category);
    const [services, providers] = await Promise.all([query, marketplace.from('marketplace_providers').select('*').eq('status','approved')]);
    if (services.error) throw services.error; if (providers.error) throw providers.error;
    const byId = new Map(providers.data.map(p => [p.id,p]));
    return services.data.flatMap(s => { const provider = byId.get(s.provider_id); return provider ? [{ ...s, provider }] : []; });
  }});
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const cities = [...new Set(catalog.data?.map(s => s.provider.city) ?? [])].sort();
  const languages = [...new Set(catalog.data?.flatMap(s => s.provider.languages) ?? [])].sort();
  const results = catalog.data?.filter(s => (city === 'all' || s.provider.city === city) && (language === 'all' || s.provider.languages.includes(language)) && normalize(s.title+' '+s.description+' '+s.provider.display_name).includes(normalize(search))) ?? [];
  return <section className="space-y-5"><h2 className="text-2xl font-bold">Servicios publicados</h2><div className="grid gap-4 sm:grid-cols-3"><div><label htmlFor="offer-search" className="mb-2 block text-sm">Buscar servicio o profesional</label><Input id="offer-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="¿Qué necesitas?"/></div><div><label htmlFor="offer-city" className="mb-2 block text-sm">Ciudad</label><Select value={city} onValueChange={setCity}><SelectTrigger id="offer-city"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todas las ciudades</SelectItem>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div><div><label htmlFor="offer-language" className="mb-2 block text-sm">Idioma</label><Select value={language} onValueChange={setLanguage}><SelectTrigger id="offer-language"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Todos los idiomas</SelectItem>{languages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div></div>
    {catalog.isPending ? <Notice>Cargando servicios…</Notice> : catalog.error ? <Notice>{marketplaceError(catalog.error)} <Link className="underline" to="/contact">Contactar</Link></Notice> : results.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map(s => <Link key={s.id} to={'/oferta/'+s.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"><p className="text-sm text-primary">{s.provider.city} · {s.provider.languages.join(', ')}</p><h3 className="mt-3 text-xl font-bold">{s.title}</h3><p className="mt-2 font-medium">{s.provider.display_name}</p><p className="mt-3 line-clamp-3 flex-1 text-muted-foreground">{s.description}</p><p className="mt-5 font-bold">{s.price === null ? 'Presupuesto a consultar' : 'Honorarios orientativos: '+money(s.price,s.currency)}</p><span className="mt-3 text-primary underline">Ver servicio y condiciones</span></Link>)}</div> : <Notice>{catalog.data?.length ? 'No hay servicios que coincidan con estos filtros.' : 'Estamos incorporando profesionales. Todavía no hay servicios publicados aquí.'} <Link to={category ? '/contact?servicio='+encodeURIComponent(category) : '/contact'} className="underline">Cuéntanos qué necesitas</Link>.</Notice>}
  </section>;
}
