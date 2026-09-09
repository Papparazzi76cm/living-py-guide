import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Input } from '@/components/ui/input';
import { SERVICE_CATEGORIES } from '@/data/marketplace';

export default function HomePage() {
  const [query,setQuery] = useState('');
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const categories = SERVICE_CATEGORIES.filter(c=>normalize(c.name+' '+c.description).includes(normalize(query)));
  return <Layout title="Servicios para tu vida en Paraguay" description="Encuentra ayuda para instalarte, vivir y emprender en Paraguay. Profesionales sin cuotas de alta.">
    <section className="container mx-auto px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Living Paraguay · Living Business Club</p>
      <h1 className="mt-4 max-w-3xl text-3xl font-bold text-ink sm:text-5xl">Tu nueva vida en Paraguay empieza con la ayuda adecuada.</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Residencia, vivienda, empresa y servicios del día a día. Encuentra lo que necesitas y cuéntanos tu caso.</p>
      <div className="relative mt-8 max-w-2xl"><label htmlFor="service-search" className="mb-2 block font-medium">¿Qué necesitas resolver?</label><Input id="service-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Residencia, mudanza, traducción…" className="h-14 rounded-2xl pr-12 text-base"/><Search aria-hidden className="absolute bottom-4 right-4 h-5 w-5 text-primary"/></div>
      <div className="mt-8 flex flex-wrap gap-4 text-sm"><Link to="/ser-partner" className="font-semibold text-primary underline">Ofrece tus servicios · Alta gratuita</Link><Link to="/vivir-en-paraguay" className="underline">Guía para instalarte</Link></div>
      <h2 className="mt-12 text-2xl font-bold">Explora los servicios</h2>
      <p className="mt-2 text-muted-foreground">Estamos incorporando profesionales. Estas son categorías de servicios; la disponibilidad y el presupuesto se confirman para cada solicitud.</p>
      <p className="mt-4 text-sm text-muted-foreground" role="status">{categories.length} categorías</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c=><Link key={c.slug} to={'/servicios/'+c.slug} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><h3 className="text-xl font-semibold text-ink">{c.name}</h3><p className="mt-3 flex-1 text-base text-muted-foreground">{c.description}</p><span className="mt-6 flex items-center gap-2 font-semibold text-primary">Consultar servicio <ArrowRight aria-hidden className="h-4 w-4"/></span></Link>)}</div>
      {categories.length===0 && <div className="my-8 rounded-2xl bg-muted p-6"><p>No encontramos una categoría con esa búsqueda.</p><Link className="mt-3 inline-block font-semibold underline" to="/contact">Cuéntanos qué necesitas</Link></div>}
      <div className="mt-14 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">{[['01 · Elige','Busca el tipo de servicio que necesitas.'],['02 · Consulta','Describe tu situación para valorar disponibilidad y alcance.'],['03 · Decide','Revisa el presupuesto y las condiciones antes de contratar.']].map(([title,text])=><div key={title}><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-muted-foreground">{text}</p></div>)}</div>
    </section>
  </Layout>;
}
