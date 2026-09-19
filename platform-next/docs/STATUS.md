# Bootstrap status

## Completed

- Isolated migration branch created from current production code.
- Next.js App Router scaffold created under `platform-next/`.
- Current LivingParaguay palette, typography and visual tokens extracted.
- ES/PT/DE/EN route shell prepared.
- New `Vivir en Paraguay` hub created.
- Cities/Zones, Education and Healthcare route skeletons created.
- Supabase browser/server clients prepared.
- PostGIS + core data model + lookup seeds + RLS migration prepared.
- Legacy redirect strategy started.
- Codex instructions, architecture notes and design-system rules documented.

## Pending before first staging deployment

- Create dedicated destination GitHub repository and promote `platform-next/` to its root.
- Create dedicated LivingParaguay Supabase project.
- Run migration and generate typed database bindings.
- Port current navigation/footer/logo/approved imagery.
- Implement authenticated admin CRUD + verification workflow.
- Connect dynamic pages to Supabase.
- Build/test/typecheck/lint in CI.
- Create Vercel staging project.
