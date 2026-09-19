# LivingParaguay Platform — Next.js rebuild

This directory is the migration staging area for the new LivingParaguay platform. It is being developed on `migration/next-platform-bootstrap` so the current production application on `main` remains untouched.

## Target stack

- Next.js App Router + TypeScript
- Tailwind CSS using the extracted LivingParaguay Design System
- Supabase/Postgres
- PostGIS for proximity and map queries
- Vercel for deployment
- ES / PT / DE / EN route structure

## Current bootstrap

- Design tokens extracted from the current LivingParaguay UI.
- New `/[locale]/vivir-en-paraguay` information architecture started.
- Cities/Zones, Education and Healthcare module landings created.
- Browser/server Supabase clients scaffolded.
- Core PostGIS schema, seed lookups and RLS policies added.
- Legacy URL redirects started.
- Codex project rules documented in `AGENTS.md`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Required environment variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

The service-role key is reserved for trusted server-side admin operations and must never be exposed to client components.

## Database

Initial migration:

```text
supabase/migrations/202609190001_living_places_core.sql
```

It creates the first production data model for:

- sources and verification history,
- hierarchical locations and metropolitan/location groups,
- multilingual entity content,
- education institutions/campuses/fees/programs/admissions/accreditations,
- healthcare organizations/facilities/services/specialties,
- medical/prepaid plans/prices/coverage/provider networks,
- PostGIS points and indexes,
- public-read RLS policies for published data.

## Migration sequence

1. Finish visual component port (navigation, footer, cards, images and brand assets).
2. Create the dedicated Supabase project and run the initial migration.
3. Generate Supabase TypeScript types.
4. Build the internal admin CRUD and verification workflow.
5. Port approved legacy content and map it to new URLs.
6. Build dynamic location, education and health detail pages.
7. Add SEO metadata, sitemap, structured data and locale alternates.
8. Import the first verified dataset.
9. Deploy staging to Vercel and run visual/SEO/regression checks.
10. Point `livingparaguay.com` to the new deployment only after parity checks.

## Repository split

The intended final state is a dedicated repository for this `platform-next` code. The current connected GitHub integration can create branches/files/commits but does not expose repository creation, so bootstrap work is isolated here until the empty destination repository exists. Once created, this directory becomes the root of that repository; the legacy `main` application remains as historical backup.
