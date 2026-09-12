BEGIN;

-- Payment rails are deliberately provider-agnostic. Paraguay is supported by
-- dLocal Payins/Payouts, while other markets may use different adapters.
ALTER TABLE public.marketplace_providers
  ADD COLUMN payout_provider text NOT NULL DEFAULT 'unconfigured'
    CHECK (payout_provider IN ('unconfigured','dlocal','manual','stripe')),
  ADD COLUMN payout_account_reference text,
  ADD COLUMN payout_status text NOT NULL DEFAULT 'not_started'
    CHECK (payout_status IN ('not_started','pending','ready','restricted'));

ALTER TABLE public.marketplace_requests
  ADD COLUMN payment_provider text NOT NULL DEFAULT 'unconfigured'
    CHECK (payment_provider IN ('unconfigured','dlocal','manual','stripe')),
  ADD COLUMN payment_reference text;

CREATE OR REPLACE FUNCTION public.marketplace_guard_provider_payout_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  is_service boolean := coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role';
BEGIN
  IF NOT is_service AND ROW(NEW.payout_provider, NEW.payout_account_reference, NEW.payout_status)
    IS DISTINCT FROM ROW(OLD.payout_provider, OLD.payout_account_reference, OLD.payout_status) THEN
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
