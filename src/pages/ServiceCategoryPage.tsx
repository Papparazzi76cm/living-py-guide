import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ServiceCatalog } from '@/components/marketplace/ServiceCatalog';
import { SERVICE_CATEGORIES } from '@/data/marketplace';

export default function ServiceCategoryPage() {
  const { slug } = useParams();
  const category = SERVICE_CATEGORIES.find((item) => item.slug === slug);

  return (
    <Layout
      title={category?.name ?? 'Servicio no encontrado'}
      description={category?.description ?? 'Explora servicios verificados para expatriados en Paraguay.'}
      noHeaderPadding
    >
      <section className="bg-ink pb-16 pt-36 sm:pb-20 sm:pt-44">
        <div className="container mx-auto px-5 sm:px-6">
          <Link to="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" /> Todos los servicios</Link>
          <div className="mt-8 max-w-4xl">
            <p className="premium-kicker text-primary">Servicios para expatriados</p>
            <h1 className="premium-display mt-5 !text-white">{category?.name ?? 'Servicio no encontrado'}</h1>
            {category && <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">{category.description}</p>}
          </div>
          {category && <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/55">El profesional entra gratis · comisión de plataforma {category.commissionPercent}% solo sobre operaciones</div>}
        </div>
      </section>

      <section className="bg-gradient-sand py-14 sm:py-20">
        <div className="container mx-auto px-5 sm:px-6">
          {category ? <ServiceCatalog category={category.slug} /> : <div className="rounded-[2rem] border border-border bg-card p-8 text-center"><p className="text-muted-foreground">Esta categoría no existe.</p><Link to="/servicios" className="premium-button mt-6">Explorar marketplace <ArrowRight className="h-4 w-4" /></Link></div>}
        </div>
      </section>
    </Layout>
  );
}
