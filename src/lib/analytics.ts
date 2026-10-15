/** Eventos sem PII. Nenhum provedor ou requisição de analytics é instalado aqui. */
export type ConversionName =
  | "contact_click"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "form_attempt"
  | "form_unavailable"
  | "form_error"
  | "generate_lead";
export function trackConversion(
  event: ConversionName,
  placement = "interest_form",
) {
  if (typeof window === "undefined") return;
  const detail = { event, placement };
  window.dispatchEvent(new CustomEvent("clara:conversion", { detail }));
}
