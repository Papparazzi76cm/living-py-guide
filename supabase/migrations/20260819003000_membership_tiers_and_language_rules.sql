BEGIN;

ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS membership_tier text,
  ADD COLUMN IF NOT EXISTS membership_price_usd integer;

CREATE OR REPLACE FUNCTION public.assign_partner_membership_tier()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.membership_tier := CASE
    WHEN NEW.category_slug IN (
      'legal-corporativo',
      'inmobiliaria',
      'banca-fintech',
      'colegios-internacionales',
      'constitucion-empresas',
      'relocation',
      'vehiculos',
      'arquitectos',
      'construccion-reformas'
    ) THEN 'A'
    WHEN NEW.category_slug IN (
      'residencia-migraciones',
      'contabilidad-impuestos',
      'seguros',
      'salud-privada',
      'mudanzas-logistica',
      'eventos',
      'marketing',
      'tecnologia-ia',
      'recursos-humanos',
      'escribania',
      'contadores'
    ) THEN 'B'
    WHEN NEW.category_slug IN (
      'telecom-internet',
      'guarderia-cuidadores-infantiles',
      'cuidado-mayores',
      'veterinaria',
      'chefs-domicilio',
      'traduccion',
      'viajes',
      'hospitalidad-lifestyle'
    ) THEN 'C'
    WHEN NEW.category_slug IN (
      'manitas-24-horas',
      'cuidado-mascotas',
      'servicios-hogar'
    ) THEN 'D'
    ELSE 'C'
  END;

  NEW.membership_price_usd := CASE NEW.membership_tier
    WHEN 'A' THEN 2400
    WHEN 'B' THEN 1200
    WHEN 'C' THEN 600
    WHEN 'D' THEN 0
    ELSE 600
  END;

  IF NEW.membership_tier = 'D' THEN
    NEW.exclusivity_interest := false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partner_applications_assign_membership_tier ON public.partner_applications;
CREATE TRIGGER partner_applications_assign_membership_tier
BEFORE INSERT OR UPDATE ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.assign_partner_membership_tier();

-- Backfill tier and price for existing applications using the authoritative trigger.
UPDATE public.partner_applications
SET updated_at = updated_at;

ALTER TABLE public.partner_applications
  ALTER COLUMN membership_tier SET NOT NULL,
  ALTER COLUMN membership_price_usd SET NOT NULL;

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_membership_tier_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_membership_tier_check
  CHECK (membership_tier IN ('A', 'B', 'C', 'D'));

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_membership_price_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_membership_price_check
  CHECK (
    (membership_tier = 'A' AND membership_price_usd = 2400)
    OR (membership_tier = 'B' AND membership_price_usd = 1200)
    OR (membership_tier = 'C' AND membership_price_usd = 600)
    OR (membership_tier = 'D' AND membership_price_usd = 0)
  );

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_category_d_no_exclusivity_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_category_d_no_exclusivity_check
  CHECK (membership_tier <> 'D' OR exclusivity_interest = false);

-- Language eligibility is enforced for every new/updated row, while NOT VALID avoids
-- rejecting historical applications that predate these business rules.
ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_language_eligibility_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_language_eligibility_check
  CHECK (
    (
      membership_tier <> 'A'
      OR (
        (
          lower(languages) LIKE '%español%'
          OR lower(languages) LIKE '%espanol%'
          OR lower(languages) LIKE '%castellano%'
          OR lower(languages) LIKE '%spanish%'
        )
        AND (
          lower(languages) LIKE '%inglés%'
          OR lower(languages) LIKE '%ingles%'
          OR lower(languages) LIKE '%english%'
        )
      )
    )
    AND (
      exclusivity_interest = false
      OR (
        (
          lower(languages) LIKE '%español%'
          OR lower(languages) LIKE '%espanol%'
          OR lower(languages) LIKE '%castellano%'
          OR lower(languages) LIKE '%spanish%'
        )
        AND (
          lower(languages) LIKE '%inglés%'
          OR lower(languages) LIKE '%ingles%'
          OR lower(languages) LIKE '%english%'
        )
        AND (
          lower(languages) LIKE '%alemán%'
          OR lower(languages) LIKE '%aleman%'
          OR lower(languages) LIKE '%german%'
          OR lower(languages) LIKE '%deutsch%'
        )
        AND (
          lower(languages) LIKE '%portugués%'
          OR lower(languages) LIKE '%portugues%'
          OR lower(languages) LIKE '%portuguese%'
        )
      )
    )
  ) NOT VALID;

CREATE INDEX IF NOT EXISTS partner_applications_membership_tier_idx
  ON public.partner_applications (membership_tier, created_at DESC);

COMMIT;
