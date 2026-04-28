-- ============================================================
-- FIX: RLS policies for email-related tables
-- Safe version - skips VIEWs, only applies to BASE TABLEs
-- ============================================================

-- ── email_logs ───────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='email_logs'
    AND table_type='BASE TABLE'
  ) THEN
    ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;
    DROP POLICY IF EXISTS "Admins can view email logs"   ON public.email_logs;
    CREATE POLICY "System can insert email logs"
      ON public.email_logs FOR INSERT WITH CHECK (true);
    CREATE POLICY "Admins can view email logs"
      ON public.email_logs FOR SELECT USING (public.is_admin());
    RAISE NOTICE 'email_logs: policies applied.';
  ELSE
    RAISE NOTICE 'email_logs: not a base table or does not exist, skipping.';
  END IF;
END $$;

-- ── email_statistics (skip if VIEW) ──────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='email_statistics'
    AND table_type='BASE TABLE'
  ) THEN
    ALTER TABLE public.email_statistics ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "System can manage email statistics" ON public.email_statistics;
    DROP POLICY IF EXISTS "Admins can view email statistics"   ON public.email_statistics;
    CREATE POLICY "System can manage email statistics"
      ON public.email_statistics FOR ALL WITH CHECK (true);
    CREATE POLICY "Admins can view email statistics"
      ON public.email_statistics FOR SELECT USING (public.is_admin());
    RAISE NOTICE 'email_statistics: policies applied.';
  ELSE
    RAISE NOTICE 'email_statistics: is a VIEW or does not exist, skipping.';
  END IF;
END $$;

-- ── contact_submissions ───────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='contact_submissions'
    AND table_type='BASE TABLE'
  ) THEN
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
    DROP POLICY IF EXISTS "Admins can view contact submissions"   ON public.contact_submissions;
    CREATE POLICY "Anyone can insert contact submissions"
      ON public.contact_submissions FOR INSERT WITH CHECK (true);
    CREATE POLICY "Admins can view contact submissions"
      ON public.contact_submissions FOR SELECT USING (public.is_admin());
    RAISE NOTICE 'contact_submissions: policies applied.';
  ELSE
    RAISE NOTICE 'contact_submissions: not a base table or does not exist, skipping.';
  END IF;
END $$;

-- ── quote_requests ────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='quote_requests'
    AND table_type='BASE TABLE'
  ) THEN
    ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Anyone can insert quote requests" ON public.quote_requests;
    DROP POLICY IF EXISTS "Admins can view quote requests"   ON public.quote_requests;
    CREATE POLICY "Anyone can insert quote requests"
      ON public.quote_requests FOR INSERT WITH CHECK (true);
    CREATE POLICY "Admins can view quote requests"
      ON public.quote_requests FOR SELECT USING (public.is_admin());
    RAISE NOTICE 'quote_requests: policies applied.';
  ELSE
    RAISE NOTICE 'quote_requests: not a base table or does not exist, skipping.';
  END IF;
END $$;

-- ── recent_leads (skip if VIEW) ───────────────────────────────
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='recent_leads'
    AND table_type='BASE TABLE'
  ) THEN
    ALTER TABLE public.recent_leads ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins can view recent leads" ON public.recent_leads;
    CREATE POLICY "Admins can view recent leads"
      ON public.recent_leads FOR SELECT USING (public.is_admin());
    RAISE NOTICE 'recent_leads: policies applied.';
  ELSE
    RAISE NOTICE 'recent_leads: is a VIEW or does not exist, skipping.';
  END IF;
END $$;

-- ── Show what tables vs views exist ──────────────────────────
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_type, table_name;
