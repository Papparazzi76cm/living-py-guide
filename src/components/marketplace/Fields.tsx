import type { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Field({ label, name, value, onChange, area = false, ...props }: {
  label: string; name: string; value: string; onChange: (value: string) => void;
  area?: boolean; type?: string; min?: number; max?: number; step?: string;
  minLength?: number; maxLength?: number; required?: boolean; placeholder?: string;
}) {
  const id = `field-${name}`;
  return <div className="space-y-2"><label htmlFor={id} className="block text-sm font-medium">{label}</label>{area
    ? <Textarea id={id} name={name} value={value} onChange={e => onChange(e.target.value)} rows={4} minLength={props.minLength} maxLength={props.maxLength} required={props.required} placeholder={props.placeholder} />
    : <Input id={id} name={name} value={value} onChange={e => onChange(e.target.value)} {...props} />}</div>;
}
export function Notice({ children }: { children: ReactNode }) {
  return <p role="status" className="rounded-xl border border-border bg-muted p-4 text-base">{children}</p>;
}
