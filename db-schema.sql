-- ============================================================
-- AM Collision & Towing — Database Schema
-- Run this in Supabase SQL Editor (safe to re-run).
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- HELPER: updated_at trigger function
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name  text        CHECK (char_length(full_name) <= 200),
  phone      text        CHECK (char_length(phone) <= 30),
  role       text        NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── SECURITY: block non-admins from changing their own role ──
-- Without this trigger, any logged-in user could run:
--   UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
-- The RLS WITH CHECK clause alone cannot compare OLD vs NEW
-- values, so we use a BEFORE UPDATE trigger instead.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Permission denied: only admins can change roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_role_protection ON public.profiles;
CREATE TRIGGER enforce_role_protection
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();


-- ────────────────────────────────────────────────────────────
-- 2. LEADS  (homepage quick-request form)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id           uuid        NOT NULL DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  name         text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email        text        CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$' OR email IS NULL),
  phone        text        NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  service_type text        NOT NULL CHECK (char_length(service_type) <= 100),
  message      text        CHECK (char_length(message) <= 2000),
  status       text        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 3. CONTACT SUBMISSIONS  (contact page form)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         uuid        NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name       text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email      text        NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  phone      text        CHECK (char_length(phone) <= 30),
  subject    text        CHECK (char_length(subject) <= 300),
  message    text        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  status     text        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  CONSTRAINT contact_submissions_pkey PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS contacts_set_updated_at ON public.contact_submissions;
CREATE TRIGGER contacts_set_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 4. QUOTE REQUESTS  (detailed auto-body quote form)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id                  uuid           NOT NULL DEFAULT gen_random_uuid(),
  created_at          timestamptz    NOT NULL DEFAULT now(),
  updated_at          timestamptz    NOT NULL DEFAULT now(),
  name                text           NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email               text           NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  phone               text           NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 30),
  vehicle_year        text           CHECK (char_length(vehicle_year) <= 10),
  vehicle_make        text           CHECK (char_length(vehicle_make) <= 100),
  vehicle_model       text           CHECK (char_length(vehicle_model) <= 100),
  vehicle_color       text           CHECK (char_length(vehicle_color) <= 50),
  damage_description  text           CHECK (char_length(damage_description) <= 3000),
  service_needed      text           CHECK (char_length(service_needed) <= 200),
  estimated_budget    text           CHECK (char_length(estimated_budget) <= 100),
  status              text           NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'approved', 'completed', 'declined')),
  quote_amount        numeric(10,2),
  quote_sent_at       timestamptz,
  CONSTRAINT quote_requests_pkey PRIMARY KEY (id)
);

DROP TRIGGER IF EXISTS quotes_set_updated_at ON public.quote_requests;
CREATE TRIGGER quotes_set_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 5. SITE SETTINGS  (admin-editable key → jsonb store)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text        NOT NULL CHECK (char_length(key) <= 100),
  value      jsonb       NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);

DROP TRIGGER IF EXISTS site_settings_set_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_set_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed defaults (safe to re-run — ON CONFLICT DO NOTHING)
INSERT INTO public.site_settings (key, value) VALUES
  ('general',  '{
    "site_name":  "AM Collision & Towing",
    "tagline":    "Your Trusted Auto Body & Towing Experts",
    "phone":      "+1 631-676-4440",
    "fax":        "+1 631-676-4443",
    "email":      "amcollisionandtowing@gmail.com",
    "address":    "500 Johnson Ave, Bohemia, New York 11716"
  }'),
  ('branding', '{
    "logo_url":       null,
    "favicon_url":    null,
    "primary_color":  "#dc2626",
    "hero_tagline":   null
  }'),
  ('social',   '{
    "facebook":    null,
    "instagram":   null,
    "google_maps": null,
    "yelp":        null
  }'),
  ('notifications', '{
    "admin_email":       "amcollisionandtowing@gmail.com",
    "send_user_emails":  true,
    "send_admin_emails": true
  }')
ON CONFLICT (key) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 6. MEDIA GALLERY  (images managed via Supabase Storage)
-- ────────────────────────────────────────────────────────────
-- NOTE: Before using, create a Storage bucket named "media"
--       in Supabase Dashboard → Storage → New Bucket
--       Set it to PUBLIC so images are accessible without auth.
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id           uuid        NOT NULL DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  name         text        NOT NULL CHECK (char_length(name) <= 300),
  url          text        NOT NULL,
  storage_path text        NOT NULL UNIQUE,
  mime_type    text        CHECK (mime_type ~ '^image/'),
  size_bytes   bigint      CHECK (size_bytes > 0),
  alt_text     text        CHECK (char_length(alt_text) <= 500),
  tags         text[]      NOT NULL DEFAULT '{}',
  sort_order   integer     NOT NULL DEFAULT 0,
  uploaded_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT media_gallery_pkey PRIMARY KEY (id)
);


-- ────────────────────────────────────────────────────────────
-- 7. PERFORMANCE INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS leads_status_idx          ON public.leads               (status);
CREATE INDEX IF NOT EXISTS leads_created_idx         ON public.leads               (created_at DESC);

CREATE INDEX IF NOT EXISTS contacts_status_idx       ON public.contact_submissions  (status);
CREATE INDEX IF NOT EXISTS contacts_created_idx      ON public.contact_submissions  (created_at DESC);

CREATE INDEX IF NOT EXISTS quotes_status_idx         ON public.quote_requests       (status);
CREATE INDEX IF NOT EXISTS quotes_created_idx        ON public.quote_requests       (created_at DESC);

CREATE INDEX IF NOT EXISTS profiles_role_idx         ON public.profiles             (role);

CREATE INDEX IF NOT EXISTS gallery_sort_idx          ON public.media_gallery        (sort_order, created_at DESC);


-- ────────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery       ENABLE ROW LEVEL SECURITY;

-- Helper: is the caller an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── profiles ───────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: own select"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin select"  ON public.profiles;
DROP POLICY IF EXISTS "profiles: own insert"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: own update"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin update"  ON public.profiles;

-- Users see only their own row; admins see all
CREATE POLICY "profiles: own select"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: admin select"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can only insert their own row (trigger forces role = 'user')
CREATE POLICY "profiles: own insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own name/phone (NOT role — trigger blocks that)
CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g. promote a user to admin)
CREATE POLICY "profiles: admin update"
  ON public.profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── leads ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "leads: public insert" ON public.leads;
DROP POLICY IF EXISTS "leads: admin select"  ON public.leads;
DROP POLICY IF EXISTS "leads: admin update"  ON public.leads;
DROP POLICY IF EXISTS "leads: admin delete"  ON public.leads;

CREATE POLICY "leads: public insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads: admin select"  ON public.leads FOR SELECT  USING (public.is_admin());
CREATE POLICY "leads: admin update"  ON public.leads FOR UPDATE  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "leads: admin delete"  ON public.leads FOR DELETE  USING (public.is_admin());

-- ── contact_submissions ────────────────────────────────────
DROP POLICY IF EXISTS "contacts: public insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "contacts: admin select"  ON public.contact_submissions;
DROP POLICY IF EXISTS "contacts: admin update"  ON public.contact_submissions;
DROP POLICY IF EXISTS "contacts: admin delete"  ON public.contact_submissions;

CREATE POLICY "contacts: public insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts: admin select"  ON public.contact_submissions FOR SELECT  USING (public.is_admin());
CREATE POLICY "contacts: admin update"  ON public.contact_submissions FOR UPDATE  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "contacts: admin delete"  ON public.contact_submissions FOR DELETE  USING (public.is_admin());

-- ── quote_requests ─────────────────────────────────────────
DROP POLICY IF EXISTS "quotes: public insert" ON public.quote_requests;
DROP POLICY IF EXISTS "quotes: admin select"  ON public.quote_requests;
DROP POLICY IF EXISTS "quotes: admin update"  ON public.quote_requests;
DROP POLICY IF EXISTS "quotes: admin delete"  ON public.quote_requests;

CREATE POLICY "quotes: public insert" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "quotes: admin select"  ON public.quote_requests FOR SELECT  USING (public.is_admin());
CREATE POLICY "quotes: admin update"  ON public.quote_requests FOR UPDATE  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "quotes: admin delete"  ON public.quote_requests FOR DELETE  USING (public.is_admin());

-- ── site_settings ──────────────────────────────────────────
DROP POLICY IF EXISTS "settings: public select" ON public.site_settings;
DROP POLICY IF EXISTS "settings: admin update"  ON public.site_settings;
DROP POLICY IF EXISTS "settings: admin insert"  ON public.site_settings;

CREATE POLICY "settings: public select" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings: admin update"  ON public.site_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "settings: admin insert"  ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());

-- ── media_gallery ──────────────────────────────────────────
DROP POLICY IF EXISTS "gallery: public select" ON public.media_gallery;
DROP POLICY IF EXISTS "gallery: admin insert"  ON public.media_gallery;
DROP POLICY IF EXISTS "gallery: admin update"  ON public.media_gallery;
DROP POLICY IF EXISTS "gallery: admin delete"  ON public.media_gallery;

CREATE POLICY "gallery: public select" ON public.media_gallery FOR SELECT USING (true);
CREATE POLICY "gallery: admin insert"  ON public.media_gallery FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "gallery: admin update"  ON public.media_gallery FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery: admin delete"  ON public.media_gallery FOR DELETE USING (public.is_admin());
