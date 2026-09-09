BEGIN;

-- Additive marketplace: historical club memberships and CRM remain untouched.
CREATE TABLE public.marketplace_categories (
  slug text PRIMARY KEY,
  commission_percent numeric(5,2) CHECK (commission_percent BETWEEN 0 AND 100)
);
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_categories FROM anon, authenticated;
GRANT SELECT ON public.marketplace_categories TO anon, authenticated;
CREATE POLICY "Read commission categories" ON public.marketplace_categories FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.marketplace_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  display_name text NOT NULL CHECK (length(trim(display_name)) BETWEEN 2 AND 160),
  city text NOT NULL CHECK (length(trim(city)) BETWEEN 2 AND 100),
  languages text[] NOT NULL CHECK (cardinality(languages) BETWEEN 1 AND 12 AND length(array_to_string(languages, ',')) BETWEEN 2 AND 300),
  description text NOT NULL CHECK (length(trim(description)) BETWEEN 20 AND 2000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.marketplace_providers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_providers FROM anon, authenticated;
GRANT SELECT ON public.marketplace_providers TO anon, authenticated;
GRANT INSERT, UPDATE ON public.marketplace_providers TO authenticated;
CREATE POLICY "Public approved providers or own profile" ON public.marketplace_providers FOR SELECT TO anon, authenticated
USING (status = 'approved' OR user_id = (select auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own pending provider application" ON public.marketplace_providers FOR INSERT TO authenticated
WITH CHECK (user_id = (select auth.uid()) AND status = 'pending');
CREATE POLICY "Owner or admin updates provider" ON public.marketplace_providers FOR UPDATE TO authenticated
USING (user_id = (select auth.uid()) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (user_id = (select auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.marketplace_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.marketplace_providers(id),
  category_slug text NOT NULL REFERENCES public.marketplace_categories(slug),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 5 AND 140),
  description text NOT NULL CHECK (length(trim(description)) BETWEEN 30 AND 5000),
  exclusions text NOT NULL CHECK (length(trim(exclusions)) BETWEEN 2 AND 2000),
  delivery_terms text NOT NULL CHECK (length(trim(delivery_terms)) BETWEEN 5 AND 1000),
  cancellation_terms text NOT NULL CHECK (length(trim(cancellation_terms)) BETWEEN 5 AND 2000),
  price numeric(12,2) CHECK (price >= 0 AND price < 1000000000),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD','PYG')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('draft','pending','published','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (currency <> 'PYG' OR price = trunc(price))
);
CREATE INDEX marketplace_services_category_idx ON public.marketplace_services(category_slug, status);
CREATE INDEX marketplace_services_provider_idx ON public.marketplace_services(provider_id);
ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_services FROM anon, authenticated;
GRANT SELECT ON public.marketplace_services TO anon, authenticated;
GRANT INSERT, UPDATE ON public.marketplace_services TO authenticated;
CREATE POLICY "Published services or owner" ON public.marketplace_services FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND
 ((marketplace_services.status = 'published' AND p.status = 'approved') OR p.user_id = auth.uid())) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner submits service" ON public.marketplace_services FOR INSERT TO authenticated
WITH CHECK (status IN ('draft','pending') AND EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()));
CREATE POLICY "Owner or admin updates service" ON public.marketplace_services FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- Invoker triggers preserve RLS and enforce immutable ownership/moderation.
CREATE FUNCTION public.marketplace_guard_provider() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NEW.id <> OLD.id OR NEW.user_id <> OLD.user_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Provider identity is immutable' USING ERRCODE = '42501';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin') THEN NEW.status := 'pending'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER marketplace_provider_guard BEFORE UPDATE ON public.marketplace_providers FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_provider();
CREATE FUNCTION public.marketplace_guard_service() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NEW.id <> OLD.id OR NEW.provider_id <> OLD.provider_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Service identity is immutable' USING ERRCODE = '42501';
  END IF;
  IF NOT public.has_role(auth.uid(), 'admin') AND NEW.status = 'published' THEN NEW.status := 'pending'; END IF;
  IF NEW.status = 'published' AND NOT EXISTS (SELECT 1 FROM public.marketplace_providers WHERE id = NEW.provider_id AND status = 'approved') THEN
    RAISE EXCEPTION 'Approve provider before publishing' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER marketplace_service_guard BEFORE UPDATE ON public.marketplace_services FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_service();

CREATE TABLE public.marketplace_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.marketplace_services(id),
  provider_id uuid NOT NULL REFERENCES public.marketplace_providers(id),
  customer_id uuid NOT NULL REFERENCES auth.users(id),
  service_title text NOT NULL,
  category_slug text NOT NULL REFERENCES public.marketplace_categories(slug),
  city text NOT NULL CHECK (length(trim(city)) BETWEEN 2 AND 100),
  language text NOT NULL CHECK (length(trim(language)) BETWEEN 2 AND 100),
  details text NOT NULL CHECK (length(trim(details)) BETWEEN 20 AND 3000),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','quoted','accepted','declined','cancelled','completed')),
  currency text NOT NULL CHECK (currency IN ('USD','PYG')),
  fee numeric(12,2) CHECK (fee >= 0 AND fee < 1000000000),
  taxes numeric(12,2) NOT NULL DEFAULT 0 CHECK (taxes >= 0 AND taxes < 1000000000),
  expenses numeric(12,2) NOT NULL DEFAULT 0 CHECK (expenses >= 0 AND expenses < 1000000000),
  commission_percent numeric(5,2) CHECK (commission_percent BETWEEN 0 AND 100),
  commission_amount numeric(12,2) GENERATED ALWAYS AS (round(fee * commission_percent / 100, CASE WHEN currency = 'PYG' THEN 0 ELSE 2 END)) STORED,
  total numeric(12,2) GENERATED ALWAYS AS (fee + taxes + expenses) STORED,
  provider_net numeric(12,2) GENERATED ALWAYS AS (fee - round(fee * commission_percent / 100, CASE WHEN currency = 'PYG' THEN 0 ELSE 2 END)) STORED,
  quote_terms text NOT NULL DEFAULT '' CHECK (length(quote_terms) <= 5000),
  quote_expires_at timestamptz,
  quote_version integer NOT NULL DEFAULT 0,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (currency <> 'PYG' OR (fee = trunc(fee) AND taxes = trunc(taxes) AND expenses = trunc(expenses)))
);
CREATE INDEX marketplace_requests_customer_idx ON public.marketplace_requests(customer_id, created_at DESC);
CREATE INDEX marketplace_requests_provider_idx ON public.marketplace_requests(provider_id, created_at DESC);
ALTER TABLE public.marketplace_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.marketplace_requests FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.marketplace_requests TO authenticated;
CREATE POLICY "Participants read requests" ON public.marketplace_requests FOR SELECT TO authenticated
USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customer creates request" ON public.marketplace_requests FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid() AND status = 'requested');
CREATE POLICY "Participants update requests" ON public.marketplace_requests FOR UPDATE TO authenticated
USING (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.marketplace_providers p WHERE p.id = provider_id AND p.user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

CREATE FUNCTION public.marketplace_guard_request() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  offering public.marketplace_services%ROWTYPE;
  is_provider boolean;
  is_admin boolean := coalesce(public.has_role(auth.uid(), 'admin'), false);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  IF TG_OP = 'INSERT' THEN
    SELECT * INTO offering FROM public.marketplace_services WHERE id = NEW.service_id AND status = 'published';
    IF NOT FOUND OR NOT EXISTS (SELECT 1 FROM public.marketplace_providers WHERE id = offering.provider_id AND status = 'approved' AND user_id <> auth.uid()) THEN
      RAISE EXCEPTION 'Service unavailable' USING ERRCODE = '23514';
    END IF;
    NEW.customer_id := auth.uid(); NEW.provider_id := offering.provider_id;
    NEW.service_title := offering.title; NEW.category_slug := offering.category_slug; NEW.currency := offering.currency;
    NEW.quote_version := 0; NEW.status := 'requested'; NEW.fee := NULL; NEW.taxes := 0; NEW.expenses := 0;
    NEW.commission_percent := NULL; NEW.quote_terms := ''; NEW.quote_expires_at := NULL; NEW.accepted_at := NULL; NEW.created_at := now();
    RETURN NEW;
  END IF;
  IF ROW(NEW.id,NEW.service_id,NEW.provider_id,NEW.customer_id,NEW.service_title,NEW.category_slug,NEW.currency,NEW.city,NEW.language,NEW.details,NEW.created_at)
     IS DISTINCT FROM ROW(OLD.id,OLD.service_id,OLD.provider_id,OLD.customer_id,OLD.service_title,OLD.category_slug,OLD.currency,OLD.city,OLD.language,OLD.details,OLD.created_at) THEN
    RAISE EXCEPTION 'Request identity and original details are immutable' USING ERRCODE = '42501';
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.marketplace_providers WHERE id = OLD.provider_id AND user_id = auth.uid() AND status = 'approved') INTO is_provider;
  -- A new quote is only possible before acceptance, from its provider or admin.
  IF NEW.status = 'quoted' AND OLD.status IN ('requested','quoted') AND (is_provider OR is_admin) AND OLD.customer_id <> auth.uid() THEN
    SELECT commission_percent INTO NEW.commission_percent FROM public.marketplace_categories WHERE slug = OLD.category_slug;
    IF NEW.commission_percent IS NULL THEN RAISE EXCEPTION 'Category needs a commercial agreement before quoting' USING ERRCODE = '23514'; END IF;
    IF NEW.fee IS NULL OR length(trim(NEW.quote_terms)) < 20 OR NEW.quote_expires_at IS NULL OR NEW.quote_expires_at <= now() OR NEW.quote_expires_at > now() + interval '90 days' THEN
      RAISE EXCEPTION 'Quote requires fee, terms and future expiry within 90 days' USING ERRCODE = '23514';
    END IF;
    NEW.quote_version := OLD.quote_version + 1; NEW.accepted_at := NULL;
    RETURN NEW;
  END IF;
  IF ROW(NEW.quote_version,NEW.fee,NEW.taxes,NEW.expenses,NEW.commission_percent,NEW.quote_terms,NEW.quote_expires_at,NEW.accepted_at)
     IS DISTINCT FROM ROW(OLD.quote_version,OLD.fee,OLD.taxes,OLD.expenses,OLD.commission_percent,OLD.quote_terms,OLD.quote_expires_at,OLD.accepted_at) THEN
    RAISE EXCEPTION 'Quote cannot be changed with this transition' USING ERRCODE = '42501';
  END IF;
  IF OLD.customer_id = auth.uid() AND OLD.status = 'quoted' AND NEW.status = 'accepted' THEN
    IF OLD.quote_expires_at <= now() THEN RAISE EXCEPTION 'Quote expired' USING ERRCODE = '23514'; END IF;
    NEW.accepted_at := now(); RETURN NEW;
  ELSIF OLD.customer_id = auth.uid() AND OLD.status IN ('requested','quoted') AND NEW.status = 'cancelled' THEN RETURN NEW;
  ELSIF (is_provider OR is_admin) AND OLD.status IN ('requested','quoted') AND NEW.status = 'declined' THEN RETURN NEW;
  ELSIF OLD.customer_id = auth.uid() AND OLD.status = 'accepted' AND NEW.status = 'completed' THEN RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Invalid request transition' USING ERRCODE = '23514';
END; $$;
CREATE TRIGGER marketplace_request_guard BEFORE INSERT OR UPDATE ON public.marketplace_requests FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_request();
REVOKE ALL ON FUNCTION public.marketplace_guard_provider(), public.marketplace_guard_service(), public.marketplace_guard_request() FROM PUBLIC, anon, authenticated;

INSERT INTO public.marketplace_categories (slug, commission_percent) VALUES
  ('residencia-migraciones', 12),
  ('legal-corporativo', 10),
  ('contabilidad-impuestos', 10),
  ('inmobiliaria', 10),
  ('banca-fintech', NULL),
  ('seguros', NULL),
  ('salud-privada', NULL),
  ('colegios-internacionales', NULL),
  ('constitucion-empresas', 12),
  ('relocation', 10),
  ('vehiculos', NULL),
  ('telecom-internet', NULL),
  ('mudanzas-logistica', 10),
  ('arquitectos', NULL),
  ('construccion-reformas', NULL),
  ('eventos', NULL),
  ('guarderia-cuidadores-infantiles', NULL),
  ('cuidado-mayores', NULL),
  ('manitas-24-horas', NULL),
  ('veterinaria', NULL),
  ('cuidado-mascotas', NULL),
  ('chefs-domicilio', NULL),
  ('servicios-hogar', 15),
  ('traduccion', 15),
  ('marketing', NULL),
  ('tecnologia-ia', NULL),
  ('recursos-humanos', NULL),
  ('viajes', 15),
  ('hospitalidad-lifestyle', 15);

COMMIT;
