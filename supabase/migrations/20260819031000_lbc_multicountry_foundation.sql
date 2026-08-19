BEGIN;

CREATE TABLE IF NOT EXISTS public.network_markets (
  slug text PRIMARY KEY,
  network_brand_slug text NOT NULL DEFAULT 'lbc',
  brand_name text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  locale text NOT NULL,
  currency_code text NOT NULL,
  status text NOT NULL,
  operator_model text NOT NULL,
  pricing_status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT network_markets_brand_check CHECK (network_brand_slug = 'lbc'),
  CONSTRAINT network_markets_country_code_check CHECK (char_length(country_code) = 2),
  CONSTRAINT network_markets_status_check CHECK (status IN ('active', 'planned', 'market-study')),
  CONSTRAINT network_markets_operator_model_check CHECK (operator_model IN ('founding-delegation', 'franchise')),
  CONSTRAINT network_markets_pricing_status_check CHECK (pricing_status IN ('active', 'pending-market-study'))
);

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
  pricing_status
)
VALUES
  ('paraguay', 'lbc', 'Living Paraguay', 'PY', 'Paraguay', 'es-PY', 'USD', 'active', 'founding-delegation', 'active'),
  ('argentina', 'lbc', 'Living Argentina', 'AR', 'Argentina', 'es-AR', 'ARS', 'planned', 'franchise', 'pending-market-study'),
  ('brasil', 'lbc', 'Living Brasil', 'BR', 'Brasil', 'pt-BR', 'BRL', 'planned', 'franchise', 'pending-market-study'),
  ('mexico', 'lbc', 'Living México', 'MX', 'México', 'es-MX', 'MXN', 'planned', 'franchise', 'pending-market-study')
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
  updated_at = now();

DROP TRIGGER IF EXISTS network_markets_set_updated_at ON public.network_markets;
CREATE TRIGGER network_markets_set_updated_at
BEFORE UPDATE ON public.network_markets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.community_signups
  ADD COLUMN IF NOT EXISTS market_slug text NOT NULL DEFAULT 'paraguay',
  ADD COLUMN IF NOT EXISTS market_name text NOT NULL DEFAULT 'Living Paraguay',
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'PY',
  ADD COLUMN IF NOT EXISTS network_brand_slug text NOT NULL DEFAULT 'lbc';

ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS market_slug text NOT NULL DEFAULT 'paraguay',
  ADD COLUMN IF NOT EXISTS market_name text NOT NULL DEFAULT 'Living Paraguay',
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'PY',
  ADD COLUMN IF NOT EXISTS network_brand_slug text NOT NULL DEFAULT 'lbc';

ALTER TABLE public.contact_inquiries
  ADD COLUMN IF NOT EXISTS market_slug text NOT NULL DEFAULT 'paraguay',
  ADD COLUMN IF NOT EXISTS market_name text NOT NULL DEFAULT 'Living Paraguay',
  ADD COLUMN IF NOT EXISTS country_code text NOT NULL DEFAULT 'PY',
  ADD COLUMN IF NOT EXISTS network_brand_slug text NOT NULL DEFAULT 'lbc';

CREATE OR REPLACE FUNCTION public.assign_lbc_market_context()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  selected_market public.network_markets%ROWTYPE;
BEGIN
  SELECT * INTO selected_market
  FROM public.network_markets
  WHERE slug = NEW.market_slug;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mercado LBC no válido: %', NEW.market_slug USING ERRCODE = '22023';
  END IF;

  NEW.market_name := selected_market.brand_name;
  NEW.country_code := selected_market.country_code;
  NEW.network_brand_slug := selected_market.network_brand_slug;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS community_signups_assign_market ON public.community_signups;
CREATE TRIGGER community_signups_assign_market
BEFORE INSERT OR UPDATE OF market_slug ON public.community_signups
FOR EACH ROW EXECUTE FUNCTION public.assign_lbc_market_context();

DROP TRIGGER IF EXISTS partner_applications_assign_market ON public.partner_applications;
CREATE TRIGGER partner_applications_assign_market
BEFORE INSERT OR UPDATE OF market_slug ON public.partner_applications
FOR EACH ROW EXECUTE FUNCTION public.assign_lbc_market_context();

DROP TRIGGER IF EXISTS contact_inquiries_assign_market ON public.contact_inquiries;
CREATE TRIGGER contact_inquiries_assign_market
BEFORE INSERT OR UPDATE OF market_slug ON public.contact_inquiries
FOR EACH ROW EXECUTE FUNCTION public.assign_lbc_market_context();

UPDATE public.community_signups SET market_slug = COALESCE(market_slug, 'paraguay');
UPDATE public.partner_applications SET market_slug = COALESCE(market_slug, 'paraguay');
UPDATE public.contact_inquiries SET market_slug = COALESCE(market_slug, 'paraguay');

ALTER TABLE public.community_signups
  DROP CONSTRAINT IF EXISTS community_signups_market_fk;
ALTER TABLE public.community_signups
  ADD CONSTRAINT community_signups_market_fk FOREIGN KEY (market_slug) REFERENCES public.network_markets(slug);

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_market_fk;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_market_fk FOREIGN KEY (market_slug) REFERENCES public.network_markets(slug);

ALTER TABLE public.contact_inquiries
  DROP CONSTRAINT IF EXISTS contact_inquiries_market_fk;
ALTER TABLE public.contact_inquiries
  ADD CONSTRAINT contact_inquiries_market_fk FOREIGN KEY (market_slug) REFERENCES public.network_markets(slug);

DROP INDEX IF EXISTS public.partner_applications_email_category_zone_unique;
CREATE UNIQUE INDEX IF NOT EXISTS partner_applications_email_market_category_zone_unique
  ON public.partner_applications (lower(email), market_slug, category_slug, zone_slug);

CREATE INDEX IF NOT EXISTS community_signups_market_created_idx
  ON public.community_signups (market_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS partner_applications_market_status_created_idx
  ON public.partner_applications (market_slug, status, created_at DESC);
CREATE INDEX IF NOT EXISTS contact_inquiries_market_created_idx
  ON public.contact_inquiries (market_slug, created_at DESC);

ALTER TABLE public.network_markets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read LBC market catalog" ON public.network_markets;
CREATE POLICY "Public can read LBC market catalog"
ON public.network_markets
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage LBC market catalog" ON public.network_markets;
CREATE POLICY "Admins can manage LBC market catalog"
ON public.network_markets
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.network_markets TO anon, authenticated;

COMMIT;
