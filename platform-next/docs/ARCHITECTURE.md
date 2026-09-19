# LivingParaguay Platform Architecture

## Runtime

```text
livingparaguay.com
      ↓
Vercel / Next.js App Router
      ↓
Server Components + Server Actions
      ↓
Supabase (Postgres + PostGIS + Auth + Storage)
```

## Public domain modules

```text
Locations
  ├─ Location profiles
  ├─ Metropolitan / non-administrative groups
  ├─ Education campuses nearby
  └─ Health facilities nearby

Education
  ├─ Institutions
  ├─ Campuses
  ├─ Levels / languages / features
  ├─ Fees with validity windows
  ├─ Programs
  ├─ Accreditations
  └─ Admissions / foreign-student requirements

Healthcare
  ├─ Organizations
  ├─ Facilities
  ├─ Specialties / services
  ├─ Insurance / prepaid plans
  ├─ Price bands with validity windows
  ├─ Coverage matrix
  └─ Provider network
```

## Provenance

`source_id`, `primary_source_id`, `verified_at` and `verification_events` are part of the product model, not editorial metadata. Changing facts must retain history rather than overwriting provenance.

## Security boundary

- Browser clients receive only the publishable Supabase key.
- Public RLS policies expose published directory data and lookup tables.
- `sources` and `verification_events` are not publicly readable.
- Admin mutations will be implemented server-side with explicit authorization; the service-role key is server-only.

## SEO boundary

Curated city/module/detail pages are indexable. Arbitrary filter combinations remain application state and should be `noindex` unless promoted to a dedicated curated landing page.

## Migration boundary

The legacy Vite/Lovable-generated application remains on the old production branch/repository until the new platform passes content, visual, SEO and redirect parity checks.
