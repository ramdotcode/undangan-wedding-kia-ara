/**
 * Template pesan undangan dalam 5 gaya bahasa.
 *
 * Placeholder yang akan di-substitusi oleh `buildMessage`:
 *   {name}  -> nama tamu (mis. "Bapak Budi" atau "Rafli")
 *   {link}  -> URL undangan personal (mis. https://domain.com/kia-ara?to=Rafli)
 *
 * Penulisan pakai `\n\n` agar WhatsApp merender dengan paragraf terpisah.
 */

export type TemplateId = "formal" | "muslim" | "nasrani" | "hindu" | "english";

export interface TemplateOption {
  id: TemplateId;
  label: string;
  preview: string;
  /** Body default — hardcoded. Bisa di-override user via `getEffectiveBody`. */
  body: string;
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: "formal",
    label: "Formal (Indonesia)",
    preview: "Tanpa mengurangi rasa hormat, perkenankan kami mengundang ...",
    body: `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *{name}* untuk menghadiri acara kami.

*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi :

{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih banyak atas perhatiannya.`,
  },
  {
    id: "muslim",
    label: "Muslim",
    preview: "Assalamu'alaikum Wr. Wb. — Dengan memohon rahmat Allah ...",
    body: `Assalamualaikum Warahmatullahi Wabarakatuh

Yth *{name}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami.

*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi :

{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih banyak atas perhatiannya.

Wassalamualaikum Warahmatullahi Wabarakatuh.`,
  },
  {
    id: "nasrani",
    label: "Nasrani",
    preview: "Shalom — Dengan penuh sukacita kami mengundang ...",
    body: `Kepada Yth.
*{name}*

Salam Sejahtera Bagi Kita Semua. Tuhan membuat segala sesuatu indah pada waktunya dan mempersatukan kami dalam suatu ikatan pernikahan kudus, semoga Tuhan memberkati dalam mengiringi pernikahan kami.

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i: untuk menghadiri acara kami.

Berikut link undangan kami:

{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

 Terima kasih.`,
  },
  {
    id: "hindu",
    label: "Hindu",
    preview: "Om Swastyastu — Dengan hati yang tulus ...",
    body: `Kepada Yth.
*{name}*

Om Swastiastu

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus sahabat, untuk menghadiri acara pernikahan kami :

Berikut link undangan kami untuk info lengkap dari acara bisa kunjungi :

{link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih banyak atas perhatiannya.

Om Shanti, Shanti, Shanti, Om.`,
  },
  {
    id: "english",
    label: "English",
    preview: "With great respect, we kindly invite ...",
    body: `To Dear.
*{name}*

Best wishes to us all. God makes everything beautiful in its time and unites us in a holy marriage bond, may God make it happen in accompanying our marriage.

Without reducing respect, please allow us to invite you to attend our event.

Here is our invitation link:

{link}

It would be a pleasure for us if you would like to attend and give your blessing.

 Thank you.`,
  },
];

export function getTemplate(id: TemplateId): TemplateOption {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
