export const money = (amount: number | null, currency: string) => amount === null
  ? 'A consultar'
  : new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'PYG' ? 0 : 2,
    }).format(amount);

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente de revisión',
  approved: 'Aprobado',
  rejected: 'Requiere revisión',
  draft: 'Borrador',
  published: 'Publicado',
  hidden: 'Oculto',
  requested: 'Solicitud enviada',
  quoted: 'Presupuesto recibido',
  accepted: 'Presupuesto aceptado',
  payment_pending: 'Pago pendiente',
  paid: 'Pago confirmado',
  in_progress: 'Servicio en curso',
  completed: 'Servicio finalizado',
  declined: 'No disponible',
  cancelled: 'Cancelado',
  disputed: 'Incidencia abierta',
  refunded: 'Reembolsado',
  not_required: 'Sin pago',
  unpaid: 'Pendiente de pago',
  processing: 'Procesando pago',
  failed: 'Pago fallido',
};
