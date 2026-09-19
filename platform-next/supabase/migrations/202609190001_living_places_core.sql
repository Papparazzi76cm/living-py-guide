-- Living Paraguay Places: core geography + education + healthcare schema
-- Designed for Supabase/Postgres. Public reads use RLS; admin writes are expected through trusted server-side code/service role.

create extension if not exists pgcrypto;
create extension if not exists postgis;

-- -----------------------------------------------------------------------------
-- SOURCES & VERIFICATION
-- -----------------------------------------------------------------------------
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text,
  url text,
  source_type text not null check (source_type in ('government','official_website','institution','price_list','pdf','phone_verification','email_verification','whatsapp_verification','other')),
  is_official boolean not null default false,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.verification_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  field_name text,
  source_id uuid references public.sources(id) on delete set null,
  verification_status text not null default 'verified' check (verification_status in ('pending','verified','rejected','outdated')),
  verified_at timestamptz not null default now(),
  verified_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists verification_events_entity_idx on public.verification_events(entity_type, entity_id);
create index if not exists verification_events_verified_at_idx on public.verification_events(verified_at desc);

-- -----------------------------------------------------------------------------
-- GEOGRAPHY
-- -----------------------------------------------------------------------------
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.locations(id) on delete set null,
  name text not null,
  slug text not null,
  location_type text not null check (location_type in ('country','department','capital_district','city','municipality','neighborhood','zone','locality')),
  country_code char(2) not null default 'PY',
  department_code text,
  latitude double precision,
  longitude double precision,
  geo_point geography(Point,4326),
  timezone text not null default 'America/Asuncion',
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  sort_order integer not null default 0,
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(parent_id, slug)
);

create index if not exists locations_parent_idx on public.locations(parent_id);
create index if not exists locations_type_idx on public.locations(location_type);
create index if not exists locations_slug_idx on public.locations(slug);
create index if not exists locations_geo_idx on public.locations using gist(geo_point);

create table if not exists public.location_profiles (
  location_id uuid primary key references public.locations(id) on delete cascade,
  intro text,
  living_summary text,
  family_summary text,
  education_summary text,
  healthcare_summary text,
  digital_nomad_summary text,
  transport_summary text,
  internet_summary text,
  safety_summary text,
  cost_summary text,
  pros jsonb not null default '[]'::jsonb,
  cons jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.location_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  group_type text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.location_group_members (
  group_id uuid not null references public.location_groups(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  sort_order integer not null default 0,
  primary key(group_id, location_id)
);

-- -----------------------------------------------------------------------------
-- TRANSLATIONS
-- -----------------------------------------------------------------------------
create table if not exists public.entity_translations (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  locale varchar(5) not null check (locale in ('es','pt','de','en')),
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_type, entity_id, locale)
);

create index if not exists entity_translations_lookup_idx on public.entity_translations(entity_type, entity_id, locale);

-- -----------------------------------------------------------------------------
-- EDUCATION
-- -----------------------------------------------------------------------------
create table if not exists public.education_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  institution_type text not null check (institution_type in ('school','university','higher_institute','technical_institute','vocational_training','language_school','other')),
  ownership_type text check (ownership_type in ('public','private','mixed')),
  religious_affiliation text,
  website text,
  email text,
  phone text,
  whatsapp text,
  description text,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists education_institutions_type_idx on public.education_institutions(institution_type);
create index if not exists education_institutions_status_idx on public.education_institutions(status);

create table if not exists public.education_campuses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.education_institutions(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  slug text not null,
  address text,
  latitude double precision,
  longitude double precision,
  geo_point geography(Point,4326),
  phone text,
  whatsapp text,
  email text,
  website text,
  opening_hours jsonb,
  transport_available boolean,
  dining_available boolean,
  boarding_available boolean,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(institution_id, slug)
);

create index if not exists education_campuses_location_idx on public.education_campuses(location_id);
create index if not exists education_campuses_geo_idx on public.education_campuses using gist(geo_point);

create table if not exists public.education_levels (
  id smallserial primary key,
  code text not null unique,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.education_campus_levels (
  campus_id uuid not null references public.education_campuses(id) on delete cascade,
  level_id smallint not null references public.education_levels(id) on delete cascade,
  primary key(campus_id, level_id)
);

create table if not exists public.languages (
  id smallserial primary key,
  code varchar(5) not null unique,
  name text not null
);

create table if not exists public.education_campus_languages (
  campus_id uuid not null references public.education_campuses(id) on delete cascade,
  language_id smallint not null references public.languages(id) on delete cascade,
  language_role text not null check (language_role in ('instruction','bilingual','optional','support')),
  primary key(campus_id, language_id, language_role)
);

create table if not exists public.education_features (
  id serial primary key,
  code text not null unique,
  name text not null,
  category text
);

create table if not exists public.education_campus_features (
  campus_id uuid not null references public.education_campuses(id) on delete cascade,
  feature_id integer not null references public.education_features(id) on delete cascade,
  details text,
  primary key(campus_id, feature_id)
);

create table if not exists public.education_fees (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references public.education_campuses(id) on delete cascade,
  academic_year integer,
  level_id smallint references public.education_levels(id) on delete set null,
  fee_type text not null check (fee_type in ('registration','enrollment','monthly_fee','entrance_fee','annual_fee','materials','transport','cafeteria','other')),
  amount_min numeric(14,2),
  amount_max numeric(14,2),
  currency char(3) not null default 'PYG',
  billing_period text,
  mandatory boolean,
  notes text,
  source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now()
);

create index if not exists education_fees_campus_idx on public.education_fees(campus_id);
create index if not exists education_fees_valid_idx on public.education_fees(valid_from, valid_to);

create table if not exists public.education_programs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.education_institutions(id) on delete cascade,
  campus_id uuid references public.education_campuses(id) on delete set null,
  name text not null,
  slug text not null,
  program_type text,
  study_area text,
  modality text check (modality in ('presential','online','hybrid')),
  duration_months integer,
  degree_awarded text,
  description text,
  admission_url text,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(institution_id, slug)
);

create table if not exists public.education_program_accreditations (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.education_programs(id) on delete cascade,
  authority text not null,
  accreditation_status text,
  resolution_number text,
  valid_from date,
  valid_to date,
  source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.education_admissions (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.education_institutions(id) on delete cascade,
  program_id uuid references public.education_programs(id) on delete cascade,
  audience text,
  requirements jsonb not null default '[]'::jsonb,
  foreign_student_requirements jsonb not null default '[]'::jsonb,
  application_period text,
  application_url text,
  notes text,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- HEALTHCARE
-- -----------------------------------------------------------------------------
create table if not exists public.health_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organization_type text not null check (organization_type in ('public_health_system','insurance_company','prepaid_medicine','hospital_group','clinic_group','emergency_service','laboratory_group','other')),
  ownership_type text check (ownership_type in ('public','private','mixed')),
  website text,
  email text,
  phone text,
  whatsapp text,
  description text,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_facilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.health_organizations(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  slug text not null unique,
  facility_type text not null check (facility_type in ('hospital','sanatorium','clinic','health_center','primary_care','laboratory','diagnostic_center','emergency_center','maternity','specialized_center','other')),
  ownership_type text check (ownership_type in ('public','private','mixed')),
  address text,
  latitude double precision,
  longitude double precision,
  geo_point geography(Point,4326),
  phone text,
  whatsapp text,
  website text,
  emergency_24h boolean,
  inpatient boolean,
  icu boolean,
  opening_hours jsonb,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists health_facilities_location_idx on public.health_facilities(location_id);
create index if not exists health_facilities_geo_idx on public.health_facilities using gist(geo_point);

create table if not exists public.health_specialties (
  id serial primary key,
  code text not null unique,
  name text not null
);

create table if not exists public.health_facility_specialties (
  facility_id uuid not null references public.health_facilities(id) on delete cascade,
  specialty_id integer not null references public.health_specialties(id) on delete cascade,
  primary key(facility_id, specialty_id)
);

create table if not exists public.health_services (
  id serial primary key,
  code text not null unique,
  name text not null
);

create table if not exists public.health_facility_services (
  facility_id uuid not null references public.health_facilities(id) on delete cascade,
  service_id integer not null references public.health_services(id) on delete cascade,
  details text,
  primary key(facility_id, service_id)
);

create table if not exists public.health_insurance_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.health_organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  plan_type text not null check (plan_type in ('individual','family','couple','young','senior','corporate','other')),
  description text,
  minimum_age integer,
  maximum_entry_age integer,
  geographic_scope text,
  waiting_period_summary text,
  preexisting_conditions_summary text,
  reimbursement_available boolean,
  status text not null default 'draft' check (status in ('draft','review','published','outdated','archived')),
  primary_source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, slug)
);

create table if not exists public.health_plan_prices (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.health_insurance_plans(id) on delete cascade,
  profile_type text,
  age_from integer,
  age_to integer,
  household_size_from integer,
  household_size_to integer,
  amount_min numeric(14,2),
  amount_max numeric(14,2),
  currency char(3) not null default 'PYG',
  billing_period text not null default 'month',
  effective_from date,
  effective_to date,
  source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.health_coverage_items (
  id serial primary key,
  code text not null unique,
  name text not null,
  category text
);

create table if not exists public.health_plan_coverages (
  plan_id uuid not null references public.health_insurance_plans(id) on delete cascade,
  coverage_item_id integer not null references public.health_coverage_items(id) on delete cascade,
  coverage_status text not null check (coverage_status in ('included','partial','copay','limited','excluded')),
  limit_text text,
  copay_amount numeric(14,2),
  notes text,
  primary key(plan_id, coverage_item_id)
);

create table if not exists public.health_plan_facilities (
  plan_id uuid not null references public.health_insurance_plans(id) on delete cascade,
  facility_id uuid not null references public.health_facilities(id) on delete cascade,
  network_level text,
  source_id uuid references public.sources(id) on delete set null,
  verified_at timestamptz,
  primary key(plan_id, facility_id)
);

-- -----------------------------------------------------------------------------
-- GEOGRAPHIC HELPERS
-- -----------------------------------------------------------------------------
create or replace function public.sync_geo_point()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geo_point := st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  return new;
end;
$$;

drop trigger if exists locations_sync_geo_point on public.locations;
create trigger locations_sync_geo_point before insert or update of latitude, longitude on public.locations for each row execute function public.sync_geo_point();

drop trigger if exists education_campuses_sync_geo_point on public.education_campuses;
create trigger education_campuses_sync_geo_point before insert or update of latitude, longitude on public.education_campuses for each row execute function public.sync_geo_point();

drop trigger if exists health_facilities_sync_geo_point on public.health_facilities;
create trigger health_facilities_sync_geo_point before insert or update of latitude, longitude on public.health_facilities for each row execute function public.sync_geo_point();

-- -----------------------------------------------------------------------------
-- SEED LOOKUPS
-- -----------------------------------------------------------------------------
insert into public.education_levels(code, name, sort_order) values
  ('initial','Inicial',10), ('primary','Primaria',20), ('secondary','Secundaria',30), ('technical','Técnica',40),
  ('undergraduate','Grado',50), ('postgraduate','Posgrado',60), ('masters','Máster',70), ('doctorate','Doctorado',80)
on conflict (code) do nothing;

insert into public.languages(code, name) values
  ('es','Español'), ('gn','Guaraní'), ('en','Inglés'), ('de','Alemán'), ('pt','Portugués'), ('fr','Francés')
on conflict (code) do nothing;

insert into public.education_features(code, name, category) values
  ('school_transport','Transporte escolar','services'), ('cafeteria','Comedor','services'), ('full_day','Jornada completa','schedule'),
  ('sports','Instalaciones deportivas','facilities'), ('swimming_pool','Piscina','facilities'), ('international_baccalaureate','Bachillerato Internacional','academics'),
  ('cambridge','Programa Cambridge','academics'), ('special_education','Apoyo educativo especial','support'), ('technology','Tecnología','academics'),
  ('music','Música','academics'), ('boarding','Residencia/internado','services')
on conflict (code) do nothing;

insert into public.health_services(code, name) values
  ('emergency','Urgencias'), ('laboratory','Laboratorio'), ('xray','Rayos X'), ('ct','Tomografía'), ('mri','Resonancia magnética'),
  ('ultrasound','Ecografía'), ('maternity','Maternidad'), ('surgery','Cirugía'), ('icu','UTI/UCI'), ('pharmacy','Farmacia'), ('ambulance','Ambulancia')
on conflict (code) do nothing;

insert into public.health_specialties(code, name) values
  ('cardiology','Cardiología'), ('pediatrics','Pediatría'), ('gynecology','Ginecología'), ('traumatology','Traumatología'),
  ('neurology','Neurología'), ('dermatology','Dermatología'), ('ophthalmology','Oftalmología'), ('oncology','Oncología'),
  ('psychiatry','Psiquiatría'), ('dentistry','Odontología')
on conflict (code) do nothing;

insert into public.health_coverage_items(code, name, category) values
  ('consultation','Consultas','outpatient'), ('hospitalization','Internación','inpatient'), ('surgery','Cirugía','inpatient'), ('icu','UTI/UCI','inpatient'),
  ('maternity','Maternidad','maternity'), ('laboratory','Laboratorio','diagnostics'), ('diagnostic_imaging','Diagnóstico por imagen','diagnostics'),
  ('medication','Medicamentos','pharmacy'), ('dental','Odontología','dental'), ('physiotherapy','Fisioterapia','rehabilitation'),
  ('mental_health','Salud mental','mental_health'), ('emergency','Urgencias','emergency'), ('ambulance','Ambulancia','emergency')
on conflict (code) do nothing;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.sources enable row level security;
alter table public.verification_events enable row level security;
alter table public.locations enable row level security;
alter table public.location_profiles enable row level security;
alter table public.location_groups enable row level security;
alter table public.location_group_members enable row level security;
alter table public.entity_translations enable row level security;
alter table public.education_institutions enable row level security;
alter table public.education_campuses enable row level security;
alter table public.education_levels enable row level security;
alter table public.education_campus_levels enable row level security;
alter table public.languages enable row level security;
alter table public.education_campus_languages enable row level security;
alter table public.education_features enable row level security;
alter table public.education_campus_features enable row level security;
alter table public.education_fees enable row level security;
alter table public.education_programs enable row level security;
alter table public.education_program_accreditations enable row level security;
alter table public.education_admissions enable row level security;
alter table public.health_organizations enable row level security;
alter table public.health_facilities enable row level security;
alter table public.health_specialties enable row level security;
alter table public.health_facility_specialties enable row level security;
alter table public.health_services enable row level security;
alter table public.health_facility_services enable row level security;
alter table public.health_insurance_plans enable row level security;
alter table public.health_plan_prices enable row level security;
alter table public.health_coverage_items enable row level security;
alter table public.health_plan_coverages enable row level security;
alter table public.health_plan_facilities enable row level security;

create policy "public read published locations" on public.locations for select using (status = 'published');
create policy "public read published location profiles" on public.location_profiles for select using (status = 'published' and exists (select 1 from public.locations l where l.id = location_id and l.status = 'published'));
create policy "public read published location groups" on public.location_groups for select using (status = 'published');
create policy "public read location group members" on public.location_group_members for select using (exists (select 1 from public.location_groups g where g.id = group_id and g.status = 'published'));
create policy "public read published translations" on public.entity_translations for select using (status = 'published');

create policy "public read education levels" on public.education_levels for select using (true);
create policy "public read languages" on public.languages for select using (true);
create policy "public read education features" on public.education_features for select using (true);
create policy "public read published institutions" on public.education_institutions for select using (status = 'published');
create policy "public read published campuses" on public.education_campuses for select using (status = 'published' and exists (select 1 from public.education_institutions i where i.id = institution_id and i.status = 'published'));
create policy "public read campus levels" on public.education_campus_levels for select using (exists (select 1 from public.education_campuses c where c.id = campus_id and c.status = 'published'));
create policy "public read campus languages" on public.education_campus_languages for select using (exists (select 1 from public.education_campuses c where c.id = campus_id and c.status = 'published'));
create policy "public read campus features" on public.education_campus_features for select using (exists (select 1 from public.education_campuses c where c.id = campus_id and c.status = 'published'));
create policy "public read education fees" on public.education_fees for select using (exists (select 1 from public.education_campuses c where c.id = campus_id and c.status = 'published'));
create policy "public read published programs" on public.education_programs for select using (status = 'published');
create policy "public read program accreditations" on public.education_program_accreditations for select using (exists (select 1 from public.education_programs p where p.id = program_id and p.status = 'published'));
create policy "public read published admissions" on public.education_admissions for select using (status = 'published');

create policy "public read health specialties" on public.health_specialties for select using (true);
create policy "public read health services" on public.health_services for select using (true);
create policy "public read coverage items" on public.health_coverage_items for select using (true);
create policy "public read published health organizations" on public.health_organizations for select using (status = 'published');
create policy "public read published health facilities" on public.health_facilities for select using (status = 'published');
create policy "public read facility specialties" on public.health_facility_specialties for select using (exists (select 1 from public.health_facilities f where f.id = facility_id and f.status = 'published'));
create policy "public read facility services" on public.health_facility_services for select using (exists (select 1 from public.health_facilities f where f.id = facility_id and f.status = 'published'));
create policy "public read published insurance plans" on public.health_insurance_plans for select using (status = 'published');
create policy "public read plan prices" on public.health_plan_prices for select using (exists (select 1 from public.health_insurance_plans p where p.id = plan_id and p.status = 'published'));
create policy "public read plan coverage" on public.health_plan_coverages for select using (exists (select 1 from public.health_insurance_plans p where p.id = plan_id and p.status = 'published'));
create policy "public read plan facilities" on public.health_plan_facilities for select using (exists (select 1 from public.health_insurance_plans p where p.id = plan_id and p.status = 'published'));

-- sources and verification_events intentionally have no anon/authenticated public read policies.
