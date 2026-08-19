BEGIN;

-- Web, IA y tecnología queda bloqueada en exclusividad únicamente en Gran Asunción.
-- NOT VALID conserva cualquier registro histórico anterior, pero impide nuevas
-- inserciones o actualizaciones que intenten postular a este rubro en esa zona.
ALTER TABLE public.partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_tecnologia_ia_gran_asuncion_exclusive_check;

ALTER TABLE public.partner_applications
  ADD CONSTRAINT partner_applications_tecnologia_ia_gran_asuncion_exclusive_check
  CHECK (
    NOT (
      zone_slug = 'gran-asuncion'
      AND category_slug = 'tecnologia-ia'
    )
  ) NOT VALID;

COMMIT;
