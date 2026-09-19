import { ModuleLanding } from '@/components/module-landing';

export default async function EducationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = `/${locale}/vivir-en-paraguay/educacion`;
  return <ModuleLanding eyebrow="Educación" title="Estudiar en Paraguay" intro="Directorio verificado de centros educativos con precios, idiomas, niveles, admisión, campus y programas académicos." items={[
    { title: 'Colegios', description: 'Colegios públicos, privados, bilingües e internacionales filtrables por ciudad, nivel, idioma y coste.', href: `${base}/colegios` },
    { title: 'Universidades', description: 'Universidades y campus con carreras, modalidad, costes y datos de acreditación.', href: `${base}/universidades` },
    { title: 'Formación técnica', description: 'Institutos superiores, formación profesional y centros técnicos.', href: `${base}/formacion` },
    { title: 'Estudiantes extranjeros', description: 'Requisitos, convalidaciones, admisión y continuidad de estudios.', href: `${base}/estudiantes-extranjeros` }
  ]} />;
}
