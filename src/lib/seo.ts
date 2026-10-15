import { site, sitePath } from "./site";
export function publicOrigin(value: string): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    /^(localhost|127\.|\[::1\])/.test(url.hostname)
  )
    throw new Error(
      "NEXT_PUBLIC_SITE_URL deve ser uma origem HTTPS pública, sem caminho, credenciais ou parâmetros.",
    );
  return url.origin;
}
export const origin = publicOrigin(site.url);
export const homeUrl = origin ? `${origin}${sitePath("/")}` : null;
export const seoTitle = `IA para clínicas em Ribeirão Preto | ${site.name}`;
export function structuredData() {
  const id = origin ? `${homeUrl}#organization` : "#organization";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": id,
        name: site.name,
        description: site.description,
        ...(origin ? { url: homeUrl } : {}),
        ...(site.email ? { email: site.email } : {}),
        ...(site.phone ? { telephone: site.phone } : {}),
      },
      {
        "@type": "Service",
        name: "Automação administrativa com IA para clínicas",
        serviceType: "Automações personalizadas com inteligência artificial",
        description: site.description,
        provider: { "@id": id },
        areaServed: {
          "@type": "City",
          name: "Ribeirão Preto",
          containedInPlace: { "@type": "State", name: "São Paulo" },
        },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Clínicas odontológicas e consultórios de nutrição",
        },
        ...(origin ? { url: homeUrl } : {}),
      },
    ],
  };
}
