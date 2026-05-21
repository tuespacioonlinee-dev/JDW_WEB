-- ============================================================
-- JDC Developers — Case Studies
-- Migration: 20260521_case_studies.sql
-- ============================================================

-- ============================================================
-- TABLE: case_studies
-- Bilingual portfolio entries shown on /trabajo and the home page
-- ============================================================

create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  category_es text not null default '' check (length(category_es) <= 80),
  category_en text not null default '' check (length(category_en) <= 80),
  description_es text not null default '' check (length(description_es) <= 1000),
  description_en text not null default '' check (length(description_en) <= 1000),
  -- metrics: jsonb array of { "label_es": text, "label_en": text }
  metrics jsonb not null default '[]'::jsonb,
  image_url text check (length(image_url) <= 1000),
  color text not null default 'teal' check (color in ('teal', 'purple', 'coral', 'pink')),
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table case_studies enable row level security;

-- Anyone can read published cases (public site)
create policy "case_studies_public_read"
  on case_studies for select
  to anon, authenticated
  using (published = true);

-- Admins can do everything (read drafts + write)
create policy "case_studies_admin_all"
  on case_studies for all
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

-- Index for ordered listing
create index if not exists case_studies_order_idx
  on case_studies (display_order asc, created_at desc);

-- Auto-update updated_at (reuses update_updated_at() from the init migration)
create trigger case_studies_updated_at
  before update on case_studies
  for each row execute procedure update_updated_at();

-- ============================================================
-- STORAGE: case-images bucket
-- Public bucket for case study images. Writes happen server-side
-- with the service_role key (which bypasses RLS).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('case-images', 'case-images', true)
on conflict (id) do nothing;

-- Public read of objects in the bucket
create policy "case_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'case-images');

-- ============================================================
-- SEED: migrate the existing hardcoded "Ofikio" case
-- ============================================================

insert into case_studies
  (name, category_es, category_en, description_es, description_en, metrics, color, display_order, published)
values
  (
    'Ofikio',
    'CRM a medida',
    'Custom CRM',
    'Sistema de gestión para empresa de alquiler de mobiliario de oficina. Reemplazó WhatsApp y planillas de Excel.',
    'Management system for an office furniture rental company. Replaced WhatsApp and Excel spreadsheets.',
    '[
      {"label_es": "212 materiales", "label_en": "212 items"},
      {"label_es": "+30 features", "label_en": "+30 features"},
      {"label_es": "MVP en 4 meses", "label_en": "MVP in 4 months"}
    ]'::jsonb,
    'teal',
    0,
    true
  );
