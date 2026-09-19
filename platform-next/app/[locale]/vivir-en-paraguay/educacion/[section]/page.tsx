import { notFound } from 'next/navigation';

const sections: Record<string, { title: string; description: string }> = {
  colegios: { title: 'Colegios en Paraguay', description: 'Directorio por ciudad, zona, nivel, idioma, tipo y coste. La siguiente fase conectará esta página con Supabase.' },
  universidades: { title: 'Universidades en Paraguay', description: 'Universidades, campus, carreras, modalidades, costes, CONES y acreditaciones.' },
  formacion: { title: 'Formación técnica y superior', description: 'Institutos superiores, centros técnicos y formación profesional.' },
  'estudiantes-extranjeros': { title: 'Estudiar en Paraguay siendo extranjero', description: 'Admisión, documentos, convalidaciones y continuidad de estudios.' }
};

export default async function EducationSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const data = sections[section];
  if (!data) notFound();
  return (
    <main className="lp-container py-20">
      <span className="lp-pill">Educación · estructura preparada</span>
      <h1 className="mt-5 text-5xl font-extrabold">{data.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{data.description}</p>
    </main>
  );
}
