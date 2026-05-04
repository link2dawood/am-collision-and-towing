-- ============================================================
-- AM Collision & Towing — Admin management RPCs
-- Lets existing admins list users and promote/demote others.
-- Run this ENTIRE script in your Supabase SQL Editor.
-- ============================================================

-- ── List users with email (admins only) ──────────────────────
-- profiles RLS lets admins SELECT all rows, but auth.users is
-- privileged. This SECURITY DEFINER fn safely joins them.
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  id         uuid,
  email      text,
  full_name  text,
  phone      text,
  role       text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin only';
  END IF;

  RETURN QUERY
    SELECT
      p.id,
      u.email::text       AS email,
      p.full_name,
      p.phone,
      p.role,
      p.created_at
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    ORDER BY (p.role = 'admin') DESC, p.created_at DESC;
END;
$$;

-- ── Promote a user to admin by their email ───────────────────
CREATE OR REPLACE FUNCTION public.admin_promote_by_email(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_uid uuid;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin only';
  END IF;

  SELECT id INTO v_uid
  FROM auth.users
  WHERE lower(email) = lower(trim(p_email))
  LIMIT 1;

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No user with that email. They must sign up first.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = v_uid;

  RETURN v_uid;
END;
$$;

-- ── Demote an admin back to user ─────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_demote(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin only';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot demote yourself.';
  END IF;

  -- Refuse to remove the last admin so the dashboard never gets locked out.
  IF (SELECT count(*) FROM public.profiles WHERE role = 'admin') <= 1 THEN
    RAISE EXCEPTION 'Cannot demote the last remaining admin.';
  END IF;

  UPDATE public.profiles
  SET role = 'user'
  WHERE id = p_user_id;
END;
$$;

-- Allow authenticated users to call these (the fns themselves enforce admin).
GRANT EXECUTE ON FUNCTION public.admin_list_users()             TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_promote_by_email(text)   TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_demote(uuid)             TO authenticated;
