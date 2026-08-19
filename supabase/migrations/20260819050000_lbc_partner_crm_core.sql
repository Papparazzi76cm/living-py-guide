BEGIN;

-- =============================================================
-- LBC PARTNER CRM · núcleo multi-tenant para todas las delegaciones
-- =============================================================

CREATE TABLE IF NOT EXISTS public.crm_delegation_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  market_slug text NOT NULL REFERENCES public.network_markets(slug) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('manager','staff')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, market_slug)
);

CREATE TABLE IF NOT EXISTS public.crm_partner_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid UNIQUE REFERENCES public.partner_applications(id) ON DELETE SET NULL,
  market_slug text NOT NULL REFERENCES public.network_markets(slug),
  zone_slug text NOT NULL,
  zone_name text NOT NULL,
  seat_limit integer NOT NULL DEFAULT 5 CHECK (seat_limit >= 1 AND seat_limit <= 50),
  category_slug text NOT NULL,
  category_name text NOT NULL,
  membership_tier text NOT NULL CHECK (membership_tier IN ('A','B','C','D')),
  company text NOT NULL,
  primary_contact_name text NOT NULL,
  primary_email text NOT NULL,
  whatsapp text,
  city text,
  website text,
  languages text,
  status text NOT NULL DEFAULT 'onboarding' CHECK (status IN ('onboarding','trial','active','suspended','ended')),
  exclusivity_requested boolean NOT NULL DEFAULT false,
  exclusivity_active boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_account_id uuid NOT NULL REFERENCES public.crm_partner_accounts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'sales' CHECK (role IN ('owner','manager','sales')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_account_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.crm_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_account_id uuid NOT NULL REFERENCES public.crm_partner_accounts(id) ON DELETE CASCADE,
  membership_tier text NOT NULL CHECK (membership_tier IN ('A','B','C','D')),
  amount_usd numeric(12,2) NOT NULL DEFAULT 0 CHECK (amount_usd >= 0),
  exclusivity_amount_usd numeric(12,2) NOT NULL DEFAULT 0 CHECK (exclusivity_amount_usd >= 0),
  currency_code text NOT NULL DEFAULT 'USD',
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
  guarantee_until timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','refunded','expired','cancelled')),
  payment_reference text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_slug text NOT NULL REFERENCES public.network_markets(slug),
  zone_slug text NOT NULL,
  category_slug text NOT NULL,
  category_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text,
  contact_whatsapp text,
  nationality text,
  city text,
  source text NOT NULL DEFAULT 'manual',
  source_ref text,
  need_summary text NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','qualified','assigned','in_progress','won','lost','closed')),
  estimated_value numeric(14,2) NOT NULL DEFAULT 0 CHECK (estimated_value >= 0),
  actual_value numeric(14,2) NOT NULL DEFAULT 0 CHECK (actual_value >= 0),
  currency_code text NOT NULL DEFAULT 'USD',
  consent_privacy boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_lead_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  partner_account_id uuid NOT NULL REFERENCES public.crm_partner_accounts(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned','accepted','contacted','proposal','won','lost','declined')),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  response_due_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  first_response_at timestamptz,
  last_contact_at timestamptz,
  follow_up_due_at timestamptz,
  closed_at timestamptz,
  estimated_value numeric(14,2) NOT NULL DEFAULT 0 CHECK (estimated_value >= 0),
  won_value numeric(14,2) NOT NULL DEFAULT 0 CHECK (won_value >= 0),
  currency_code text NOT NULL DEFAULT 'USD',
  lost_reason text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, partner_account_id)
);

CREATE TABLE IF NOT EXISTS public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.crm_lead_assignments(id) ON DELETE CASCADE,
  partner_account_id uuid REFERENCES public.crm_partner_accounts(id) ON DELETE CASCADE,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('call','whatsapp','email','meeting','note','proposal','status_change')),
  body text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  next_action_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.crm_lead_assignments(id) ON DELETE CASCADE,
  partner_account_id uuid NOT NULL REFERENCES public.crm_partner_accounts(id) ON DELETE CASCADE,
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_at timestamptz NOT NULL,
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.crm_lead_assignments(id) ON DELETE SET NULL,
  partner_account_id uuid REFERENCES public.crm_partner_accounts(id) ON DELETE SET NULL,
  score integer CHECK (score BETWEEN 1 AND 5),
  nps integer CHECK (nps BETWEEN 0 AND 10),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------
-- Índices operativos
-- ----------------------------
CREATE INDEX IF NOT EXISTS crm_delegation_users_market_idx ON public.crm_delegation_users (market_slug, active);
CREATE INDEX IF NOT EXISTS crm_partner_accounts_market_zone_idx ON public.crm_partner_accounts (market_slug, zone_slug, status);
CREATE INDEX IF NOT EXISTS crm_partner_accounts_category_idx ON public.crm_partner_accounts (market_slug, zone_slug, category_slug, status);
CREATE INDEX IF NOT EXISTS crm_partner_accounts_email_idx ON public.crm_partner_accounts (lower(primary_email));
CREATE INDEX IF NOT EXISTS crm_partner_users_user_idx ON public.crm_partner_users (user_id, active);
CREATE INDEX IF NOT EXISTS crm_memberships_partner_idx ON public.crm_memberships (partner_account_id, starts_at DESC);
CREATE INDEX IF NOT EXISTS crm_leads_market_status_idx ON public.crm_leads (market_slug, status, created_at DESC);
CREATE INDEX IF NOT EXISTS crm_leads_category_zone_idx ON public.crm_leads (market_slug, zone_slug, category_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS crm_assignments_partner_status_idx ON public.crm_lead_assignments (partner_account_id, status, assigned_at DESC);
CREATE INDEX IF NOT EXISTS crm_assignments_sla_idx ON public.crm_lead_assignments (response_due_at) WHERE first_response_at IS NULL;
CREATE INDEX IF NOT EXISTS crm_activities_lead_idx ON public.crm_activities (lead_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS crm_tasks_due_idx ON public.crm_tasks (partner_account_id, status, due_at);
CREATE INDEX IF NOT EXISTS crm_feedback_partner_idx ON public.crm_feedback (partner_account_id, created_at DESC);

-- ----------------------------
-- updated_at
-- ----------------------------
DROP TRIGGER IF EXISTS crm_delegation_users_set_updated_at ON public.crm_delegation_users;
CREATE TRIGGER crm_delegation_users_set_updated_at BEFORE UPDATE ON public.crm_delegation_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_partner_accounts_set_updated_at ON public.crm_partner_accounts;
CREATE TRIGGER crm_partner_accounts_set_updated_at BEFORE UPDATE ON public.crm_partner_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_partner_users_set_updated_at ON public.crm_partner_users;
CREATE TRIGGER crm_partner_users_set_updated_at BEFORE UPDATE ON public.crm_partner_users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_memberships_set_updated_at ON public.crm_memberships;
CREATE TRIGGER crm_memberships_set_updated_at BEFORE UPDATE ON public.crm_memberships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_leads_set_updated_at ON public.crm_leads;
CREATE TRIGGER crm_leads_set_updated_at BEFORE UPDATE ON public.crm_leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_lead_assignments_set_updated_at ON public.crm_lead_assignments;
CREATE TRIGGER crm_lead_assignments_set_updated_at BEFORE UPDATE ON public.crm_lead_assignments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS crm_tasks_set_updated_at ON public.crm_tasks;
CREATE TRIGGER crm_tasks_set_updated_at BEFORE UPDATE ON public.crm_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------
-- Helpers de autorización
-- ----------------------------
CREATE OR REPLACE FUNCTION public.crm_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

CREATE OR REPLACE FUNCTION public.crm_manages_market(_market_slug text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.crm_is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.crm_delegation_users du
      WHERE du.user_id = auth.uid()
        AND du.market_slug = _market_slug
        AND du.active = true
        AND du.role IN ('manager','staff')
    );
$$;

CREATE OR REPLACE FUNCTION public.crm_has_partner_access(_partner_account_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.crm_is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.crm_partner_users pu
      WHERE pu.user_id = auth.uid()
        AND pu.partner_account_id = _partner_account_id
        AND pu.active = true
    )
    OR EXISTS (
      SELECT 1
      FROM public.crm_partner_accounts pa
      WHERE pa.id = _partner_account_id
        AND public.crm_manages_market(pa.market_slug)
    );
$$;

GRANT EXECUTE ON FUNCTION public.crm_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_manages_market(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crm_has_partner_access(uuid) TO authenticated;

-- ----------------------------
-- Capacidad y exclusividad reales por rubro/territorio
-- ----------------------------
CREATE OR REPLACE FUNCTION public.crm_validate_partner_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  active_count integer;
  exclusive_count integer;
BEGIN
  IF NEW.membership_tier = 'D' THEN
    NEW.exclusivity_requested := false;
    NEW.exclusivity_active := false;
    RETURN NEW;
  END IF;

  IF NEW.status NOT IN ('trial','active') THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO exclusive_count
  FROM public.crm_partner_accounts pa
  WHERE pa.market_slug = NEW.market_slug
    AND pa.zone_slug = NEW.zone_slug
    AND pa.category_slug = NEW.category_slug
    AND pa.status IN ('trial','active')
    AND pa.exclusivity_active = true
    AND pa.id IS DISTINCT FROM NEW.id;

  IF exclusive_count > 0 THEN
    RAISE EXCEPTION 'Rubro bloqueado en exclusividad para esta zona' USING ERRCODE = '23514';
  END IF;

  SELECT count(*) INTO active_count
  FROM public.crm_partner_accounts pa
  WHERE pa.market_slug = NEW.market_slug
    AND pa.zone_slug = NEW.zone_slug
    AND pa.category_slug = NEW.category_slug
    AND pa.status IN ('trial','active')
    AND pa.id IS DISTINCT FROM NEW.id;

  IF NEW.exclusivity_active AND active_count > 0 THEN
    RAISE EXCEPTION 'No puede activarse exclusividad mientras existan otros miembros activos en el rubro' USING ERRCODE = '23514';
  END IF;

  IF NOT NEW.exclusivity_active AND active_count >= NEW.seat_limit THEN
    RAISE EXCEPTION 'Se alcanzó el máximo de empresas para este rubro y zona' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_partner_accounts_capacity_guard ON public.crm_partner_accounts;
CREATE TRIGGER crm_partner_accounts_capacity_guard
BEFORE INSERT OR UPDATE OF market_slug, zone_slug, category_slug, membership_tier, status, exclusivity_active, seat_limit
ON public.crm_partner_accounts
FOR EACH ROW EXECUTE FUNCTION public.crm_validate_partner_capacity();

-- ----------------------------
-- Activación desde una postulación ya captada en la web
-- ----------------------------
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

  IF NOT public.crm_manages_market(app.market_slug) THEN
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

  IF NOT EXISTS (
    SELECT 1 FROM public.crm_memberships m WHERE m.partner_account_id = partner_id
  ) THEN
    INSERT INTO public.crm_memberships (
      partner_account_id, membership_tier, amount_usd, exclusivity_amount_usd,
      currency_code, starts_at, ends_at, guarantee_until, status
    ) VALUES (
      partner_id,
      app.membership_tier,
      app.membership_price_usd,
      CASE WHEN app.exclusivity_interest THEN app.exclusivity_price_usd ELSE 0 END,
      'USD',
      now(),
      now() + interval '1 year',
      CASE WHEN app.membership_tier = 'D' THEN NULL ELSE now() + interval '30 days' END,
      'active'
    );
  END IF;

  UPDATE public.partner_applications
  SET status = 'approved', updated_at = now()
  WHERE id = app.id;

  RETURN partner_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.crm_activate_partner_application(uuid) TO authenticated;

-- El partner puede reclamar automáticamente el acceso usando el mismo email
-- con el que fue admitido, evitando gestión manual de UUID de auth.
CREATE OR REPLACE FUNCTION public.crm_claim_partner_access()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_email text;
  inserted_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Autenticación requerida' USING ERRCODE = '42501';
  END IF;

  current_email := lower(coalesce(auth.jwt() ->> 'email', ''));
  IF current_email = '' THEN
    RETURN 0;
  END IF;

  INSERT INTO public.crm_partner_users (partner_account_id, user_id, role, active)
  SELECT pa.id, auth.uid(), 'owner', true
  FROM public.crm_partner_accounts pa
  WHERE lower(pa.primary_email) = current_email
    AND pa.status IN ('onboarding','trial','active','suspended')
  ON CONFLICT (partner_account_id, user_id) DO UPDATE SET active = true, updated_at = now();

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.crm_claim_partner_access() TO authenticated;

-- ----------------------------
-- Automatizaciones operativas
-- ----------------------------
CREATE OR REPLACE FUNCTION public.crm_mark_first_response()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.assignment_id IS NOT NULL
     AND NEW.activity_type IN ('call','whatsapp','email','meeting','proposal') THEN
    UPDATE public.crm_lead_assignments
    SET first_response_at = COALESCE(first_response_at, NEW.occurred_at),
        last_contact_at = NEW.occurred_at,
        status = CASE WHEN status IN ('assigned','accepted') THEN 'contacted' ELSE status END,
        updated_at = now()
    WHERE id = NEW.assignment_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_activities_mark_first_response ON public.crm_activities;
CREATE TRIGGER crm_activities_mark_first_response
AFTER INSERT ON public.crm_activities
FOR EACH ROW EXECUTE FUNCTION public.crm_mark_first_response();

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
  lead_uuid := COALESCE(NEW.lead_id, OLD.lead_id);

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

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS crm_assignments_sync_lead_status ON public.crm_lead_assignments;
CREATE TRIGGER crm_assignments_sync_lead_status
AFTER INSERT OR UPDATE OF status, won_value OR DELETE ON public.crm_lead_assignments
FOR EACH ROW EXECUTE FUNCTION public.crm_sync_lead_status();

-- ----------------------------
-- RLS multi-tenant
-- ----------------------------
ALTER TABLE public.crm_delegation_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_partner_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_partner_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM delegation users can read own market memberships"
ON public.crm_delegation_users FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.crm_manages_market(market_slug));
CREATE POLICY "CRM managers can manage delegation users"
ON public.crm_delegation_users FOR ALL TO authenticated
USING (public.crm_manages_market(market_slug))
WITH CHECK (public.crm_manages_market(market_slug));

CREATE POLICY "CRM users can read accessible partner accounts"
ON public.crm_partner_accounts FOR SELECT TO authenticated
USING (public.crm_manages_market(market_slug) OR public.crm_has_partner_access(id));
CREATE POLICY "CRM managers can manage partner accounts"
ON public.crm_partner_accounts FOR ALL TO authenticated
USING (public.crm_manages_market(market_slug))
WITH CHECK (public.crm_manages_market(market_slug));

CREATE POLICY "CRM users can read partner user roster"
ON public.crm_partner_users FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.crm_has_partner_access(partner_account_id));
CREATE POLICY "CRM managers can manage partner users"
ON public.crm_partner_users FOR ALL TO authenticated
USING (public.crm_has_partner_access(partner_account_id))
WITH CHECK (public.crm_has_partner_access(partner_account_id));

CREATE POLICY "CRM users can read memberships"
ON public.crm_memberships FOR SELECT TO authenticated
USING (public.crm_has_partner_access(partner_account_id));
CREATE POLICY "CRM managers can manage memberships"
ON public.crm_memberships FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_partner_accounts pa
  WHERE pa.id = partner_account_id AND public.crm_manages_market(pa.market_slug)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_partner_accounts pa
  WHERE pa.id = partner_account_id AND public.crm_manages_market(pa.market_slug)
));

CREATE POLICY "CRM users can read scoped leads"
ON public.crm_leads FOR SELECT TO authenticated
USING (
  public.crm_manages_market(market_slug)
  OR EXISTS (
    SELECT 1 FROM public.crm_lead_assignments a
    WHERE a.lead_id = id AND public.crm_has_partner_access(a.partner_account_id)
  )
);
CREATE POLICY "CRM managers can create leads"
ON public.crm_leads FOR INSERT TO authenticated
WITH CHECK (public.crm_manages_market(market_slug));
CREATE POLICY "CRM managers can update leads"
ON public.crm_leads FOR UPDATE TO authenticated
USING (public.crm_manages_market(market_slug))
WITH CHECK (public.crm_manages_market(market_slug));
CREATE POLICY "CRM managers can delete leads"
ON public.crm_leads FOR DELETE TO authenticated
USING (public.crm_manages_market(market_slug));

CREATE POLICY "CRM users can read scoped assignments"
ON public.crm_lead_assignments FOR SELECT TO authenticated
USING (
  public.crm_has_partner_access(partner_account_id)
  OR EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
);
CREATE POLICY "CRM managers can assign leads"
ON public.crm_lead_assignments FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
));
CREATE POLICY "CRM users can update scoped assignments"
ON public.crm_lead_assignments FOR UPDATE TO authenticated
USING (
  public.crm_has_partner_access(partner_account_id)
  OR EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
)
WITH CHECK (
  public.crm_has_partner_access(partner_account_id)
  OR EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
);
CREATE POLICY "CRM managers can delete assignments"
ON public.crm_lead_assignments FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
));

CREATE POLICY "CRM users can read activities"
ON public.crm_activities FOR SELECT TO authenticated
USING (
  (partner_account_id IS NOT NULL AND public.crm_has_partner_access(partner_account_id))
  OR EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
);
CREATE POLICY "CRM users can create activities"
ON public.crm_activities FOR INSERT TO authenticated
WITH CHECK (
  actor_user_id = auth.uid()
  AND (
    (partner_account_id IS NOT NULL AND public.crm_has_partner_access(partner_account_id))
    OR EXISTS (
      SELECT 1 FROM public.crm_leads l
      WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
    )
  )
);
CREATE POLICY "CRM users can update own activities"
ON public.crm_activities FOR UPDATE TO authenticated
USING (actor_user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
));
CREATE POLICY "CRM users can delete own activities"
ON public.crm_activities FOR DELETE TO authenticated
USING (actor_user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
));

CREATE POLICY "CRM users can read tasks"
ON public.crm_tasks FOR SELECT TO authenticated
USING (public.crm_has_partner_access(partner_account_id));
CREATE POLICY "CRM users can create tasks"
ON public.crm_tasks FOR INSERT TO authenticated
WITH CHECK (public.crm_has_partner_access(partner_account_id));
CREATE POLICY "CRM users can update tasks"
ON public.crm_tasks FOR UPDATE TO authenticated
USING (public.crm_has_partner_access(partner_account_id))
WITH CHECK (public.crm_has_partner_access(partner_account_id));
CREATE POLICY "CRM users can delete tasks"
ON public.crm_tasks FOR DELETE TO authenticated
USING (public.crm_has_partner_access(partner_account_id));

CREATE POLICY "CRM users can read feedback"
ON public.crm_feedback FOR SELECT TO authenticated
USING (
  (partner_account_id IS NOT NULL AND public.crm_has_partner_access(partner_account_id))
  OR EXISTS (
    SELECT 1 FROM public.crm_leads l
    WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
  )
);
CREATE POLICY "CRM managers can manage feedback"
ON public.crm_feedback FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.crm_leads l
  WHERE l.id = lead_id AND public.crm_manages_market(l.market_slug)
));

-- Las delegaciones pueden revisar y aprobar candidaturas de su propio mercado.
DROP POLICY IF EXISTS "CRM delegation managers can view partner applications" ON public.partner_applications;
CREATE POLICY "CRM delegation managers can view partner applications"
ON public.partner_applications FOR SELECT TO authenticated
USING (public.crm_manages_market(market_slug));
DROP POLICY IF EXISTS "CRM delegation managers can update partner applications" ON public.partner_applications;
CREATE POLICY "CRM delegation managers can update partner applications"
ON public.partner_applications FOR UPDATE TO authenticated
USING (public.crm_manages_market(market_slug))
WITH CHECK (public.crm_manages_market(market_slug));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_delegation_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_partner_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_partner_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_lead_assignments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_activities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_feedback TO authenticated;

COMMIT;
