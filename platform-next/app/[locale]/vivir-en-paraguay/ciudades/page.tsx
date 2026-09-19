import { ModuleLanding } from '@/components/module-landing';

export default async function CitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}/vivir-en-paraguay/ciudades`;
  return <ModuleLanding eyebrow="Ciudades y zonas" title="Dónde vivir en Paraguay" intro="La base geográfica conectará barrios, municipios y áreas metropolitanas con educación, sanidad y servicios cercanos." items={[
    { title: 'Asunción y Gran Asunción', description: 'Asunción, Luque, San Lorenzo, Fernando de la Mora, Lambaré y otras zonas metropolitanas.', href: `${base}/asuncion`, eyebrow: 'Prioridad 1' },
    { title: 'Encarnación y entorno', description: 'Encarnación, Cambyretá y Capitán Miranda.', href: `${base}/encarnacion`, eyebrow: 'Prioridad 2' },
    { title: 'Ciudad del Este y entorno', description: 'Ciudad del Este, Hernandarias, Presidente Franco y Minga Guazú.', href: `${base}/ciudad-del-este`, eyebrow: 'Prioridad 3' },
    { title: 'Colonias Unidas', description: 'Hohenau, Obligado y Bella Vista.', href: `${base}/colonias-unidas`, eyebrow: 'Prioridad 4' }
  ]} />;
}
