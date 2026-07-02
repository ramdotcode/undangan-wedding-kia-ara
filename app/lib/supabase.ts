"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client untuk browser. Dipakai langsung dari client component
 * (lihat app/components/Wishes.tsx). Env var wajib di-set di .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
