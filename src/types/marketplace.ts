export type ProviderStatus = 'pending' | 'approved' | 'rejected';
export type ServiceStatus = 'draft' | 'pending' | 'published' | 'hidden';
export type RequestStatus =
  | 'requested'
  | 'quoted'
  | 'accepted'
  | 'payment_pending'
  | 'paid'
  | 'in_progress'
  | 'completed'
  | 'declined'
  | 'cancelled'
  | 'disputed'
  | 'refunded';
export type PaymentStatus = 'not_required' | 'unpaid' | 'processing' | 'paid' | 'refunded' | 'failed';
export type PaymentProvider = 'unconfigured' | 'dlocal' | 'manual' | 'stripe';
export type PayoutStatus = 'not_started' | 'pending' | 'ready' | 'restricted';
export type Currency = 'USD' | 'PYG';
export type DeliveryMode = 'online' | 'onsite' | 'hybrid';
export type PriceType = 'fixed' | 'from' | 'quote';

export type Provider = {
  id: string;
  user_id: string;
  display_name: string;
  city: string;
  languages: string[];
  description: string;
  status: ProviderStatus;
  avatar_url: string | null;
  website: string | null;
  whatsapp: string | null;
  payout_provider: PaymentProvider;
  payout_account_reference: string | null;
  payout_status: PayoutStatus;
  payouts_enabled: boolean;
  stripe_account_id: string | null;
  stripe_onboarding_status: PayoutStatus;
  verified_at: string | null;
  created_at: string;
};

export type Service = {
  id: string;
  provider_id: string;
  category_slug: string;
  title: string;
  description: string;
  exclusions: string;
  delivery_terms: string;
  cancellation_terms: string;
  price: number | null;
  price_type: PriceType;
  currency: Currency;
  delivery_mode: DeliveryMode;
  duration_minutes: number | null;
  status: ServiceStatus;
  created_at: string;
  updated_at: string;
};

export type ServiceRequest = {
  id: string;
  service_id: string;
  provider_id: string;
  customer_id: string;
  service_title: string;
  category_slug: string;
  city: string;
  language: string;
  details: string;
  preferred_date: string | null;
  scheduled_at: string | null;
  status: RequestStatus;
  currency: Currency;
  fee: number | null;
  taxes: number;
  expenses: number;
  commission_percent: number | null;
  commission_amount: number | null;
  total: number | null;
  provider_net: number | null;
  quote_version: number;
  quote_terms: string;
  quote_expires_at: string | null;
  accepted_at: string | null;
  payment_status: PaymentStatus;
  payment_provider: PaymentProvider;
  payment_reference: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
};

export type MarketplaceMessage = {
  id: string;
  request_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type MarketplaceReview = {
  id: string;
  request_id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

type Table<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type MarketplaceDatabase = {
  __InternalSupabase: { PostgrestVersion: '14.15' };
  public: {
    Tables: {
      marketplace_providers: Table<
        Provider,
        Pick<Provider, 'user_id' | 'display_name' | 'city' | 'languages' | 'description'> &
          Partial<Pick<Provider, 'status' | 'avatar_url' | 'website' | 'whatsapp' | 'verified_at'>>
      >;
      marketplace_services: Table<
        Service,
        Pick<Service, 'provider_id' | 'category_slug' | 'title' | 'description' | 'exclusions' | 'delivery_terms' | 'cancellation_terms' | 'currency'> &
          Partial<Pick<Service, 'price' | 'price_type' | 'delivery_mode' | 'duration_minutes' | 'status'>>
      >;
      marketplace_requests: Table<
        ServiceRequest,
        Pick<ServiceRequest, 'service_id' | 'city' | 'language' | 'details'> &
          Partial<Pick<ServiceRequest, 'preferred_date' | 'scheduled_at' | 'status' | 'fee' | 'taxes' | 'expenses' | 'quote_terms' | 'quote_expires_at' | 'completed_at' | 'cancelled_at'>>
      >;
      marketplace_messages: Table<MarketplaceMessage, Pick<MarketplaceMessage, 'request_id' | 'body'> & Partial<Pick<MarketplaceMessage, 'sender_id'>>>;
      marketplace_reviews: Table<MarketplaceReview, Pick<MarketplaceReview, 'request_id' | 'rating' | 'comment'> & Partial<Pick<MarketplaceReview, 'customer_id' | 'provider_id' | 'service_id'>>>;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
