import { ModuleLanding } from '@/components/module-landing';

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}/vivir-en-paraguay/sanidad`;
  return <ModuleLanding eyebrow="Sanidad" title="Salud y cobertura médica en Paraguay" intro="Hospitales, sanatorios, centros de salud y medicina prepaga conectados por ubicación, servicios, especialidades y red de cobertura." items={[
    { title: 'Hospitales y sanatorios', description: 'Centros públicos y privados con urgencias, especialidades y servicios.', href: `${base}/hospitales` },
    { title: 'Centros de salud', description: 'Atención primaria y centros sanitarios organizados geográficamente.', href: `${base}/centros-de-salud` },
    { title: 'Seguros médicos', description: 'Planes de medicina prepaga, precios, carencias, coberturas y redes asistenciales.', href: `${base}/seguros-medicos` },
    { title: 'Comparador', description: 'Base preparada para comparar planes por edad, familia, ciudad y cobertura.', href: `${base}/comparador` }
  ]} />;
}
