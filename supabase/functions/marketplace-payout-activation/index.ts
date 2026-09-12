import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = req.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!authorization || !supabaseUrl || !anonKey || !serviceRoleKey) return json({ error: 'Unauthorized' }, 401);

  try {
    const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: userData, error: userError } = await authClient.auth.getUser(authorization.replace('Bearer ', ''));
    if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401);

    const input = await req.json() as { providerId?: string };
    if (!input.providerId || !/^[a-f0-9-]{36}$/.test(input.providerId)) return json({ error: 'Invalid provider' }, 400);

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: provider, error: providerError } = await admin.from('marketplace_providers').select('id,user_id,status,payout_status').eq('id', input.providerId).eq('user_id', userData.user.id).maybeSingle();
    if (providerError) throw providerError;
    if (!provider) return json({ error: 'Provider not found' }, 404);
    if (provider.status !== 'approved') return json({ error: 'Provider must be approved first' }, 409);

    if (provider.payout_status === 'ready') return json({ status: 'ready' });
    const { error: updateError } = await admin.from('marketplace_providers').update({
      payout_provider: 'dlocal',
      payout_status: 'pending',
      payouts_enabled: false,
    }).eq('id', provider.id);
    if (updateError) throw updateError;

    return json({ status: 'pending', provider: 'dlocal' });
  } catch (error) {
    console.error('marketplace-payout-activation', error);
    return json({ error: 'No se pudo solicitar la activación de cobros' }, 500);
  }
});
