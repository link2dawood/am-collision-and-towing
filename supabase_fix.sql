-- ============================================================
-- FIX 1: Infinite recursion in profiles RLS policy
-- The "Admins can view all profiles" policy was querying the
-- profiles table from within a profiles policy → infinite loop.
-- Solution: use a SECURITY DEFINER function that bypasses RLS.
-- ============================================================

-- Create a helper function that bypasses RLS (runs as postgres)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$;

-- ── PROFILES policies (non-recursive) ────────────────────────
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Users see their own profile; admins see all (via SECURITY DEFINER fn)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ── LEADS policies (also use the helper function) ─────────────
DROP POLICY IF EXISTS "Anyone can insert leads"   ON public.leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads"   ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads"   ON public.leads;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  USING (public.is_admin());


-- ============================================================
-- FIX 2: Make sure service_type column exists and has a default
-- so the live (not-yet-redeployed) site doesn't break
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'leads'
      AND column_name  = 'service_type'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN service_type TEXT NOT NULL DEFAULT '';
  ELSE
    -- Give it a default so the old live code (which inserts 'service' not 'service_type')
    -- doesn't violate NOT NULL until you redeploy
    ALTER TABLE public.leads ALTER COLUMN service_type SET DEFAULT '';
  END IF;
END;
$$;

-- Also ensure the 'service' column exists with a default for backward compat
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'leads'
      AND column_name  = 'service'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN service TEXT NOT NULL DEFAULT '';
  ELSE
    ALTER TABLE public.leads ALTER COLUMN service SET DEFAULT '';
  END IF;
END;
$$;

-- Verify
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;
