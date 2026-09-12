import type { HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  type?: HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  step?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
};

export function Field({ label, name, value, onChange, area = false, ...props }: FieldProps) {
  const id = `field-${name}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">{label}</label>
      {area
        ? <Textarea id={id} name={name} value={value} onChange={(event) => onChange(event.target.value)} rows={4} minLength={props.minLength} maxLength={props.maxLength} required={props.required} placeholder={props.placeholder} />
        : <Input id={id} name={name} value={value} onChange={(event) => onChange(event.target.value)} {...props} />}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return <p role="status" className="rounded-xl border border-border bg-muted p-4 text-base">{children}</p>;
}
