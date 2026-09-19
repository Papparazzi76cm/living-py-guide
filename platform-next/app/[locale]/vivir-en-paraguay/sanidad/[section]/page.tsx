import { notFound } from 'next/navigation';

const sections: Record<string, { title: string; description: string }> = {
  hospitales: { title: 'Hospitales y sanatorios', description: 'Directorio geográfico de hospitales y sanatorios públicos y privados con servicios, especialidades y urgencias.' },
  'centros-de-salud': { title: 'Centros de salud', description: 'Atención primaria y centros sanitarios organizados por ciudad y zona.' },
  'seguros-medicos': { title: 'Seguros médicos y medicina prepaga', description: 'Planes, precios, carencias, coberturas y redes médicas con fecha de verificación.' },
  comparador: { title: 'Comparador de cobertura médica', description: 'Estructura preparada para comparar planes según edad, familia, ciudad, precio y cobertura.' }
};

export default async function HealthSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const data = sections[section];
  if (!data) notFound();
  return (
    <main className="lp-container py-20">
      <span className="lp-pill">Sanidad · estructura preparada</span>
      <h1 className="mt-5 text-5xl font-extrabold">{data.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{data.description}</p>
    </main>
  );
}
