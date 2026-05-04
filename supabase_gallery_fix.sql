-- ============================================================
-- AM Collision & Towing — Gallery Fix
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================

-- ── STEP 1: Create the media_gallery table ───────────────────
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text     TEXT,
  mime_type    TEXT,
  size_bytes   BIGINT,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  sort_order   INT NOT NULL DEFAULT 0,
  uploaded_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── STEP 2: Enable RLS on media_gallery ─────────────────────
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;

-- ── STEP 3: RLS policies for media_gallery ──────────────────
DROP POLICY IF EXISTS "Public can view gallery"      ON public.media_gallery;
DROP POLICY IF EXISTS "Admins can insert gallery"    ON public.media_gallery;
DROP POLICY IF EXISTS "Admins can update gallery"    ON public.media_gallery;
DROP POLICY IF EXISTS "Admins can delete gallery"    ON public.media_gallery;

-- Anyone (including anon visitors) can read gallery images
CREATE POLICY "Public can view gallery"
  ON public.media_gallery FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert gallery"
  ON public.media_gallery FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update
CREATE POLICY "Admins can update gallery"
  ON public.media_gallery FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete
CREATE POLICY "Admins can delete gallery"
  ON public.media_gallery FOR DELETE
  USING (public.is_admin());

-- ── STEP 4: Create the "media" storage bucket ────────────────
-- This creates a PUBLIC bucket named "media" (images are publicly accessible)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800,   -- 50 MB limit per file
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/ogg','video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/ogg','video/quicktime'];

-- ── STEP 5: Storage RLS policies for the "media" bucket ─────
-- Drop old policies if any exist
DROP POLICY IF EXISTS "Public can view media"     ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media"   ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media"   ON storage.objects;

-- Anyone can read files in the "media" bucket (public gallery)
CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Only admins can upload to the "media" bucket
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND public.is_admin()
  );

-- Only admins can delete from the "media" bucket
CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND public.is_admin()
  );

-- Only admins can update objects in the "media" bucket
CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND public.is_admin()
  );

-- ── STEP 6: Verify ──────────────────────────────────────────
SELECT 'media_gallery columns:' AS info, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'media_gallery'
ORDER BY ordinal_position;

SELECT 'media bucket:' AS info, id, name, public
FROM storage.buckets
WHERE id = 'media';
