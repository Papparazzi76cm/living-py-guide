BEGIN;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.community_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  whatsapp text CHECK (whatsapp IS NULL OR char_length(whatsapp) <= 40),
  nationality text CHECK (nationality IS NULL OR char_length(nationality) <= 80),
  stage text NOT NULL DEFAULT 'planning' CHECK (stage IN ('planning','arriving','living')),
  city text CHECK (city IS NULL OR char_length(city) <= 100),
  interests text[] NOT NULL DEFAULT ARRAY[]::text[],
  notes text CHECK (notes IS NULL OR char_length(notes) <= 1500),
  consent_privacy boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','joined','closed')),
  source text NOT NULL DEFAULT 'community_page' CHECK (source IN ('community_page','contact_page','event','manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS community_signups_email_unique ON public.community_signups (lower(email));
CREATE INDEX IF NOT EXISTS community_signups_status_idx ON public.community_signups (status, created_at DESC);
DROP TRIGGER IF EXISTS community_signups_set_updated_at ON public.community_signups;
CREATE TRIGGER community_signups_set_updated_at BEFORE UPDATE ON public.community_signups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.community_signups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit community signup" ON public.community_signups;
CREATE POLICY "Public can submit community signup" ON public.community_signups FOR INSERT TO public
WITH CHECK (consent_privacy = true AND status = 'new' AND source = 'community_page' AND cardinality(interests) <= 12);
DROP POLICY IF EXISTS "Admins can view community signups" ON public.community_signups;
CREATE POLICY "Admins can view community signups" ON public.community_signups FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update community signups" ON public.community_signups;
CREATE POLICY "Admins can update community signups" ON public.community_signups FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete community signups" ON public.community_signups;
CREATE POLICY "Admins can delete community signups" ON public.community_signups FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
GRANT INSERT ON public.community_signups TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.community_signups TO authenticated;

CREATE TABLE IF NOT EXISTS public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  company text NOT NULL CHECK (char_length(company) BETWEEN 2 AND 160),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 6 AND 40),
  city text NOT NULL CHECK (char_length(city) BETWEEN 2 AND 100),
  category_slug text NOT NULL CHECK (char_length(category_slug) BETWEEN 2 AND 100),
  category_name text NOT NULL CHECK (char_length(category_name) BETWEEN 2 AND 140),
  website text CHECK (website IS NULL OR char_length(website) <= 300),
  description text NOT NULL CHECK (char_length(description) BETWEEN 20 AND 2000),
  years_experience integer NOT NULL CHECK (years_experience BETWEEN 0 AND 80),
  languages text NOT NULL CHECK (char_length(languages) BETWEEN 2 AND 300),
  exclusivity_interest boolean NOT NULL DEFAULT false,
  consent_privacy boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','screening','approved','rejected','waitlist','withdrawn')),
  source text NOT NULL DEFAULT 'partner_page' CHECK (source IN ('partner_page','event','manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS partner_applications_email_category_unique ON public.partner_applications (lower(email), category_slug);
CREATE INDEX IF NOT EXISTS partner_applications_status_idx ON public.partner_applications (status, created_at DESC);
CREATE INDEX IF NOT EXISTS partner_applications_category_idx ON public.partner_applications (category_slug, created_at DESC);
DROP TRIGGER IF EXISTS partner_applications_set_updated_at ON public.partner_applications;
CREATE TRIGGER partner_applications_set_updated_at BEFORE UPDATE ON public.partner_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit partner application" ON public.partner_applications;
CREATE POLICY "Public can submit partner application" ON public.partner_applications FOR INSERT TO public
WITH CHECK (consent_privacy = true AND status = 'new' AND source = 'partner_page');
DROP POLICY IF EXISTS "Admins can view partner applications" ON public.partner_applications;
CREATE POLICY "Admins can view partner applications" ON public.partner_applications FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update partner applications" ON public.partner_applications;
CREATE POLICY "Admins can update partner applications" ON public.partner_applications FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete partner applications" ON public.partner_applications;
CREATE POLICY "Admins can delete partner applications" ON public.partner_applications FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
GRANT INSERT ON public.partner_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.partner_applications TO authenticated;

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  consent_privacy boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','resolved','closed')),
  source text NOT NULL DEFAULT 'contact_page' CHECK (source IN ('contact_page','community_page','manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_inquiries_status_idx ON public.contact_inquiries (status, created_at DESC);
DROP TRIGGER IF EXISTS contact_inquiries_set_updated_at ON public.contact_inquiries;
CREATE TRIGGER contact_inquiries_set_updated_at BEFORE UPDATE ON public.contact_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit contact inquiry" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiry" ON public.contact_inquiries FOR INSERT TO public
WITH CHECK (consent_privacy = true AND status = 'new' AND source IN ('contact_page','community_page'));
DROP POLICY IF EXISTS "Admins can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can view contact inquiries" ON public.contact_inquiries FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can update contact inquiries" ON public.contact_inquiries FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can delete contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can delete contact inquiries" ON public.contact_inquiries FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
GRANT INSERT ON public.contact_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_inquiries TO authenticated;

COMMIT;
