import { ServiceCatalog } from '@/components/marketplace/ServiceCatalog';
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
      <div className="mt-8"><ServiceCatalog category={category.slug}/></div></>}
    </section></Layout>;
}
