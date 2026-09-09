export const money = (amount: number | null, currency: string) => amount === null ? 'A consultar' : new Intl.NumberFormat('es-PY', { style: 'currency', currency, maximumFractionDigits: currency === 'PYG' ? 0 : 2 }).format(amount);
export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de revisión', approved: 'Aprobado', rejected: 'Requiere revisión',
  draft: 'Borrador', published: 'Publicado', hidden: 'Oculto', requested: 'Solicitud enviada',
  quoted: 'Presupuesto recibido', accepted: 'Presupuesto aceptado', declined: 'No disponible',
  cancelled: 'Cancelada', completed: 'Servicio confirmado por el cliente',
};
