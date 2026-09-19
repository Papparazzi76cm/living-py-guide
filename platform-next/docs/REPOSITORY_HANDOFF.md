# Repository handoff

Target repository name: `livingparaguay-platform` (recommended).

When the empty destination repository is created, move the contents of `platform-next/` to the repository root. Do not copy the legacy Vite application or Lovable-specific files.

Expected root after handoff:

```text
app/
components/
docs/
lib/
supabase/
.env.example
.gitignore
.nvmrc
AGENTS.md
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
tailwind.config.ts
tsconfig.json
README.md
VERCEL.md
```

After handoff:

1. Install dependencies and produce lockfile.
2. Run typecheck/build/lint.
3. Create Supabase project and run migration.
4. Configure Vercel preview deployment.
5. Continue component/content migration from legacy repo as a reference only.
