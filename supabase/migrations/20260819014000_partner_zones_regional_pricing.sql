BEGIN;

ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS zone_slug text NOT NULL DEFAULT 'gran-asuncion',
  ADD COLUMN IF NOT EXISTS zone_name text NOT NULL DEFAULT 'Asunción, Central y Gran Asunción',
  ADD COLUMN IF NOT EXISTS zone_max_seats integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS exclusivity_price_usd integer NOT NULL DEFAULT 0;

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

  CASE NEW.zone_slug
    WHEN 'gran-asuncion' THEN
      NEW.zone_name := 'Asunción, Central y Gran Asunción';
      NEW.zone_max_seats := 5;
    WHEN 'itapua-encarnacion' THEN
      NEW.zone_name := 'Itapúa (Encarnación)';
      NEW.zone_max_seats := 3;
    WHEN 'ciudad-del-este' THEN
      NEW.zone_name := 'Ciudad del Este';
      NEW.zone_max_seats := 3;
    ELSE
      RAISE EXCEPTION 'Zona de partner no válida: %', NEW.zone_slug USING ERRCODE = '22023';
  END CASE;

  NEW.membership_price_usd := CASE
    WHEN NEW.membership_tier = 'D' THEN 0
    WHEN NEW.zone_slug = 'gran-asuncion' THEN
      CASE NEW.membership_tier
        WHEN 'A' THEN 2400
        WHEN 'B' THEN 1200
        WHEN 'C' THEN 600
        ELSE 0
      END
    ELSE
      CASE NEW.membership_tier
        WHEN 'A' THEN 1200
        WHEN 'B' THEN 600
        WHEN 'C' THEN 300
        ELSE 0
      END
  END;

  NEW.exclusivity_price_usd := CASE
    WHEN NEW.membership_tier = 'D' THEN 0
    WHEN NEW.zone_slug = 'gran-asuncion' THEN
      CASE NEW.membership_tier
        WHEN 'A' THEN 7500
        WHEN 'B' THEN 4500
        WHEN 'C' THEN 1500
        ELSE 0
      END
    ELSE NEW.membership_price_usd * 2
  END;

  IF NEW.membership_tier = 'D' THEN
    NEW.exclusivity_interest := false;
  END IF;

  RETURN NEW;
END;
$$;

-- Recalculate all existing applications. Historical rows remain in Gran Asunción by default.
UPDATE public.partner_applications
SET updated_at = updated_at;

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_zone_slug_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_zone_slug_check
  CHECK (zone_slug IN ('gran-asuncion', 'itapua-encarnacion', 'ciudad-del-este'));

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_zone_max_seats_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_zone_max_seats_check
  CHECK (
    (zone_slug = 'gran-asuncion' AND zone_max_seats = 5)
    OR (zone_slug IN ('itapua-encarnacion', 'ciudad-del-este') AND zone_max_seats = 3)
  );

-- Replace the old zone-agnostic price constraint introduced by the membership migration.
ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_membership_price_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_membership_price_check
  CHECK (
    (membership_tier = 'D' AND membership_price_usd = 0)
    OR (
      zone_slug = 'gran-asuncion'
      AND (
        (membership_tier = 'A' AND membership_price_usd = 2400)
        OR (membership_tier = 'B' AND membership_price_usd = 1200)
        OR (membership_tier = 'C' AND membership_price_usd = 600)
      )
    )
    OR (
      zone_slug IN ('itapua-encarnacion', 'ciudad-del-este')
      AND (
        (membership_tier = 'A' AND membership_price_usd = 1200)
        OR (membership_tier = 'B' AND membership_price_usd = 600)
        OR (membership_tier = 'C' AND membership_price_usd = 300)
      )
    )
  );

ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_exclusivity_price_check;
ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_exclusivity_price_check
  CHECK (
    (membership_tier = 'D' AND exclusivity_price_usd = 0)
    OR (
      zone_slug = 'gran-asuncion'
      AND (
        (membership_tier = 'A' AND exclusivity_price_usd = 7500)
        OR (membership_tier = 'B' AND exclusivity_price_usd = 4500)
        OR (membership_tier = 'C' AND exclusivity_price_usd = 1500)
      )
    )
    OR (
      zone_slug IN ('itapua-encarnacion', 'ciudad-del-este')
      AND membership_tier IN ('A', 'B', 'C')
      AND exclusivity_price_usd = membership_price_usd * 2
    )
  );

-- A company may apply for the same rubro in more than one geographic zone.
DROP INDEX IF EXISTS public.partner_applications_email_category_unique;
CREATE UNIQUE INDEX IF NOT EXISTS partner_applications_email_category_zone_unique
  ON public.partner_applications (lower(email), category_slug, zone_slug);

CREATE INDEX IF NOT EXISTS partner_applications_zone_category_idx
  ON public.partner_applications (zone_slug, category_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS partner_applications_zone_status_idx
  ON public.partner_applications (zone_slug, status, created_at DESC);

COMMIT;
