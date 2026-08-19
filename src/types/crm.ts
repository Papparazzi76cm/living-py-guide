export type CrmPartnerStatus = 'onboarding' | 'trial' | 'active' | 'suspended' | 'ended';
export type CrmAssignmentStatus = 'assigned' | 'accepted' | 'contacted' | 'proposal' | 'won' | 'lost' | 'declined';
export type CrmLeadStatus = 'new' | 'qualified' | 'assigned' | 'in_progress' | 'won' | 'lost' | 'closed';
export type CrmPriority = 'low' | 'normal' | 'high' | 'urgent';
export type CrmActivityType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'note' | 'proposal' | 'status_change';

export interface CrmPartnerAccount {
  id: string;
  application_id: string | null;
  market_slug: string;
  zone_slug: string;
  zone_name: string;
  seat_limit: number;
  category_slug: string;
  category_name: string;
  membership_tier: 'A' | 'B' | 'C' | 'D';
  company: string;
  primary_contact_name: string;
  primary_email: string;
  whatsapp: string | null;
  city: string | null;
  website: string | null;
  languages: string | null;
  status: CrmPartnerStatus;
  exclusivity_requested: boolean;
  exclusivity_active: boolean;
  joined_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmDelegationUser {
  id: string;
  user_id: string;
  market_slug: string;
  role: 'manager' | 'staff';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmPartnerUser {
  id: string;
  partner_account_id: string;
  user_id: string;
  role: 'owner' | 'manager' | 'sales';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmMembership {
  id: string;
  partner_account_id: string;
  membership_tier: 'A' | 'B' | 'C' | 'D';
  amount_usd: number;
  exclusivity_amount_usd: number;
  currency_code: string;
  starts_at: string;
  ends_at: string;
  guarantee_until: string | null;
  status: 'pending' | 'active' | 'refunded' | 'expired' | 'cancelled';
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmLead {
  id: string;
  market_slug: string;
  zone_slug: string;
  category_slug: string;
  category_name: string;
  contact_name: string;
  contact_email: string | null;
  contact_whatsapp: string | null;
  nationality: string | null;
  city: string | null;
  source: string;
  source_ref: string | null;
  need_summary: string;
  priority: CrmPriority;
  status: CrmLeadStatus;
  estimated_value: number;
  actual_value: number;
  currency_code: string;
  consent_privacy: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmLeadAssignment {
  id: string;
  lead_id: string;
  partner_account_id: string;
  assigned_by: string | null;
  status: CrmAssignmentStatus;
  assigned_at: string;
  response_due_at: string;
  first_response_at: string | null;
  last_contact_at: string | null;
  follow_up_due_at: string | null;
  closed_at: string | null;
  estimated_value: number;
  won_value: number;
  currency_code: string;
  lost_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmActivity {
  id: string;
  lead_id: string;
  assignment_id: string | null;
  partner_account_id: string | null;
  actor_user_id: string | null;
  activity_type: CrmActivityType;
  body: string;
  occurred_at: string;
  next_action_at: string | null;
  created_at: string;
}

export interface CrmTask {
  id: string;
  lead_id: string | null;
  assignment_id: string | null;
  partner_account_id: string;
  owner_user_id: string | null;
  title: string;
  description: string | null;
  due_at: string;
  priority: CrmPriority;
  status: 'pending' | 'completed' | 'cancelled';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmFeedback {
  id: string;
  lead_id: string;
  assignment_id: string | null;
  partner_account_id: string | null;
  score: number | null;
  nps: number | null;
  comment: string | null;
  created_at: string;
}

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type CrmDatabase = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      crm_delegation_users: TableDef<CrmDelegationUser>;
      crm_partner_accounts: TableDef<CrmPartnerAccount>;
      crm_partner_users: TableDef<CrmPartnerUser>;
      crm_memberships: TableDef<CrmMembership>;
      crm_leads: TableDef<CrmLead>;
      crm_lead_assignments: TableDef<CrmLeadAssignment>;
      crm_activities: TableDef<CrmActivity>;
      crm_tasks: TableDef<CrmTask>;
      crm_feedback: TableDef<CrmFeedback>;
    };
    Views: Record<string, never>;
    Functions: {
      crm_claim_partner_access: {
        Args: Record<string, never>;
        Returns: number;
      };
      crm_activate_partner_application: {
        Args: { _application_id: string };
        Returns: string;
      };
      crm_manages_market: {
        Args: { _market_slug: string };
        Returns: boolean;
      };
      crm_has_partner_access: {
        Args: { _partner_account_id: string };
        Returns: boolean;
      };
      crm_is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
