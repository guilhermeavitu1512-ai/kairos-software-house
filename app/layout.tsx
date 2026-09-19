import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import SiteChrome from "@/components/kairos/SiteChrome";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import "./editorial.css";

const title = "KAIROS — Software House";
const description = "Sites, aplicativos, sistemas, SaaS, automações e produtos digitais desenvolvidos para resolver problemas reais.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : "https://kairos.software";
  return {
    metadataBase: new URL(origin),
    title: { default: title, template: "%s — KAIROS" },
    description,
    alternates: { canonical: origin },
    openGraph: { title, description, type: "website", locale: "pt_BR", siteName: "KAIROS", url: origin, images: [{ url: `${origin}/og-kairos-editorial.png`, width: 1731, height: 909, alt: "KAIROS — Transformamos problemas em software." }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og-kairos-editorial.png`] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#030914", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Ir para o conteúdo</a><SiteChrome>{children}</SiteChrome></body></html>;
}
