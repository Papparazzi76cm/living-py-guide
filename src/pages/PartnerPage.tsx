import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { COMMISSION_PROPOSAL, SERVICE_CATEGORIES } from '@/data/marketplace';
export default function PartnerPage() {
  return <Layout title="Ofrece tus servicios · Alta gratuita" description="Únete al marketplace de Living Paraguay sin cuotas. Modelo de comisión por servicios contratados.">
    <section className="container mx-auto max-w-4xl px-4 py-12">
      <p className="font-semibold text-primary">Profesionales y empresas</p><h1 className="mt-4 text-3xl font-bold sm:text-5xl">Crece con quienes empiezan una nueva vida en Paraguay.</h1>
      <p className="mt-6 text-lg text-muted-foreground">Alta gratuita, sin cuotas mensuales ni anuales y sin exclusividad de categoría. Nuestro modelo se basa en una comisión por servicios contratados a través de la plataforma.</p>
      <Link to="/contact?profesional=1" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground">Solicitar alta gratuita</Link>
      <p className="mt-4 text-sm text-muted-foreground">Recibimos tu solicitud de incorporación. La publicación de tu perfil requiere revisión; no implica contratación ni garantiza clientes.</p>
      <h2 className="mt-12 text-2xl font-bold">Propuesta inicial de comisiones</h2><p className="mt-3 text-muted-foreground">Se confirmarán por escrito antes de aceptar una contratación. Se calculan sobre honorarios, excluyendo impuestos, tasas oficiales y gastos de terceros. En vivienda, nunca sobre el precio del inmueble o el alquiler.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border"><table className="w-full text-left"><caption className="sr-only">Comisión propuesta por categoría de servicio</caption><thead className="bg-muted"><tr><th className="p-4">Servicio</th><th className="p-4">Comisión</th></tr></thead><tbody>{SERVICE_CATEGORIES.filter(c=>COMMISSION_PROPOSAL[c.slug]!==undefined).map(c=><tr key={c.slug} className="border-t border-border"><td className="p-4">{c.name}</td><td className="p-4">{COMMISSION_PROPOSAL[c.slug]} %</td></tr>)}</tbody></table></div>
      <p className="mt-4 text-muted-foreground">Las demás actividades, incluidos seguros, salud y educación, requieren un acuerdo específico. No se aplicará una comisión automática.</p>
      <div className="mt-10 rounded-2xl bg-muted p-6"><h2 className="text-xl font-semibold">Condiciones claras desde el principio</h2><p className="mt-3">Cada presupuesto deberá indicar el alcance, los gastos adicionales, las condiciones de cancelación y el precio total para el cliente. El profesional conocerá la comisión y su importe neto antes de aceptar.</p><p className="mt-3 text-muted-foreground">La contratación y el pago online están en preparación. En esta fase gestionamos consultas y solicitudes de incorporación.</p></div>
    </section></Layout>;
}
