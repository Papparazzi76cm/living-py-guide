import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const requestId = url.searchParams.get('requestId') ?? '';
  const configuredSite = Deno.env.get('SITE_URL') ?? 'https://livingparaguay.com';
  const requestedSite = url.searchParams.get('site') ?? configuredSite;
  const safeSite = /^https:\/\/(?:www\.)?livingparaguay\.com$/i.test(requestedSite) || /^http:\/\/localhost(?::\d+)?$/i.test(requestedSite)
    ? requestedSite.replace(/\/$/, '')
    : configuredSite.replace(/\/$/, '');
  const destination = /^[a-f0-9-]{36}$/.test(requestId)
    ? `${safeSite}/pedido/${encodeURIComponent(requestId)}?payment=returned`
    : `${safeSite}/mi-cuenta?payment=returned`;
  return Response.redirect(destination, 303);
});
