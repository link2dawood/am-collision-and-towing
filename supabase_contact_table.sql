-- ============================================================
-- AM Collision & Towing — Contact Submissions Table
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Create the contact_submissions table ─────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,               -- stores the service type / topic
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',  -- new | read | replied
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── STEP 2: Add missing columns if table already exists ───────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='contact_submissions' AND column_name='phone') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='contact_submissions' AND column_name='subject') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN subject TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='contact_submissions' AND column_name='status') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'new';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='contact_submissions' AND column_name='updated_at') THEN
    ALTER TABLE public.contact_submissions ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END;
$$;

-- ── STEP 3: Auto-update updated_at trigger ───────────────────
CREATE OR REPLACE FUNCTION public.handle_contact_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_contact_updated_at ON public.contact_submissions;
CREATE TRIGGER set_contact_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_contact_updated_at();

-- ── STEP 4: Enable RLS ────────────────────────────────────────
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ── STEP 5: RLS Policies ──────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions"  ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

-- Public (no auth) can submit the contact form
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only admins can view all submissions
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions FOR SELECT
  USING (public.is_admin());

-- Only admins can update status (new → read → replied)
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete submissions
CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  USING (public.is_admin());

-- ── STEP 6: Verify schema ─────────────────────────────────────
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'contact_submissions'
ORDER BY ordinal_position;
