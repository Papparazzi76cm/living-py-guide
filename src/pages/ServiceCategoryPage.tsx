import { Link, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SERVICE_CATEGORIES } from '@/data/marketplace';
export default function ServiceCategoryPage() {
  const { slug } = useParams();
  const category = SERVICE_CATEGORIES.find(c=>c.slug===slug);
  return <Layout title={category?.name ?? 'Servicio no encontrado'} description={category?.description ?? 'Explora los servicios para expatriados.'}>
    <section className="container mx-auto max-w-3xl px-4 py-12">
      <Link to="/servicios" className="text-primary underline">Volver a servicios</Link>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{category?.name ?? 'Servicio no encontrado'}</h1>
      {category && <><p className="mt-5 text-lg text-muted-foreground">{category.description}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Cuéntanos qué necesitas</h2><p className="mt-3">Indica tu ciudad, el idioma de atención y cuándo necesitarías el servicio. Revisaremos tu consulta para valorar las opciones disponibles.</p><p className="mt-4 text-muted-foreground">Presupuesto a consultar. Todavía no hay ofertas publicadas en esta categoría. Enviar una consulta no confirma una reserva ni implica un pago.</p><Link to={'/contact?servicio='+encodeURIComponent(category.slug)} className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Solicitar información</Link></div></>}
    </section></Layout>;
}
