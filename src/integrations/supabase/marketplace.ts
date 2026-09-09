import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import type { MarketplaceDatabase } from '@/types/marketplace';

// Same session and transport; schema added by expat_services_marketplace migration.
export const marketplace = supabase as unknown as SupabaseClient<MarketplaceDatabase>;

export function marketplaceError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  if (['42P01', 'PGRST205', 'PGRST204'].includes(code)) return 'Este servicio todavía no está disponible. Puedes contactar con Living Paraguay mientras completamos la puesta en marcha.';
  if (code === '23505') return 'Ya existe un registro con estos datos. Actualiza la página para consultarlo.';
  if (code === '42501') return 'No tienes permiso para realizar esta acción. Comprueba que has iniciado sesión con la cuenta correcta.';
  if (code === '23514') return 'Revisa los importes, los datos obligatorios y el estado de la solicitud. Puede haber cambiado desde que abriste la página.';
  return 'No hemos podido completar la operación. Conservamos los datos del formulario para que puedas intentarlo de nuevo.';
}
