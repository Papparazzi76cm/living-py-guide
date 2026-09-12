BEGIN;

-- Operational layer for the expatriate services marketplace.
-- The previous migration owns the quotation arithmetic; this migration adds
-- execution, communications, reviews and Stripe Connect readiness.

ALTER TABLE public.marketplace_providers
  ADD COLUMN avatar_url text CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 1000),
  ADD COLUMN website text CHECK (website IS NULL OR char_length(website) <= 500),
  ADD COLUMN whatsapp text CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 50),
  ADD COLUMN stripe_account_id text UNIQUE CHECK (stripe_account_id IS NULL OR stripe_account_id ~ '^acct_'),
  ADD COLUMN stripe_onboarding_status text NOT NULL DEFAULT 'not_started'
    CHECK (stripe_onboarding_status IN ('not_started','pending','ready','restricted')),
  ADD COLUMN payouts_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN verified_at timestamptz;

ALTER TABLE public.marketplace_services
  ADD COLUMN price_type text NOT NULL DEFAULT 'quote' CHECK (price_type IN ('fixed','from','quote')),
  ADD COLUMN delivery_mode text NOT NULL DEFAULT 'hybrid' CHECK (delivery_mode IN ('online','onsite','hybrid')),
  ADD COLUMN duration_minutes integer CHECK (duration_minutes IS NULL OR duration_minutes BETWEEN 15 AND 10080),
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.marketplace_requests DROP CONSTRAINT marketplace_requests_status_check;
ALTER TABLE public.marketplace_requests
  ADD CONSTRAINT marketplace_requests_status_check CHECK (status IN (
    'requested','quoted','accepted','payment_pending','paid','in_progress','completed',
    'declined','cancelled','disputed','refunded'
  ));

ALTER TABLE public.marketplace_requests
  ADD COLUMN preferred_date date,
  ADD COLUMN scheduled_at timestamptz,
  ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('not_required','unpaid','processing','paid','refunded','failed')),
  ADD COLUMN stripe_checkout_session_id text UNIQUE,
  ADD COLUMN stripe_payment_intent_id text UNIQUE,
  ADD COLUMN paid_at timestamptz,
  ADD COLUMN completed_at timestamptz,
  ADD COLUMN cancelled_at timestamptz;

CREATE INDEX marketplace_requests_status_idx ON public.marketplace_requests(status, created_at DESC);
CREATE INDEX marketplace_requests_payment_idx ON public.marketplace_requests(payment_status, created_at DESC);

-- Every category can transact at launch. High-ticket categories use a lower rate;
-- operational / concierge categories carry a higher rate. The accepted quote
-- snapshots this rate, so later commercial changes never rewrite old orders.
UPDATE public.marketplace_categories AS category
SET commission_percent = rates.percent
FROM (VALUES
  ('residencia-migraciones', 12::numeric),
  ('legal-corporativo', 10::numeric),
  ('contabilidad-impuestos', 10::numeric),
  ('inmobiliaria', 8::numeric),
  ('banca-fintech', 8::numeric),
  ('seguros', 10::numeric),
  ('salud-privada', 8::numeric),
  ('colegios-internacionales', 8::numeric),
  ('constitucion-empresas', 12::numeric),
  ('relocation', 12::numeric),
  ('vehiculos', 8::numeric),
  ('telecom-internet', 12::numeric),
  ('mudanzas-logistica', 12::numeric),
  ('arquitectos', 10::numeric),
  ('construccion-reformas', 8::numeric),
  ('eventos', 12::numeric),
  ('guarderia-cuidadores-infantiles', 12::numeric),
  ('cuidado-mayores', 12::numeric),
  ('manitas-24-horas', 15::numeric),
  ('veterinaria', 12::numeric),
  ('cuidado-mascotas', 15::numeric),
  ('chefs-domicilio', 15::numeric),
  ('servicios-hogar', 15::numeric),
  ('traduccion', 15::numeric),
  ('marketing', 12::numeric),
  ('tecnologia-ia', 12::numeric),
  ('recursos-humanos', 12::numeric),
  ('viajes', 12::numeric),
  ('hospitalidad-lifestyle', 15::numeric)
) AS rates(slug, percent)
WHERE category.slug = rates.slug;

CREATE OR REPLACE FUNCTION public.marketplace_guard_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  is_admin boolean := coalesce(public.has_role(auth.uid(), 'admin'::public.app_role), false);
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
BEGIN
  IF NEW.id <> OLD.id OR NEW.user_id <> OLD.user_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Provider identity is immutable' USING ERRCODE = '42501';
  END IF;

  IF NOT (is_admin OR is_service) THEN
    NEW.status := OLD.status;
    NEW.stripe_account_id := OLD.stripe_account_id;
    NEW.stripe_onboarding_status := OLD.stripe_onboarding_status;
    NEW.payouts_enabled := OLD.payouts_enabled;
    NEW.verified_at := OLD.verified_at;
  ELSIF NEW.status = 'approved' AND NEW.verified_at IS NULL THEN
    NEW.verified_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.marketplace_guard_service()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.id <> OLD.id OR NEW.provider_id <> OLD.provider_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Service identity is immutable' USING ERRCODE = '42501';
  END IF;
  NEW.updated_at := now();
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) AND NEW.status = 'published' THEN
    NEW.status := CASE WHEN OLD.status = 'published' THEN 'pending' ELSE 'pending' END;
  END IF;
  IF NEW.status = 'published' AND NOT EXISTS (
    SELECT 1 FROM public.marketplace_providers WHERE id = NEW.provider_id AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Approve provider before publishing' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.marketplace_guard_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  offering public.marketplace_services%ROWTYPE;
  is_provider boolean := false;
  is_admin boolean := coalesce(public.has_role(auth.uid(), 'admin'::public.app_role), false);
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
    SELECT * INTO offering FROM public.marketplace_services WHERE id = NEW.service_id AND status = 'published';
    IF NOT FOUND OR NOT EXISTS (
      SELECT 1 FROM public.marketplace_providers
      WHERE id = offering.provider_id AND status = 'approved' AND user_id <> auth.uid()
    ) THEN
      RAISE EXCEPTION 'Service unavailable' USING ERRCODE = '23514';
    END IF;
    NEW.customer_id := auth.uid();
    NEW.provider_id := offering.provider_id;
    NEW.service_title := offering.title;
    NEW.category_slug := offering.category_slug;
    NEW.currency := offering.currency;
    NEW.quote_version := 0;
    NEW.status := 'requested';
    NEW.fee := NULL;
    NEW.taxes := 0;
    NEW.expenses := 0;
    NEW.commission_percent := NULL;
    NEW.quote_terms := '';
    NEW.quote_expires_at := NULL;
    NEW.accepted_at := NULL;
    NEW.scheduled_at := NULL;
    NEW.payment_status := 'unpaid';
    NEW.stripe_checkout_session_id := NULL;
    NEW.stripe_payment_intent_id := NULL;
    NEW.paid_at := NULL;
    NEW.completed_at := NULL;
    NEW.cancelled_at := NULL;
    NEW.created_at := now();
    RETURN NEW;
  END IF;

  IF ROW(NEW.id,NEW.service_id,NEW.provider_id,NEW.customer_id,NEW.service_title,NEW.category_slug,NEW.currency,NEW.city,NEW.language,NEW.details,NEW.preferred_date,NEW.created_at)
     IS DISTINCT FROM ROW(OLD.id,OLD.service_id,OLD.provider_id,OLD.customer_id,OLD.service_title,OLD.category_slug,OLD.currency,OLD.city,OLD.language,OLD.details,OLD.preferred_date,OLD.created_at) THEN
    RAISE EXCEPTION 'Request identity and original details are immutable' USING ERRCODE = '42501';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.marketplace_providers
    WHERE id = OLD.provider_id AND user_id = auth.uid() AND status = 'approved'
  ) INTO is_provider;

  -- Only backend payment code can mutate Stripe/payment fields.
  IF NOT is_service AND ROW(NEW.payment_status,NEW.stripe_checkout_session_id,NEW.stripe_payment_intent_id,NEW.paid_at)
     IS DISTINCT FROM ROW(OLD.payment_status,OLD.stripe_checkout_session_id,OLD.stripe_payment_intent_id,OLD.paid_at) THEN
    RAISE EXCEPTION 'Payment state is server managed' USING ERRCODE = '42501';
  END IF;

  IF is_service THEN
    IF NEW.status IN ('payment_pending','paid','refunded') THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Invalid server payment transition' USING ERRCODE = '23514';
  END IF;

  -- Provider/admin can issue or replace a quote until the customer accepts it.
  IF NEW.status = 'quoted' AND OLD.status IN ('requested','quoted') AND (is_provider OR is_admin) AND OLD.customer_id <> auth.uid() THEN
    SELECT commission_percent INTO NEW.commission_percent
    FROM public.marketplace_categories WHERE slug = OLD.category_slug;
    IF NEW.commission_percent IS NULL THEN
      RAISE EXCEPTION 'Category needs a commercial agreement before quoting' USING ERRCODE = '23514';
    END IF;
    IF NEW.fee IS NULL OR length(trim(NEW.quote_terms)) < 20 OR NEW.quote_expires_at IS NULL
       OR NEW.quote_expires_at <= now() OR NEW.quote_expires_at > now() + interval '90 days' THEN
      RAISE EXCEPTION 'Quote requires fee, terms and future expiry within 90 days' USING ERRCODE = '23514';
    END IF;
    NEW.quote_version := OLD.quote_version + 1;
    NEW.accepted_at := NULL;
    RETURN NEW;
  END IF;

  IF ROW(NEW.quote_version,NEW.fee,NEW.taxes,NEW.expenses,NEW.commission_percent,NEW.quote_terms,NEW.quote_expires_at,NEW.accepted_at)
     IS DISTINCT FROM ROW(OLD.quote_version,OLD.fee,OLD.taxes,OLD.expenses,OLD.commission_percent,OLD.quote_terms,OLD.quote_expires_at,OLD.accepted_at) THEN
    RAISE EXCEPTION 'Quote cannot be changed with this transition' USING ERRCODE = '42501';
  END IF;

  IF OLD.customer_id = auth.uid() AND OLD.status = 'quoted' AND NEW.status = 'accepted' THEN
    IF OLD.quote_expires_at <= now() THEN RAISE EXCEPTION 'Quote expired' USING ERRCODE = '23514'; END IF;
    NEW.accepted_at := now();
    RETURN NEW;
  ELSIF OLD.customer_id = auth.uid() AND OLD.status IN ('requested','quoted','accepted','payment_pending')
        AND NEW.status = 'cancelled' AND OLD.payment_status <> 'paid' THEN
    NEW.cancelled_at := now();
    RETURN NEW;
  ELSIF (is_provider OR is_admin) AND OLD.status IN ('requested','quoted') AND NEW.status = 'declined' THEN
    RETURN NEW;
  ELSIF (is_provider OR is_admin) AND OLD.status = 'paid' AND OLD.payment_status = 'paid' AND NEW.status = 'in_progress' THEN
    RETURN NEW;
  ELSIF OLD.customer_id = auth.uid() AND OLD.status IN ('paid','in_progress') AND OLD.payment_status = 'paid' AND NEW.status = 'completed' THEN
    NEW.completed_at := now();
    RETURN NEW;
  ELSIF OLD.customer_id = auth.uid() AND OLD.status IN ('paid','in_progress') AND OLD.payment_status = 'paid' AND NEW.status = 'disputed' THEN
    RETURN NEW;
  ELSIF is_admin AND OLD.status = 'disputed' AND NEW.status IN ('completed','refunded') THEN
    IF NEW.status = 'completed' THEN NEW.completed_at := coalesce(OLD.completed_at, now()); END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Invalid request transition' USING ERRCODE = '23514';
END;
$$;

REVOKE ALL ON FUNCTION public.marketplace_guard_provider(), public.marketplace_guard_service(), public.marketplace_guard_request()
FROM PUBLIC, anon, authenticated;

CREATE TABLE public.marketplace_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.marketplace_requests(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX marketplace_messages_request_idx ON public.marketplace_messages(request_id, created_at);
ALTER TABLE public.marketplace_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_messages FROM anon, authenticated;
GRANT SELECT, INSERT ON public.marketplace_messages TO authenticated;
CREATE POLICY "Request participants read messages" ON public.marketplace_messages
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.marketplace_requests r
  WHERE r.id = request_id AND (
    r.customer_id = (select auth.uid()) OR
    EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = r.provider_id AND p.user_id = (select auth.uid())) OR
    public.has_role(auth.uid(), 'admin'::public.app_role)
  )
));
CREATE POLICY "Request participants send messages" ON public.marketplace_messages
FOR INSERT TO authenticated
WITH CHECK (
  sender_id = (select auth.uid()) AND EXISTS (
    SELECT 1 FROM public.marketplace_requests r
    WHERE r.id = request_id AND r.status NOT IN ('declined','cancelled','refunded') AND (
      r.customer_id = (select auth.uid()) OR
      EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = r.provider_id AND p.user_id = (select auth.uid()))
    )
  )
);

CREATE TABLE public.marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL UNIQUE REFERENCES public.marketplace_requests(id),
  customer_id uuid NOT NULL REFERENCES auth.users(id),
  provider_id uuid NOT NULL REFERENCES public.marketplace_providers(id),
  service_id uuid NOT NULL REFERENCES public.marketplace_services(id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '' CHECK (char_length(comment) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX marketplace_reviews_provider_idx ON public.marketplace_reviews(provider_id, created_at DESC);
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_reviews FROM anon, authenticated;
GRANT SELECT ON public.marketplace_reviews TO anon, authenticated;
GRANT INSERT ON public.marketplace_reviews TO authenticated;
CREATE POLICY "Reviews are public" ON public.marketplace_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer reviews completed order" ON public.marketplace_reviews
FOR INSERT TO authenticated
WITH CHECK (
  customer_id = (select auth.uid()) AND EXISTS (
    SELECT 1 FROM public.marketplace_requests r
    WHERE r.id = request_id AND r.customer_id = (select auth.uid()) AND r.status = 'completed'
      AND r.provider_id = provider_id AND r.service_id = service_id
  )
);

CREATE OR REPLACE FUNCTION public.marketplace_guard_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE order_row public.marketplace_requests%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  SELECT * INTO order_row FROM public.marketplace_requests
  WHERE id = NEW.request_id AND customer_id = auth.uid() AND status = 'completed';
  IF NOT FOUND THEN RAISE EXCEPTION 'Only completed orders can be reviewed' USING ERRCODE = '23514'; END IF;
  NEW.customer_id := auth.uid();
  NEW.provider_id := order_row.provider_id;
  NEW.service_id := order_row.service_id;
  NEW.created_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER marketplace_review_guard BEFORE INSERT ON public.marketplace_reviews
FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_review();
REVOKE ALL ON FUNCTION public.marketplace_guard_review() FROM PUBLIC, anon, authenticated;

-- Private, append-only ledger for webhook idempotency and operational audit.
CREATE TABLE public.marketplace_payment_events (
  id text PRIMARY KEY,
  request_id uuid REFERENCES public.marketplace_requests(id),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.marketplace_payment_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_payment_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.marketplace_payment_events TO service_role;

COMMIT;
