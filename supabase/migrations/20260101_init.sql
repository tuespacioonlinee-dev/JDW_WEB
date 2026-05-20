-- ============================================================
-- JDC Developers — Initial Schema
-- Migration: 20260101_init.sql
-- ============================================================

-- Enable extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE: site_content
-- Bilingual editable content for the public site
-- ============================================================

create table site_content (
  id text not null,
  locale text not null check (locale in ('es','en')),
  section text not null,
  field text not null,
  value text not null,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id),
  primary key (id, locale)
);

alter table site_content enable row level security;

-- Anyone can read site_content (public site)
create policy "site_content_public_read"
  on site_content for select
  to anon, authenticated
  using (true);

-- Only admins can write — policy uses app.admin_emails setting
create policy "site_content_admin_write"
  on site_content for all
  to authenticated
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(
        coalesce(current_setting('app.admin_emails', true), ''),
        ','
      )
    )
  )
  with check (
    auth.jwt() ->> 'email' = any(
      string_to_array(
        coalesce(current_setting('app.admin_emails', true), ''),
        ','
      )
    )
  );

-- Index for fast lookups
create index site_content_section_locale_idx on site_content (section, locale);

-- ============================================================
-- TABLE: leads
-- Contact form submissions
-- ============================================================

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 2 and 100),
  email text not null check (length(email) <= 254),
  phone text check (length(phone) <= 30),
  company text check (length(company) <= 150),
  project_type text not null check (
    project_type in ('saas', 'web', 'chatbot', 'integration', 'other')
  ),
  budget text not null check (
    budget in ('<1M', '1-5M', '5-15M', '15M+', 'undecided')
  ),
  message text not null check (
    length(message) between 20 and 2000
  ),
  locale text not null default 'es' check (locale in ('es', 'en')),
  ip_hash text,
  user_agent text check (length(user_agent) <= 500),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'won', 'lost')
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table leads enable row level security;

-- Admins can read leads
create policy "leads_admin_select"
  on leads for select
  to authenticated
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(
        coalesce(current_setting('app.admin_emails', true), ''),
        ','
      )
    )
  );

-- Admins can update lead status
create policy "leads_admin_update"
  on leads for update
  to authenticated
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(
        coalesce(current_setting('app.admin_emails', true), ''),
        ','
      )
    )
  )
  with check (
    auth.jwt() ->> 'email' = any(
      string_to_array(
        coalesce(current_setting('app.admin_emails', true), ''),
        ','
      )
    )
  );

-- NO insert policy for anon/authenticated — inserts happen ONLY via service_role in API route

-- Indexes
create index leads_created_at_idx on leads (created_at desc);
create index leads_status_idx on leads (status);
create index leads_email_idx on leads (email);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on leads
  for each row execute procedure update_updated_at();

create trigger site_content_updated_at
  before update on site_content
  for each row execute procedure update_updated_at();

-- ============================================================
-- SEEDS: site_content initial data (ES)
-- All editable marketing strings
-- ============================================================

insert into site_content (id, locale, section, field, value) values
-- Hero ES
('hero.badge', 'es', 'hero', 'badge', 'Construimos software desde Tucumán para toda LATAM'),
('hero.title_line1', 'es', 'hero', 'title_line1', 'Software que tu negocio'),
('hero.title_line2', 'es', 'hero', 'title_line2', 'necesitaba ayer.'),
('hero.subtitle', 'es', 'hero', 'subtitle', 'Diseñamos y desarrollamos CRMs, webs, chatbots e integraciones a medida. De la idea al deploy, con IA en el corazón.'),

-- Metrics ES
('metrics.projects_value', 'es', 'metrics', 'projects_value', '3'),
('metrics.projects_label', 'es', 'metrics', 'projects_label', 'proyectos en producción'),
('metrics.delivery_value', 'es', 'metrics', 'delivery_value', '100%'),
('metrics.delivery_label', 'es', 'metrics', 'delivery_label', 'entregas a tiempo'),
('metrics.response_value', 'es', 'metrics', 'response_value', '<24hs'),
('metrics.response_label', 'es', 'metrics', 'response_label', 'tiempo de respuesta'),
('metrics.experience_value', 'es', 'metrics', 'experience_value', '8 años'),
('metrics.experience_label', 'es', 'metrics', 'experience_label', 'experiencia combinada'),

-- Featured case ES
('case.title', 'es', 'featured_case', 'title', 'Ofikio: el CRM que reemplazó WhatsApp y planillas'),
('case.description', 'es', 'featured_case', 'description', 'Ofikio es una empresa de alquiler de mobiliario de oficina. Antes gestionaban todo por WhatsApp y Excel. Hoy tienen un CRM propio con gestión de inventario, contratos y facturación.'),
('case.metric_1_value', 'es', 'featured_case', 'metric_1_value', '212'),
('case.metric_1_label', 'es', 'featured_case', 'metric_1_label', 'materiales en inventario'),
('case.metric_2_value', 'es', 'featured_case', 'metric_2_value', '+30'),
('case.metric_2_label', 'es', 'featured_case', 'metric_2_label', 'features entregadas'),
('case.metric_3_value', 'es', 'featured_case', 'metric_3_value', '4 meses'),
('case.metric_3_label', 'es', 'featured_case', 'metric_3_label', 'de idea a MVP en producción'),

-- CTA final ES
('cta.title', 'es', 'cta_final', 'title', '¿Tenés un proyecto en mente?'),
('cta.subtitle', 'es', 'cta_final', 'subtitle', 'Contanos en qué estás trabajando. Te respondemos en menos de 24hs.'),

-- Hero EN
('hero.badge', 'en', 'hero', 'badge', 'Building software from Tucumán for all of LATAM'),
('hero.title_line1', 'en', 'hero', 'title_line1', 'Software your business'),
('hero.title_line2', 'en', 'hero', 'title_line2', 'needed yesterday.'),
('hero.subtitle', 'en', 'hero', 'subtitle', 'We design and develop custom CRMs, websites, chatbots, and integrations. From idea to deploy, with AI at the core.'),

-- Metrics EN
('metrics.projects_value', 'en', 'metrics', 'projects_value', '3'),
('metrics.projects_label', 'en', 'metrics', 'projects_label', 'projects in production'),
('metrics.delivery_value', 'en', 'metrics', 'delivery_value', '100%'),
('metrics.delivery_label', 'en', 'metrics', 'delivery_label', 'on-time delivery'),
('metrics.response_value', 'en', 'metrics', 'response_value', '<24h'),
('metrics.response_label', 'en', 'metrics', 'response_label', 'response time'),
('metrics.experience_value', 'en', 'metrics', 'experience_value', '8 years'),
('metrics.experience_label', 'en', 'metrics', 'experience_label', 'combined experience'),

-- Featured case EN
('case.title', 'en', 'featured_case', 'title', 'Ofikio: the CRM that replaced WhatsApp and spreadsheets'),
('case.description', 'en', 'featured_case', 'description', 'Ofikio rents office furniture. They used to manage everything through WhatsApp and Excel. Today they have a custom CRM with inventory management, contracts, and billing.'),
('case.metric_1_value', 'en', 'featured_case', 'metric_1_value', '212'),
('case.metric_1_label', 'en', 'featured_case', 'metric_1_label', 'items in inventory'),
('case.metric_2_value', 'en', 'featured_case', 'metric_2_value', '+30'),
('case.metric_2_label', 'en', 'featured_case', 'metric_2_label', 'features delivered'),
('case.metric_3_value', 'en', 'featured_case', 'metric_3_value', '4 months'),
('case.metric_3_label', 'en', 'featured_case', 'metric_3_label', 'from idea to MVP in production'),

-- CTA final EN
('cta.title', 'en', 'cta_final', 'title', 'Got a project in mind?'),
('cta.subtitle', 'en', 'cta_final', 'subtitle', 'Tell us what you''re building. We''ll get back to you within 24 hours.');
