# Codex working agreement — LivingParaguay Platform

## Mission
Rebuild LivingParaguay outside Lovable as a maintainable Next.js + Supabase platform while preserving the approved visual identity.

## Non-negotiables
- Preserve the LivingParaguay design tokens in `app/globals.css` and `docs/DESIGN_SYSTEM.md` unless a change is explicitly approved.
- Do not reintroduce Lovable-specific packages or generated dependencies.
- Use Next.js App Router, TypeScript strict mode and server components by default.
- Supabase is the system of record for structured public data.
- Use PostGIS-backed coordinates for proximity features.
- All volatile facts (prices, admissions, medical-plan coverage, requirements) must support source and verification dates.
- Public pages read only published records. Draft/review data must not leak through client-side Supabase queries.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- New pages should be designed for ES/PT/DE/EN routes, even if copy initially exists only in Spanish.
- Preserve legacy SEO value via permanent redirects rather than deleting old URLs silently.

## Product modules
1. Locations: country > department/capital district > city/municipality > neighborhood/zone/locality, plus non-administrative groups.
2. Education: institutions, campuses, levels, languages, features, fees, programs, accreditations and admissions.
3. Healthcare: organizations, facilities, specialties, services, medical/prepaid plans, prices, coverage and provider networks.
4. Sources/verification: private provenance layer supporting public verified dates.
5. Translations: structured editorial translations, not duplicated databases per language.

## Implementation conventions
- Prefer small reusable components under `components/`.
- Keep Supabase access in `lib/supabase` plus domain repositories/services as they are introduced.
- Avoid hard-coded directory records in components. Temporary homepage marketing copy is fine; institutions/facilities/locations belong in Supabase.
- Generate metadata and canonical URLs per locale and page.
- Filter/search parameter pages should default to `noindex` unless deliberately promoted to a curated landing page.
- Add indexes and RLS when adding tables.
- Run `npm run typecheck` and `npm run build` before considering a migration step complete.

## Migration rule
The legacy application remains untouched on `main` while the rebuild is staged. Port approved visual components and content deliberately; do not blindly copy obsolete architecture or hard-coded datasets.
