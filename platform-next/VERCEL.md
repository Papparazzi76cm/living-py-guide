# Vercel deployment notes

Recommended project settings once the dedicated repository exists:

- Framework preset: Next.js
- Root directory: repository root (currently `platform-next/` in migration staging)
- Node.js: 20+
- Production branch: `main`
- Preview deployments: enabled

Environment variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Do not attach `livingparaguay.com` until redirect, SEO and content parity checks are complete. Use a Vercel preview/staging domain first.
