BEGIN;

-- Separación entre acceso operativo de delegación y gestión estructural.
CREATE OR REPLACE FUNCTION public.crm_is_market_manager(_market_slug text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.crm_is_admin()
    OR EXISTS (
      SELECT 1 FROM public.crm_delegation_users du
      WHERE du.user_id = auth.uid()
        AND du.market_slug = _market_slug
        AND du.active = true
        AND du.role = 'manager'
    );
$$;

CREATE OR REPLACE FUNCTION public.crm_can_manage_partner(_partner_account_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
      SELECT 1 FROM public.crm_partner_accounts pa
      WHERE pa.id = _partner_account_id
        AND public.crm_is_market_manager(pa.market_slug)
    )
    OR EXISTS (
      SELECT 1 FROM public.crm_partner_users pu
      WHERE pu.partner_account_id = _partner_account_id
        AND pu.user_id = auth.uid()
        AND pu.active = true
        AND pu.role IN ('owner','manager')
    );
$$;

GRANT EXECUTE ON FUNCTION public.crm_is_market_manager(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_can_manage_partner(uuid) TO authenticated;

DROP POLICY IF EXISTS "CRM managers can manage delegation users" ON public.crm_delegation_users;
CREATE POLICY "CRM market managers can manage delegation users"
ON public.crm_delegation_users FOR ALL TO authenticated
USING (public.crm_is_market_manager(market_slug))
WITH CHECK (public.crm_is_market_manager(market_slug));

DROP POLICY IF EXISTS "CRM managers can manage partner accounts" ON public.crm_partner_accounts;
CREATE POLICY "CRM market managers can manage partner accounts"
ON public.crm_partner_accounts FOR ALL TO authenticated
USING (public.crm_is_market_manager(market_slug))
WITH CHECK (public.crm_is_market_manager(market_slug));

DROP POLICY IF EXISTS "CRM managers can manage partner users" ON public.crm_partner_users;
CREATE POLICY "CRM partner owners and market managers can manage partner users"
ON public.crm_partner_users FOR ALL TO authenticated
USING (public.crm_can_manage_partner(partner_account_id))
WITH CHECK (public.crm_can_manage_partner(partner_account_id));

DROP POLICY IF EXISTS "CRM managers can manage memberships" ON public.crm_memberships;
CREATE POLICY "CRM market managers can manage memberships"
ON public.crm_memberships FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_partner_accounts pa
  WHERE pa.id = partner_account_id AND public.crm_is_market_manager(pa.market_slug)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_partner_accounts pa
  WHERE pa.id = partner_account_id AND public.crm_is_market_manager(pa.market_slug)
));

-- Activar una candidatura es una decisión comercial de manager, no de staff.
CREATE OR REPLACE FUNCTION public.crm_activate_partner_application(_application_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app public.partner_applications%ROWTYPE;
  partner_id uuid;
BEGIN
  SELECT * INTO app FROM public.partner_applications WHERE id = _application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Postulación no encontrada' USING ERRCODE = 'P0002';
  END IF;

  IF NOT public.crm_is_market_manager(app.market_slug) THEN
    RAISE EXCEPTION 'Sin permisos para activar partners en este mercado' USING ERRCODE = '42501';
  END IF;

  IF app.status IN ('rejected','withdrawn') THEN
    RAISE EXCEPTION 'No se puede activar una postulación rechazada o retirada' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.crm_partner_accounts (
    application_id, market_slug, zone_slug, zone_name, seat_limit,
    category_slug, category_name, membership_tier, company,
    primary_contact_name, primary_email, whatsapp, city, website, languages,
    status, exclusivity_requested, exclusivity_active, joined_at
  ) VALUES (
    app.id, app.market_slug, app.zone_slug, app.zone_name, app.zone_max_seats,
    app.category_slug, app.category_name, app.membership_tier, app.company,
    app.name, app.email, app.whatsapp, app.city, app.website, app.languages,
    'trial', app.exclusivity_interest, false, now()
  )
  ON CONFLICT (application_id) DO UPDATE SET
    company = EXCLUDED.company,
    primary_contact_name = EXCLUDED.primary_contact_name,
    primary_email = EXCLUDED.primary_email,
    whatsapp = EXCLUDED.whatsapp,
    website = EXCLUDED.website,
    languages = EXCLUDED.languages,
    updated_at = now()
  RETURNING id INTO partner_id;

  IF NOT EXISTS (SELECT 1 FROM public.crm_memberships m WHERE m.partner_account_id = partner_id) THEN
    INSERT INTO public.crm_memberships (
      partner_account_id, membership_tier, amount_usd, exclusivity_amount_usd,
      currency_code, starts_at, ends_at, guarantee_until, status
    ) VALUES (
      partner_id, app.membership_tier, app.membership_price_usd,
      CASE WHEN app.exclusivity_interest THEN app.exclusivity_price_usd ELSE 0 END,
      'USD', now(), now() + interval '1 year',
      CASE WHEN app.membership_tier = 'D' THEN NULL ELSE now() + interval '30 days' END,
      'active'
    );
  END IF;

  UPDATE public.partner_applications SET status = 'approved', updated_at = now() WHERE id = app.id;
  RETURN partner_id;
END;
$$;

-- Un lead solo puede asignarse a un partner del mismo mercado, territorio y rubro.
CREATE OR REPLACE FUNCTION public.crm_validate_assignment_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  lead_row public.crm_leads%ROWTYPE;
  partner_row public.crm_partner_accounts%ROWTYPE;
BEGIN
  SELECT * INTO lead_row FROM public.crm_leads WHERE id = NEW.lead_id;
  SELECT * INTO partner_row FROM public.crm_partner_accounts WHERE id = NEW.partner_account_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead o partner no válido' USING ERRCODE = '23503';
  END IF;

  IF lead_row.market_slug <> partner_row.market_slug
     OR lead_row.zone_slug <> partner_row.zone_slug
     OR lead_row.category_slug <> partner_row.category_slug THEN
    RAISE EXCEPTION 'El lead no coincide con el mercado, zona y rubro del partner' USING ERRCODE = '23514';
  END IF;

  IF partner_row.status NOT IN ('trial','active') THEN
    RAISE EXCEPTION 'El partner no está habilitado para recibir leads' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_assignments_scope_guard ON public.crm_lead_assignments;
CREATE TRIGGER crm_assignments_scope_guard
BEFORE INSERT OR UPDATE OF lead_id, partner_account_id
ON public.crm_lead_assignments
FOR EACH ROW EXECUTE FUNCTION public.crm_validate_assignment_scope();

-- Un partner puede trabajar el pipeline, pero no reasignar el lead ni alterar su SLA estructural.
CREATE OR REPLACE FUNCTION public.crm_guard_assignment_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  lead_market text;
BEGIN
  SELECT market_slug INTO lead_market FROM public.crm_leads WHERE id = OLD.lead_id;
  IF public.crm_manages_market(lead_market) THEN
    RETURN NEW;
  END IF;

  IF NEW.lead_id IS DISTINCT FROM OLD.lead_id
     OR NEW.partner_account_id IS DISTINCT FROM OLD.partner_account_id
     OR NEW.assigned_by IS DISTINCT FROM OLD.assigned_by
     OR NEW.assigned_at IS DISTINCT FROM OLD.assigned_at
     OR NEW.response_due_at IS DISTINCT FROM OLD.response_due_at THEN
    RAISE EXCEPTION 'El partner no puede modificar la asignación estructural del lead' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_assignments_update_guard ON public.crm_lead_assignments;
CREATE TRIGGER crm_assignments_update_guard
BEFORE UPDATE ON public.crm_lead_assignments
FOR EACH ROW EXECUTE FUNCTION public.crm_guard_assignment_update();

-- Actividades de partner obligatoriamente vinculadas a una asignación propia.
CREATE OR REPLACE FUNCTION public.crm_validate_activity_scope()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  assignment_row public.crm_lead_assignments%ROWTYPE;
  lead_market text;
BEGIN
  SELECT market_slug INTO lead_market FROM public.crm_leads WHERE id = NEW.lead_id;
  IF public.crm_manages_market(lead_market) THEN
    RETURN NEW;
  END IF;

  IF NEW.assignment_id IS NULL OR NEW.partner_account_id IS NULL THEN
    RAISE EXCEPTION 'La actividad del partner debe estar vinculada a una asignación' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO assignment_row FROM public.crm_lead_assignments WHERE id = NEW.assignment_id;
  IF NOT FOUND
     OR assignment_row.lead_id <> NEW.lead_id
     OR assignment_row.partner_account_id <> NEW.partner_account_id
     OR NOT public.crm_has_partner_access(NEW.partner_account_id) THEN
    RAISE EXCEPTION 'Actividad fuera del ámbito autorizado' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_activities_scope_guard ON public.crm_activities;
CREATE TRIGGER crm_activities_scope_guard
BEFORE INSERT OR UPDATE OF lead_id, assignment_id, partner_account_id
ON public.crm_activities
FOR EACH ROW EXECUTE FUNCTION public.crm_validate_activity_scope();

DROP POLICY IF EXISTS "CRM users can read activities" ON public.crm_activities;
CREATE POLICY "CRM users can read scoped activities"
ON public.crm_activities FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
  OR EXISTS (
    SELECT 1 FROM public.crm_lead_assignments a
    WHERE a.id = assignment_id
      AND a.lead_id = lead_id
      AND a.partner_account_id = partner_account_id
      AND public.crm_has_partner_access(a.partner_account_id)
  )
);

DROP POLICY IF EXISTS "CRM users can create activities" ON public.crm_activities;
CREATE POLICY "CRM users can create scoped activities"
ON public.crm_activities FOR INSERT TO authenticated
WITH CHECK (
  actor_user_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.crm_leads l
      WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
    )
    OR EXISTS (
      SELECT 1 FROM public.crm_lead_assignments a
      WHERE a.id = assignment_id
        AND a.lead_id = lead_id
        AND a.partner_account_id = partner_account_id
        AND public.crm_has_partner_access(a.partner_account_id)
    )
  )
);

-- Sincronización robusta del estado global del lead.
CREATE OR REPLACE FUNCTION public.crm_sync_lead_status()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  lead_uuid uuid;
  total_assignments integer;
  won_assignments integer;
  active_assignments integer;
  finished_assignments integer;
  total_won numeric(14,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    lead_uuid := OLD.lead_id;
  ELSE
    lead_uuid := NEW.lead_id;
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE status = 'won'),
    count(*) FILTER (WHERE status IN ('assigned','accepted','contacted','proposal')),
    count(*) FILTER (WHERE status IN ('won','lost','declined')),
    coalesce(sum(won_value) FILTER (WHERE status = 'won'), 0)
  INTO total_assignments, won_assignments, active_assignments, finished_assignments, total_won
  FROM public.crm_lead_assignments
  WHERE lead_id = lead_uuid;

  UPDATE public.crm_leads
  SET status = CASE
        WHEN won_assignments > 0 THEN 'won'
        WHEN total_assignments > 0 AND finished_assignments = total_assignments THEN 'lost'
        WHEN active_assignments > 0 THEN 'in_progress'
        WHEN total_assignments > 0 THEN 'assigned'
        ELSE 'qualified'
      END,
      actual_value = total_won,
      updated_at = now()
  WHERE id = lead_uuid;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

COMMIT;
