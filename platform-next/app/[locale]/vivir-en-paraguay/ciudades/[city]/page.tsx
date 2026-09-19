import { notFound } from 'next/navigation';

const cities: Record<string, { title: string; description: string }> = {
  asuncion: { title: 'Vivir en Asunción y Gran Asunción', description: 'Base para conectar barrios, municipios metropolitanos, colegios, universidades, hospitales y servicios por proximidad.' },
  encarnacion: { title: 'Vivir en Encarnación y entorno', description: 'Encarnación, Cambyretá y Capitán Miranda, con información práctica conectada por zona.' },
  'ciudad-del-este': { title: 'Vivir en Ciudad del Este y entorno', description: 'Ciudad del Este, Hernandarias, Presidente Franco y Minga Guazú.' },
  'colonias-unidas': { title: 'Vivir en Colonias Unidas', description: 'Hohenau, Obligado y Bella Vista, con foco especial en familias y residentes internacionales.' }
};

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const data = cities[city];
  if (!data) notFound();
  return (
    <main className="lp-container py-20">
      <span className="lp-pill">Ciudades y zonas · estructura preparada</span>
      <h1 className="mt-5 text-5xl font-extrabold">{data.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{data.description}</p>
    </main>
  );
}
