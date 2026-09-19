import Link from 'next/link';
import { Building2, GraduationCap, HeartPulse, MapPinned } from 'lucide-react';

const modules = [
  {
    slug: 'ciudades',
    title: 'Ciudades y zonas',
    description: 'Compara dónde vivir con datos de barrios, servicios, educación, sanidad y entorno.',
    icon: MapPinned,
    accent: 'text-clay'
  },
  {
    slug: 'educacion',
    title: 'Educación',
    description: 'Colegios, universidades, institutos, precios, idiomas, admisión y estudios para extranjeros.',
    icon: GraduationCap,
    accent: 'text-secondary'
  },
  {
    slug: 'sanidad',
    title: 'Sanidad',
    description: 'Hospitales, sanatorios, centros de salud, seguros médicos, redes y coberturas.',
    icon: HeartPulse,
    accent: 'text-primary'
  },
  {
    slug: 'servicios',
    title: 'Vida práctica',
    description: 'Base preparada para vivienda, banca, internet, transporte, coworking y otros servicios.',
    icon: Building2,
    accent: 'text-ink'
  }
] as const;

export default async function LivingParaguayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main>
      <section className="lp-dark-section text-white">
        <div className="lp-container py-20 sm:py-28 lg:py-36">
          <span className="lp-pill border-white/20 bg-white/10 text-white">Living Paraguay Places</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Todo lo que necesitas para decidir dónde y cómo vivir en Paraguay.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
            Información práctica, geolocalizada, estructurada y con fecha de verificación para familias, estudiantes, profesionales e inversores.
          </p>
        </div>
      </section>

      <section className="lp-container py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">Explorar Paraguay</p>
          <h2 className="mt-3 text-4xl font-extrabold sm:text-5xl">Empieza por lo que necesitas resolver</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map(({ slug, title, description, icon: Icon, accent }) => (
            <Link key={slug} href={`/${locale}/vivir-en-paraguay/${slug}`} className="lp-card group">
              <Icon className={`h-8 w-8 ${accent}`} aria-hidden />
              <h3 className="mt-8 text-2xl font-extrabold">{title}</h3>
              <p className="mt-3 max-w-xl leading-7 text-muted-foreground">{description}</p>
              <span className="mt-8 inline-flex font-bold text-ink group-hover:text-primary">Explorar →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
