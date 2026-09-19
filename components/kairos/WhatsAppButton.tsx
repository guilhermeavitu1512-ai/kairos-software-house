import { buildWhatsAppUrl } from "@/lib/constants";

export default function WhatsAppButton() {
  return <a className="whatsapp-float" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Solicitar orçamento pelo WhatsApp"><span>WA</span><em>Solicitar orçamento</em></a>;
}
