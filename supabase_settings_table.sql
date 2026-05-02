-- ============================================================
-- AM Collision & Towing — Site Settings Table
-- Run this in the Supabase SQL Editor to enable Settings tab
-- ============================================================

-- ── Create the table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Auto-update timestamp ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_site_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_site_settings_updated_at();

-- ── Enable RLS ────────────────────────────────────────────────
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ─────────────────────────────────────────────
-- Everyone (including anonymous visitors) can READ settings
-- (needed so the public site can load phone/address/etc.)
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only admins can write settings
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── Seed default rows (won't overwrite if they already exist) ─
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{
    "site_name":  "AM Collision & Towing",
    "tagline":    "Your Trusted Auto Body & Towing Experts",
    "phone":      "+1 631-676-4440",
    "fax":        "+1 631-676-4443",
    "email":      "amcollisionandtowing@gmail.com",
    "address":    "500 Johnson Ave, Bohemia, New York 11716"
  }'::jsonb),
  ('branding', '{
    "logo_url":      null,
    "favicon_url":   null,
    "primary_color": "#dc2626",
    "hero_tagline":  null
  }'::jsonb),
  ('social', '{
    "facebook":    null,
    "instagram":   null,
    "google_maps": null,
    "yelp":        null
  }'::jsonb),
  ('notifications', '{
    "admin_email":        "amcollisionandtowing@gmail.com",
    "send_user_emails":   true,
    "send_admin_emails":  true
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ── Verify ────────────────────────────────────────────────────
SELECT key, updated_at FROM public.site_settings ORDER BY key;
