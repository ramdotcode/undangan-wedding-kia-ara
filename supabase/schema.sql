-- =============================================================
-- Schema untuk wedding invitation Kia & Ara
-- Cara pakai: buka Supabase Dashboard → SQL Editor → New query
-- → paste seluruh isi file ini → Run
-- =============================================================

-- Tabel utama: ucapan & status kehadiran tamu.
-- Konvensi: tiap project wedding punya tabel sendiri dengan suffix nama
-- pasangan, misal wishes_kia_ara, wishes_budi_siti. Supaya 1 DB bisa
-- dipake banyak web tanpa saling berebut data.
create table if not exists public.wishes_kia_ara (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 60),
  message     text not null check (char_length(message) between 1 and 300),
  attendance  text not null check (attendance in ('hadir', 'tidak')),
  created_at  timestamptz not null default now()
);

-- Index untuk sort list (newest first)
create index if not exists wishes_kia_ara_created_at_idx
  on public.wishes_kia_ara (created_at desc);

-- Aktifkan Row Level Security
alter table public.wishes_kia_ara enable row level security;

-- Policy: siapa saja (anon) boleh INSERT ucapan
drop policy if exists "anon_insert_wishes_kia_ara" on public.wishes_kia_ara;
create policy "anon_insert_wishes_kia_ara"
  on public.wishes_kia_ara
  for insert
  to anon
  with check (true);

-- Policy: siapa saja (anon) boleh SELECT/melihat semua ucapan
drop policy if exists "anon_select_wishes_kia_ara" on public.wishes_kia_ara;
create policy "anon_select_wishes_kia_ara"
  on public.wishes_kia_ara
  for select
  to anon
  using (true);

-- (Tidak ada UPDATE/DELETE policy untuk anon — tamu tidak bisa edit/hapus.
--  Kalau nanti perlu moderasi, tambahkan policy untuk role authenticated
--  atau gunakan service_role dari server-side.)
