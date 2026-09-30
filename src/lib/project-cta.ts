export const DEFAULT_PROJECT_CTA_URL = "https://landing-ideas.web.app/";

export const DEFAULT_WHATSAPP_NUMBER = "201555686164";

export const DEFAULT_WHATSAPP_MESSAGE_AR =
  "مرحباً بكم، أرغب في التواصل مع فريق Archai Solutions.";

export const DEFAULT_WHATSAPP_MESSAGE_EN =
  "Hello, I'd like to get in touch with the Archai Solutions team.";

type CTASettings = {
  projectCtaUrl?: string | null;
  whatsappNumber?: string | null;
  whatsappMessageAr?: string | null;
  whatsappMessageEn?: string | null;
};

export function getProjectCtaUrl(settings: CTASettings | null | undefined) {
  return settings?.projectCtaUrl?.trim() || DEFAULT_PROJECT_CTA_URL;
}

export function getEngineersWhatsAppUrl(
  settings: CTASettings | null | undefined,
) {
  const number =
    settings?.whatsappNumber?.replace(/[^\d]/g, "") || DEFAULT_WHATSAPP_NUMBER;

  const arabicMessage =
    settings?.whatsappMessageAr?.trim() || DEFAULT_WHATSAPP_MESSAGE_AR;

  const englishMessage =
    settings?.whatsappMessageEn?.trim() || DEFAULT_WHATSAPP_MESSAGE_EN;

  const message = `${arabicMessage}\n\n${englishMessage}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
