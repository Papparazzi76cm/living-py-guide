import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');

async function hmacSha256(secret: string, value: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return result === 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const xLogin = Deno.env.get('DLOCAL_X_LOGIN');
  const secretKey = Deno.env.get('DLOCAL_SECRET_KEY');
  if (!supabaseUrl || !serviceRoleKey || !xLogin || !secretKey) return new Response('Not configured', { status: 503 });

  const rawBody = await req.text();
  const xDate = req.headers.get('X-Date') ?? req.headers.get('x-date') ?? '';
  const authorization = req.headers.get('Authorization') ?? '';
  const signatureHeader = req.headers.get('Signature') ?? '';
  if (!xDate || (!authorization && !signatureHeader)) return new Response('Missing signature', { status: 401 });

  const expectedHash = await hmacSha256(secretKey, `${xLogin}${xDate}${rawBody}`);
  const receivedHash = signatureHeader || authorization.replace(/^V2-HMAC-SHA256,\s*Signature:\s*/i, '').trim();
  if (!constantTimeEqual(expectedHash.toLowerCase(), receivedHash.toLowerCase())) return new Response('Invalid signature', { status: 401 });

  try {
    const payment = JSON.parse(rawBody) as {
      id?: string;
      order_id?: string;
      status?: string;
      status_code?: string | number;
      status_detail?: string;
      amount?: number;
      currency?: string;
      created_date?: string;
      approved_date?: string;
    };
    if (!payment.id || !payment.order_id || !/^[a-f0-9-]{36}$/.test(payment.order_id)) return new Response('Ignored', { status: 200 });

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data: order, error: orderError } = await admin.from('marketplace_requests').select('id,status,payment_status,payment_reference,total,currency').eq('id', payment.order_id).maybeSingle();
    if (orderError) throw orderError;
    if (!order) return new Response('Ignored', { status: 200 });
    if (order.payment_reference && order.payment_reference !== payment.id) return new Response('Payment mismatch', { status: 409 });

    const normalized = String(payment.status ?? '').toUpperCase();
    const update: Record<string, unknown> = {
      payment_provider: 'dlocal',
      payment_reference: payment.id,
    };

    if (normalized === 'PAID') {
      update.status = 'paid';
      update.payment_status = 'paid';
      update.paid_at = new Date().toISOString();
    } else if (normalized === 'PENDING') {
      update.status = 'payment_pending';
      update.payment_status = 'processing';
    } else if (normalized === 'REFUNDED') {
      update.status = 'refunded';
      update.payment_status = 'refunded';
    } else if (['REJECTED', 'CANCELLED'].includes(normalized)) {
      update.status = 'payment_pending';
      update.payment_status = 'failed';
    }

    const eventId = `dlocal:${payment.id}:${normalized}:${String(payment.status_code ?? '')}`;
    const { error: ledgerError } = await admin.from('marketplace_payment_events').upsert({
      id: eventId,
      request_id: order.id,
      event_type: `DLOCAL_${normalized || 'UNKNOWN'}`,
      payload: payment,
    }, { onConflict: 'id' });
    if (ledgerError) throw ledgerError;

    if (Object.keys(update).length > 2 || !order.payment_reference) {
      const { error: updateError } = await admin.from('marketplace_requests').update(update).eq('id', order.id);
      if (updateError) throw updateError;
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('marketplace-payment-webhook', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
});
