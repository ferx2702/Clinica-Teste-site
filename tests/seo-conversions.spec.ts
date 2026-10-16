import { test, expect } from "./fixtures";
import { publicOrigin } from "../src/lib/seo";
const configured = process.env.NEXT_PUBLIC_SITE_URL
  ? publicOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  : null;
test("SEO servido, semântica, JSON-LD e rastreamento", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    "IA para clínicas em Ribeirão Preto | Secretar.IA",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Automação com IA.*Ribeirão Preto/,
  );
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  const headings = await page
    .locator("h1,h2,h3")
    .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
  headings.forEach((level, i) => {
    if (i) expect(level - headings[i - 1]).toBeLessThanOrEqual(1);
  });
  const graph = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(graph["@context"]).toBe("https://schema.org");
  expect(graph["@graph"].map((e: { "@type": string }) => e["@type"])).toEqual([
    "Organization",
    "Service",
  ]);
  expect(graph["@graph"][1].provider["@id"]).toBe(graph["@graph"][0]["@id"]);
  expect(graph["@graph"][1].areaServed.name).toBe("Ribeirão Preto");
  expect(graph["@graph"][0]).not.toHaveProperty("aggregateRating");
  expect(graph["@graph"][0].email).toBe("fergasvi@outlook.com");
  expect(graph["@graph"][0].telephone).toBe("+5516992915744");
  await expect(page.locator('a[href="tel:+5516992915744"]')).toHaveCount(1);
  await expect(
    page.locator('a[href="mailto:fergasvi@outlook.com"]'),
  ).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    configured ? "index, follow" : "noindex, follow",
  );
  if (configured)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${configured}/`,
    );
  else await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Allow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  if (configured) {
    expect(await robots.text()).toContain(`Sitemap: ${configured}/sitemap.xml`);
    expect(await sitemap.text()).toContain(`<loc>${configured}/</loc>`);
  } else {
    expect(await robots.text()).not.toContain("Sitemap:");
    expect(await sitemap.text()).not.toContain("<loc>");
  }
  expect(await sitemap.text()).not.toContain("/privacidade");
  await page.goto("/privacidade");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  if (configured)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${configured}/privacidade/`,
    );
  else await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
test("eventos locais sem PII e sem conversão falsa", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .waitFor();
  await page.evaluate(() => {
    const target = window as typeof window & { captured: unknown[] };
    target.captured = [];
    window.addEventListener("clara:conversion", (e) =>
      target.captured.push((e as CustomEvent).detail),
    );
  });
  await page
    .getByRole("link", { name: "Conhecer as soluções", exact: true })
    .click();
  await page.getByLabel("Seu nome").fill("Nome privado");
  await page.getByLabel("Clínica ou consultório").fill("Clínica privada");
  await page.getByLabel("Especialidade").selectOption("Nutrição");
  await page.getByLabel("E-mail para contato").fill("privado@example.com");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Não foi possível enviar",
  );
  // Exercita classificação de links sem cadastrar contato fictício no site ou abrir serviços externos.
  await page.evaluate(() => {
    for (const href of ["https://wa.me/", "tel:", "mailto:"]) {
      const a = document.createElement("a");
      a.href = href;
      a.addEventListener("click", (e) => e.preventDefault());
      document.body.append(a);
      a.click();
      a.remove();
    }
  });
  const events = await page.evaluate(
    () =>
      (
        window as typeof window & {
          captured: { event: string; placement: string }[];
        }
      ).captured,
  );
  expect(events.map((e) => e.event)).toEqual([
    "contact_click",
    "form_attempt",
    "form_error",
    "whatsapp_click",
    "phone_click",
    "email_click",
  ]);
  for (const event of events)
    expect(Object.keys(event).sort()).toEqual(["event", "placement"]);
  expect(JSON.stringify(events)).not.toContain("privado");
});
test("origem canonical rejeita configurações inválidas", () => {
  expect(publicOrigin("")).toBeNull();
  expect(publicOrigin("https://clinica.example/")).toBe(
    "https://clinica.example",
  );
  for (const value of [
    "http://clinica.example",
    "https://localhost",
    "https://a:b@clinica.example",
    "https://clinica.example/caminho",
    "https://clinica.example/?utm=abc",
  ])
    expect(() => publicOrigin(value)).toThrow();
});
