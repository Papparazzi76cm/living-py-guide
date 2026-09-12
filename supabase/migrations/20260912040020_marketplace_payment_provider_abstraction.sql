BEGIN;

-- Payment rails are deliberately provider-agnostic. Paraguay is supported by
-- dLocal Payins/Payouts, while other markets may use different adapters.
ALTER TABLE public.marketplace_providers
  ADD COLUMN payout_provider text NOT NULL DEFAULT 'unconfigured'
    CHECK (payout_provider IN ('unconfigured','dlocal','manual','stripe')),
  ADD COLUMN payout_status text NOT NULL DEFAULT 'not_started'
    CHECK (payout_status IN ('not_started','pending','ready','restricted'));

ALTER TABLE public.marketplace_requests
  ADD COLUMN payment_provider text NOT NULL DEFAULT 'unconfigured'
    CHECK (payment_provider IN ('unconfigured','dlocal','manual','stripe')),
  ADD COLUMN payment_reference text;

-- Contact/payment account identifiers must never live on a row that is publicly
-- selectable for approved providers. KYC/bank identifiers belong in the PSP or
-- a future private vault/table, not in the public marketplace profile.
ALTER TABLE public.marketplace_providers
  DROP COLUMN whatsapp,
  DROP COLUMN stripe_account_id,
  DROP COLUMN stripe_onboarding_status;

CREATE OR REPLACE FUNCTION public.marketplace_guard_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  is_admin boolean := coalesce(public.has_role(auth.uid(), 'admin'::public.app_role), false);
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
  public_profile_changed boolean := false;
BEGIN
  IF NEW.id <> OLD.id OR NEW.user_id <> OLD.user_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Provider identity is immutable' USING ERRCODE = '42501';
  END IF;

  public_profile_changed := ROW(NEW.display_name, NEW.city, NEW.languages, NEW.description, NEW.avatar_url, NEW.website)
    IS DISTINCT FROM ROW(OLD.display_name, OLD.city, OLD.languages, OLD.description, OLD.avatar_url, OLD.website);

  IF NOT (is_admin OR is_service) THEN
    NEW.payout_provider := OLD.payout_provider;
    NEW.payout_status := OLD.payout_status;
    NEW.payouts_enabled := OLD.payouts_enabled;
    NEW.verified_at := OLD.verified_at;

    IF public_profile_changed THEN
      NEW.status := 'pending';
      NEW.verified_at := NULL;
      UPDATE public.marketplace_services
        SET status = 'hidden'
        WHERE provider_id = OLD.id AND status = 'published';
    ELSE
      NEW.status := OLD.status;
    END IF;
  ELSIF NEW.status = 'approved' AND NEW.verified_at IS NULL THEN
    NEW.verified_at := now();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.marketplace_guard_provider_payout_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
BEGIN
  IF NOT is_service AND ROW(NEW.payout_provider, NEW.payout_status, NEW.payouts_enabled)
    IS DISTINCT FROM ROW(OLD.payout_provider, OLD.payout_status, OLD.payouts_enabled) THEN
    RAISE EXCEPTION 'Payout configuration is server managed' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER marketplace_provider_payout_guard
BEFORE UPDATE ON public.marketplace_providers
FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_provider_payout_fields();

CREATE OR REPLACE FUNCTION public.marketplace_guard_request_payment_provider()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
BEGIN
  IF NOT is_service AND ROW(NEW.payment_provider, NEW.payment_reference)
    IS DISTINCT FROM ROW(OLD.payment_provider, OLD.payment_reference) THEN
    RAISE EXCEPTION 'Payment provider state is server managed' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER marketplace_request_payment_provider_guard
BEFORE UPDATE ON public.marketplace_requests
FOR EACH ROW EXECUTE FUNCTION public.marketplace_guard_request_payment_provider();

REVOKE ALL ON FUNCTION public.marketplace_guard_provider_payout_fields(), public.marketplace_guard_request_payment_provider()
FROM PUBLIC, anon, authenticated;

COMMIT;
