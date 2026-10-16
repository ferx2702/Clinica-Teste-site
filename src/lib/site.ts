export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function sitePath(path: string) {
  return `${basePath}${path}`;
}
/** Identidade e destinos públicos. Nunca coloque credenciais neste arquivo. */
export const site = {
  name: "Secretar.IA",
  description:
    "Automação com IA para clínicas odontológicas e consultórios de nutrição em Ribeirão Preto. Organize o atendimento e simplifique tarefas administrativas.",
  region: "Ribeirão Preto, SP",
  email: "fergasvi@outlook.com",
  phone: "+5516992915744", // Telefone comercial em formato internacional, ex.: +55…
  whatsapp: "5516992915744", // DDI + DDD + número, somente dígitos. Ex.: 55…
  url: process.env.NEXT_PUBLIC_SITE_URL || "", // URL pública definitiva, incluindo https://.
  leadEndpoint: "https://formspree.io/f/xrperlry", // Endpoint público; não é uma chave secreta.
  links: {
    demo: "#contato",
    preview: "#demonstracao",
    solutions: "#solucoes",
    process: "#como-funciona",
    specialties: "#para-quem",
    privacy: "/privacidade",
  },
};
export const navigation = [
  { label: "Soluções", href: site.links.solutions },
  { label: "Como funciona", href: site.links.process },
  { label: "Para quem", href: site.links.specialties },
];
export function whatsappUrl() {
  return /^55\d{10,11}$/.test(site.whatsapp)
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá! Quero conhecer as automações da " + site.name + " para minha clínica.")}`
    : null;
}
