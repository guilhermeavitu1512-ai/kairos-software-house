import type { Metadata, Viewport } from "next";
import { COMPANY } from "@/lib/constants";
import SiteChrome from "@/components/kairos/SiteChrome";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import "./editorial.css";

const title = "KAIROS — Software House";
const description = "Sites, sistemas, apps e automações. Da presença digital aos processos que movem seu negócio, com escopo definido e atendimento direto.";

export async function generateMetadata(): Promise<Metadata> {
  const origin = COMPANY.siteUrl;
  return {
    metadataBase: new URL(origin),
    title: { default: title, template: "%s — KAIROS" },
    description,
    openGraph: { title, description, type: "website", locale: "pt_BR", siteName: "KAIROS", images: [{ url: `${origin}/og-kairos-editorial.png`, width: 1731, height: 909, alt: "KAIROS — Sites, sistemas, apps e automações." }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og-kairos-editorial.png`] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#030914", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><SiteChrome>{children}</SiteChrome></body></html>;
}
