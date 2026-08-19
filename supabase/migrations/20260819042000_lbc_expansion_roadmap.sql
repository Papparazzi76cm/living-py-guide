BEGIN;

ALTER TABLE public.network_markets
  ADD COLUMN IF NOT EXISTS expansion_priority integer;

ALTER TABLE public.network_markets
  DROP CONSTRAINT IF EXISTS network_markets_expansion_priority_check;
ALTER TABLE public.network_markets
  ADD CONSTRAINT network_markets_expansion_priority_check
  CHECK (expansion_priority IS NULL OR expansion_priority >= 0);

-- Paraguay es el mercado fundador. El resto se ordena según la hoja de expansión
-- comercial actual. El orden expresa preferencia, no una fecha contractual de apertura.
UPDATE public.network_markets
SET expansion_priority = CASE slug
  WHEN 'paraguay' THEN 0
  WHEN 'mexico' THEN 1
  WHEN 'argentina' THEN 7
  WHEN 'brasil' THEN 8
  ELSE expansion_priority
END,
updated_at = now()
WHERE slug IN ('paraguay', 'mexico', 'argentina', 'brasil');

INSERT INTO public.network_markets (
  slug,
  network_brand_slug,
  brand_name,
  country_code,
  country_name,
  locale,
  currency_code,
  status,
  operator_model,
  pricing_status,
  expansion_priority
)
VALUES
  ('panama', 'lbc', 'Living Panamá', 'PA', 'Panamá', 'es-PA', 'USD', 'planned', 'franchise', 'pending-market-study', 2),
  ('costa-rica', 'lbc', 'Living Costa Rica', 'CR', 'Costa Rica', 'es-CR', 'CRC', 'planned', 'franchise', 'pending-market-study', 3),
  ('republica-dominicana', 'lbc', 'Living República Dominicana', 'DO', 'República Dominicana', 'es-DO', 'DOP', 'planned', 'franchise', 'pending-market-study', 4),
  ('colombia', 'lbc', 'Living Colombia', 'CO', 'Colombia', 'es-CO', 'COP', 'planned', 'franchise', 'pending-market-study', 5),
  ('el-salvador', 'lbc', 'Living El Salvador', 'SV', 'El Salvador', 'es-SV', 'USD', 'planned', 'franchise', 'pending-market-study', 6)
ON CONFLICT (slug) DO UPDATE SET
  network_brand_slug = EXCLUDED.network_brand_slug,
  brand_name = EXCLUDED.brand_name,
  country_code = EXCLUDED.country_code,
  country_name = EXCLUDED.country_name,
  locale = EXCLUDED.locale,
  currency_code = EXCLUDED.currency_code,
  status = EXCLUDED.status,
  operator_model = EXCLUDED.operator_model,
  pricing_status = EXCLUDED.pricing_status,
  expansion_priority = EXCLUDED.expansion_priority,
  updated_at = now();

CREATE INDEX IF NOT EXISTS network_markets_expansion_priority_idx
  ON public.network_markets (expansion_priority)
  WHERE expansion_priority IS NOT NULL;

COMMIT;
