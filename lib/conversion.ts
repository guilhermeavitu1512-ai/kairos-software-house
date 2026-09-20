export type Conversion = "view_plans" | "plan_contact" | "whatsapp_open" | "form_start" | "form_complete";
// Provider-independent events. Never include form answers or personal data.
export function trackConversion(event: Conversion, details: { source?: string; plan?: string } = {}) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("kairos:conversion", { detail: { event, ...details } }));
}
