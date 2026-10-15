import type { Metadata, Viewport } from "next";
import { ConversionTracker } from "@/components/conversion-tracker";
import { origin, homeUrl, seoTitle } from "@/lib/seo";
import { site } from "@/lib/site";
import localFont from "next/font/local";
const manrope = localFont({
  src: "../../public/fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  preload: true,
});
import "./globals.css";
export const metadata: Metadata = {
  title: seoTitle,
  description: site.description,
  ...(origin
    ? { metadataBase: new URL(origin), alternates: { canonical: homeUrl } }
    : {}),
  openGraph: {
    title: seoTitle,
    description: site.description,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: Boolean(origin), follow: true },
};
export const viewport: Viewport = { themeColor: "#153f35" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <ConversionTracker />
        {children}
      </body>
    </html>
  );
}
