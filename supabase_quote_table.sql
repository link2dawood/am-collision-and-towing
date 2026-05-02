-- ============================================================
-- AM Collision & Towing — Quote Requests Table
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Create the quote_requests table ───────────────────
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Customer info
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  -- Vehicle info
  vehicle_year        TEXT,
  vehicle_make        TEXT,
  vehicle_model       TEXT,
  vehicle_color       TEXT,
  -- Job info
  damage_description  TEXT,
  service_needed      TEXT,
  estimated_budget    TEXT,
  -- Admin-filled fields
  quote_amount        NUMERIC(10,2),
  -- Workflow
  status              TEXT NOT NULL DEFAULT 'new',
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── STEP 2: Add any missing columns safely ────────────────────
DO $$
BEGIN
  -- vehicle fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='vehicle_year') THEN
    ALTER TABLE public.quote_requests ADD COLUMN vehicle_year TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='vehicle_make') THEN
    ALTER TABLE public.quote_requests ADD COLUMN vehicle_make TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='vehicle_model') THEN
    ALTER TABLE public.quote_requests ADD COLUMN vehicle_model TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='vehicle_color') THEN
    ALTER TABLE public.quote_requests ADD COLUMN vehicle_color TEXT;
  END IF;
  -- job fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='damage_description') THEN
    ALTER TABLE public.quote_requests ADD COLUMN damage_description TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='service_needed') THEN
    ALTER TABLE public.quote_requests ADD COLUMN service_needed TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='estimated_budget') THEN
    ALTER TABLE public.quote_requests ADD COLUMN estimated_budget TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='quote_amount') THEN
    ALTER TABLE public.quote_requests ADD COLUMN quote_amount NUMERIC(10,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='quote_requests' AND column_name='updated_at') THEN
    ALTER TABLE public.quote_requests ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END;
$$;

-- ── STEP 3: Auto-update updated_at trigger ────────────────────
CREATE OR REPLACE FUNCTION public.handle_quote_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_quote_updated_at ON public.quote_requests;
CREATE TRIGGER set_quote_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_quote_updated_at();

-- ── STEP 4: Enable RLS ────────────────────────────────────────
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- ── STEP 5: RLS Policies ──────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can submit quote requests"  ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view quote requests"    ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can update quote requests"  ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can delete quote requests"  ON public.quote_requests;

-- Public (no auth required) can submit a quote
CREATE POLICY "Anyone can submit quote requests"
  ON public.quote_requests FOR INSERT
  WITH CHECK (true);

-- Only admins can view, update, delete
CREATE POLICY "Admins can view quote requests"
  ON public.quote_requests FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete quote requests"
  ON public.quote_requests FOR DELETE
  USING (public.is_admin());

-- ── STEP 6: Verify ────────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'quote_requests'
ORDER BY ordinal_position;
