export function VerifiedDate({ date }: { date?: string | null }) {
  if (!date) return null;
  const formatted = new Intl.DateTimeFormat('es-PY', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
  return <span className="text-xs font-semibold text-muted-foreground">Datos verificados: {formatted}</span>;
}
