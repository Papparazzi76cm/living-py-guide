import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';

/**
 * The CRM tables are not part of the generated Database types yet, so we expose
 * a loosely typed client for them. Row shapes are enforced at the call sites via
 * the interfaces in `@/types/crm`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const crmSupabase = supabase as unknown as SupabaseClient<any, 'public', any>;
