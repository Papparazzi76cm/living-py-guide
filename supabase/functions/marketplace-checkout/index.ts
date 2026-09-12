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

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

async function hmacSha256(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const xLogin = Deno.env.get('DLOCAL_X_LOGIN');
  const xTransKey = Deno.env.get('DLOCAL_X_TRANS_KEY');
  const secretKey = Deno.env.get('DLOCAL_SECRET_KEY');
  const apiBase = Deno.env.get('DLOCAL_API_BASE');
  const siteUrl = Deno.env.get('SITE_URL') ?? 'https://livingparaguay.com';

  if (!supabaseUrl || !anonKey || !serviceRoleKey) return json({ error: 'Supabase configuration missing' }, 500);
  if (!xLogin || !xTransKey || !secretKey || !apiBase) {
    return json({ error: 'Online checkout is not activated yet', code: 'PAYMENT_PROVIDER_NOT_CONFIGURED' }, 503);
  }

  try {
    const authClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData.user) return json({ error: 'Unauthorized' }, 401);

    const input = await req.json() as { requestId?: string; payerName?: string; payerDocument?: string };
    if (!input.requestId || !/^[a-f0-9-]{36}$/.test(input.requestId)) return json({ error: 'Invalid request' }, 400);
    const payerName = input.payerName?.trim() ?? '';
    const payerDocument = input.payerDocument?.replace(/\D/g, '') ?? '';
    if (payerName.length < 3 || payerName.length > 120 || payerDocument.length < 5 || payerDocument.length > 20) {
      return json({ error: 'Nombre y documento del pagador son obligatorios' }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: order, error: orderError } = await admin.from('marketplace_requests').select('*').eq('id', input.requestId).eq('customer_id', userData.user.id).maybeSingle();
    if (orderError) throw orderError;
    if (!order) return json({ error: 'Order not found' }, 404);
    if (!['accepted', 'payment_pending'].includes(order.status) || !['unpaid', 'failed', 'processing'].includes(order.payment_status)) {
      return json({ error: 'Order cannot be paid in its current state' }, 409);
    }
    if (!order.total || order.total <= 0) return json({ error: 'Order has no payable total' }, 409);
    if (order.currency !== 'PYG') {
      return json({ error: 'El checkout local inicial procesa presupuestos en guaraníes. Solicita al profesional una versión en PYG.', code: 'PYG_REQUIRED' }, 409);
    }
    if (order.total < 7500) return json({ error: 'El mínimo de pago online es 7.500 PYG' }, 409);

    const bodyObject = {
      amount: Math.round(order.total),
      currency: 'PYG',
      country: 'PY',
      payment_method_flow: 'REDIRECT',
      payer: {
        name: payerName,
        email: userData.user.email,
        document: payerDocument,
        user_reference: userData.user.id,
      },
      order_id: order.id,
      description: `Living Paraguay - ${String(order.service_title).slice(0, 150)}`,
      notification_url: `${supabaseUrl}/functions/v1/marketplace-payment-webhook`,
      callback_url: `${supabaseUrl}/functions/v1/marketplace-payment-return?requestId=${encodeURIComponent(order.id)}&site=${encodeURIComponent(siteUrl)}`,
    };
    const body = JSON.stringify(bodyObject);
    const xDate = new Date().toISOString();
    const signature = await hmacSha256(secretKey, `${xLogin}${xDate}${body}`);

    const response = await fetch(`${apiBase.replace(/\/$/, '')}/payments`, {
      method: 'POST',
      headers: {
        'X-Date': xDate,
        'X-Login': xLogin,
        'X-Trans-Key': xTransKey,
        'X-Version': '2.1',
        'User-Agent': 'LivingParaguayMarketplace/1.0',
        'Content-Type': 'application/json',
        'Authorization': `V2-HMAC-SHA256, Signature: ${signature}`,
        'X-Idempotency-Key': `living-${order.id}-v${order.quote_version}`,
      },
      body,
    });

    const payment = await response.json();
    if (!response.ok || !payment?.id || !payment?.redirect_url) {
      console.error('dLocal checkout error', response.status, payment);
      return json({ error: 'No se pudo iniciar el pago online' }, 502);
    }

    const { error: updateError } = await admin.from('marketplace_requests').update({
      status: 'payment_pending',
      payment_status: 'processing',
      payment_provider: 'dlocal',
      payment_reference: payment.id,
    }).eq('id', order.id);
    if (updateError) throw updateError;

    await admin.from('marketplace_payment_events').upsert({
      id: `checkout:${payment.id}`,
      request_id: order.id,
      event_type: 'CHECKOUT_CREATED',
      payload: { payment_id: payment.id, status: payment.status ?? null },
    }, { onConflict: 'id' });

    return json({ url: payment.redirect_url, provider: 'dlocal' });
  } catch (error) {
    console.error('marketplace-checkout', error);
    return json({ error: 'No se pudo iniciar el pago' }, 500);
  }
});
