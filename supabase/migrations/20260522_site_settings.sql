-- ============================================================
-- JDC Developers — Site Settings
-- Migration: 20260522_site_settings.sql
-- Key/value store for global, non-localized site settings
-- (contact info, social links, Calendly URL) editable from /admin/config
-- ============================================================

create table if not exists site_settings (
  key text primary key,
  value text not null default '' check (length(value) <= 500),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

alter table site_settings enable row level security;

-- Anyone can read settings (public site renders them)
create policy "site_settings_public_read"
  on site_settings for select
  to anon, authenticated
  using (true);

-- Only admins can write
create policy "site_settings_admin_write"
  on site_settings for all
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

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute procedure update_updated_at();

-- Seed defaults (mirror current hardcoded values)
insert into site_settings (key, value) values
  ('contact_email', 'hola@jdcdevelopers.com'),
  ('contact_whatsapp', ''),
  ('contact_location', 'Tucumán, Argentina'),
  ('social_github', 'https://github.com/jdcdevelopers'),
  ('social_linkedin', 'https://linkedin.com/company/jdcdevelopers'),
  ('social_x', 'https://twitter.com/jdcdevelopers'),
  ('calendly_url', 'https://calendly.com/jdcdevelopers')
on conflict (key) do nothing;
