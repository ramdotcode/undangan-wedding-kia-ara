import { getTemplate, type TemplateId } from "./templates";

/**
 * Bangun link undangan personal untuk satu nama tamu.
 * Format: {origin}/{id}?to={encodedName}
 *
 * Dipakai untuk teks di dalam pesan, dan juga untuk share ke Facebook.
 */
export function buildInviteLink(origin: string, id: string, name: string): string {
  const trimmedName = name.trim();
  const to = trimmedName ? encodeURIComponent(trimmedName) : "";
  return `${origin}/${id}?to=${to}`;
}

/**
 * Bangun pesan lengkap dengan substitusi {name} & {link}.
 * Trim nama dulu agar tidak ada spasi ganda.
 *
 * `customBody` (opsional) override body template default — dipakai untuk
 * teks yang sudah diedit user di UI.
 */
export function buildMessage(
  templateId: TemplateId,
  name: string,
  inviteLink: string,
  customBody?: string,
): string {
  const template = getTemplate(templateId);
  const body = customBody?.trim() ? customBody : template.body;
  const trimmedName = name.trim() || "Bapak/Ibu/Saudara/i";

  return body
    .replaceAll("{name}", trimmedName)
    .replaceAll("{link}", inviteLink);
}

/**
 * Hasilkan semua URL share + teks yang siap dipakai.
 * - waUrl: buka WhatsApp Web/App dengan pesan prefill (tanpa nomor tujuan)
 * - fbUrl: share link ke Facebook (FB sharer tidak support prefill text)
 * - inviteLink: link personal saja
 * - message: full message (untuk copy text)
 */
export interface ShareLinks {
  waUrl: string;
  fbUrl: string;
  inviteLink: string;
  message: string;
}

export function buildShareLinks(
  templateId: TemplateId,
  name: string,
  id: string,
  customBody?: string,
): ShareLinks {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const inviteLink = buildInviteLink(origin, id, name);
  const message = buildMessage(templateId, name, inviteLink, customBody);

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    inviteLink,
  )}`;

  return { waUrl, fbUrl, inviteLink, message };
}
