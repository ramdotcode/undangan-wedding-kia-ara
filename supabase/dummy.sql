-- =============================================================
-- Data dummy untuk wedding invitation Kia & Ara
-- Cara pakai: buka Supabase Dashboard → SQL Editor → New query
-- → paste seluruh isi file ini → Run
-- (Pastikan supabase/schema.sql sudah dijalankan dulu)
--
-- created_at di-set mundur supaya urutan di list (sort desc by created_at)
-- cocok dengan urutan di pesan: entry paling bawah = yang paling baru.
-- =============================================================

insert into public.wishes_kia_ara (name, message, attendance, created_at) values
  ('H. Farhan D. Prianggi, S.Ip',
   'Selamat kiw semoga lancar sampai hari H dan doa terbaik untuk kalian berdua aminn 🤲🏾',
   'hadir',
   now() - interval '15 days'),

  ('Bupati Ciamis Ade Sopyana',
   'Selamat Ervina semoga lancar sampai hari H',
   'hadir',
   now() - interval '14 days'),

  ('Alifia Rachmanita',
   'Selamat sayanggg ku, akhirnya sampai di titik ini yaa. Selamat menjalani ibadah terpanjang semoga menjadi keluarga sakinnah mawwadah warahmah. Di lancarkan semuanya yaaa Aamiinn 🫶😇🤲',
   'tidak',
   now() - interval '13 days'),

  ('Vina Khaerani',
   'Congrass Ervina😍 semoga jadi keluarga SAMAWA🤲🏻🫶🏻 lancar sampai hari H yaa🤍',
   'tidak',
   now() - interval '12 days'),

  ('Dhiya',
   'Happy wedding ervina si baik hati dan ramah, lancar sampai hari H yaa. Samawa, doa terbaik.',
   'tidak',
   now() - interval '11 days'),

  ('Araa',
   'Wilujeng teh araa & suami, lancar sampe hari H luvvv 💗',
   'tidak',
   now() - interval '10 days'),

  ('Nikita Vitaloka',
   'Happy wedding teh ara dan suami, happy for u🥹 lancar sampe hari H yaa💖💖',
   'tidak',
   now() - interval '9 days'),

  ('Dita Mergyan',
   'Alhamdulillah ikut seneng neng, happy wedding.. samawa yaa 🥳',
   'hadir',
   now() - interval '8 days'),

  ('Prita',
   'MasyaAllah tetehku, wilujeng teh..turut berbahagia, lancar dan sehat selalu sampai hari h😍🩷',
   'tidak',
   now() - interval '7 days'),

  ('Rstaputri',
   'Masyaallah lancar sampe hari H teteh cantikk bageur💓💓💓',
   'tidak',
   now() - interval '6 days'),

  ('Sasa indah',
   'Masyaallah sayang, Happy for you🫶🏻 lancar sampe hari H yaa. Langgeng terus sampe maut yang memisahkan🕊️🌹',
   'hadir',
   now() - interval '5 days'),

  ('Rilla Listia',
   'MasyaAllah ngiring bingah pisan teh🤍 Mugia acara pernikahanana lancar, barokah, sareng janten kulawarga nu sakinah, mawaddah, warahmah. Aamiin✨🤍',
   'tidak',
   now() - interval '4 days'),

  ('Dinar Auliaa & Ivaldy Chefa',
   'finally my lovebirdss!! so happy for u both, semoga cinta selalu menguatkan kalian berdua lebih dari selamanya 🥹💗 insyaa allah kita usahain dateng kalau "memungkinkan" yaaa luvv💗',
   'hadir',
   now() - interval '3 days');
