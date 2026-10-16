import { test, expect } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
const prefix = "/Clinica-Teste-site";
const url = "https://ferx2702.github.io/Clinica-Teste-site/";
test("exportação Pages: assets, SEO, contato e privacidade no subdiretório", async ({
  page,
  request,
}, testInfo) => {
  await page.route("https://formspree.io/f/xrperlry", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  const failures: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on("pageerror", (e) => failures.push(e.message));
  await page.goto(`${prefix}/`);
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle(/Secretar\.IA/);
  const canonical = await page
    .locator("link[rel=canonical]")
    .getAttribute("href");
  expect(new URL(canonical!).href).toBe(url);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    "index, follow",
  );
  expect(
    await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).fontFamily.toLowerCase()),
  ).toContain("manrope");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page
      .getByRole("navigation", { name: "Navegação móvel", exact: true })
      .getByRole("link", { name: "Soluções", exact: true })
      .click();
  } else
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Soluções", exact: true })
      .click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/#solucoes$`));
  await page
    .getByRole("link", { name: "Conhecer as soluções", exact: true })
    .click();
  await page.getByLabel("Seu nome").fill("Teste");
  await page.getByLabel("Clínica ou consultório").fill("Consultório fictício");
  await page.getByLabel("Especialidade").selectOption("Nutrição");
  await page.getByLabel("E-mail para contato").fill("teste@example.com");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Solicitação enviada");
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(1);
  const graph = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(graph["@graph"][0].url).toBe(url);
  expect(await (await request.get(`${prefix}/sitemap.xml`)).text()).toContain(
    `<loc>${url}</loc>`,
  );
  expect(await (await request.get(`${prefix}/robots.txt`)).text()).toContain(
    `${url}sitemap.xml`,
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .getByRole("link", { name: "aviso de privacidade", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/privacidade/$`));
  await expect(page.locator("h1")).toHaveText("Privacidade, com clareza.");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    `${url}privacidade/`,
  );
  await page
    .getByRole("link", { name: "Voltar ao início", exact: false })
    .click();
  await expect(page).toHaveURL(new RegExp(`${prefix}/$`));
  await page.screenshot({
    path: `test-results/pages-${testInfo.project.name}.png`,
  });
  expect(failures).toEqual([]);
});
