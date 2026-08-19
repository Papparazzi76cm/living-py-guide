import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './client';
import type { CrmDatabase } from '@/types/crm';

export const crmSupabase = supabase as unknown as SupabaseClient<CrmDatabase>;
