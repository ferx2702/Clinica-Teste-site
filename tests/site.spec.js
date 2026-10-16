import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const endpoint = "https://formspree.io/f/xrperlry";
const test = base.extend({
  page: async ({ page }, runFixture) => {
    await page.addInitScript(() =>
      window.localStorage.setItem(
        "secretaria.analytics-consent.v1",
        JSON.stringify({
          choice: "rejected",
          expiresAt: Date.now() + 86400000,
        }),
      ),
    );
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"errors":[{"message":"Falha controlada"}]}',
      }),
    );
    await runFixture(page);
  },
});
async function open(page) {
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
}
async function fill(page) {
  await open(page);
  await page.locator("#nome").fill("Contato fictício");
  await page.locator("#clinica").fill("Consultório fictício");
  await page.locator("#especialidade").selectOption("Nutrição");
  await page.locator("#whatsapp").fill("(16) 99999-9999");
  await page.locator("#mensagem").fill("Mensagem de teste");
}
test("navegação, hierarquia, SEO e dados estruturados", async ({
  page,
  request,
}, info) => {
  const failures = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(r.url());
  });
  page.on("pageerror", (e) => failures.push(e.message));
  await open(page);
  await expect(page).toHaveTitle(
    "Secretária virtual no WhatsApp para clínicas | Secretar.IA",
  );
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("meta[name=description]")).toHaveAttribute(
    "content",
    /Ribeirão Preto/,
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://ferx2702.github.io/Clinica-Teste-site/",
  );
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    "index, follow",
  );
  const headings = await page
    .locator("h1,h2,h3")
    .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
  headings.forEach((level, i) => {
    if (i) expect(level - headings[i - 1]).toBeLessThanOrEqual(1);
  });
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(schema["@graph"].map((el) => el["@type"])).toEqual([
    "Organization",
    "Service",
  ]);
  expect(schema["@graph"][0].telephone).toBe("+5516992915744");
  expect(schema["@graph"][0]).not.toHaveProperty("aggregateRating");
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page
      .getByRole("navigation", { name: "Navegação móvel", exact: true })
      .getByRole("link", { name: "Como funciona", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Abrir menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Como funciona", exact: true })
      .click();
  await expect(page).toHaveURL(/#como-funciona$/);
  expect(await (await request.get("robots.txt")).text()).toContain(
    "Sitemap: https://ferx2702.github.io/Clinica-Teste-site/sitemap.xml",
  );
  expect(await (await request.get("sitemap.xml")).text()).toContain(
    "<loc>https://ferx2702.github.io/Clinica-Teste-site/</loc>",
  );
  await page
    .getByRole("navigation", { name: "Navegação do rodapé" })
    .getByRole("link", { name: "Política de Privacidade" })
    .click();
  await expect(page.locator("h1")).toHaveText("Política de Privacidade");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await page.getByRole("link", { name: "Termos de Uso", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Termos de Uso");
  await expect(page.locator(".legal-notice")).toContainText("Placeholder");
  expect(failures).toEqual([]);
});
test("novo WhatsApp e eventos sem dados pessoais", async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    window.events = [];
    window.addEventListener("clara:conversion", (e) =>
      window.events.push(e.detail),
    );
    document.addEventListener("click", (e) => {
      if (e.target.closest("a[data-whatsapp],a[data-phone],a[data-email]"))
        e.preventDefault();
    });
  });
  const link = page.locator(".hero [data-whatsapp]");
  const href = new URL(await link.getAttribute("href"));
  expect(href.pathname).toBe("/5516992915744");
  expect(href.searchParams.get("text")).toBe(
    "Olá! Quero saber mais sobre a secretária virtual",
  );
  await link.click();
  await page.locator(".hero [data-contact]").click();
  await page.locator("footer [data-phone]").click();
  await page.locator("footer [data-email]").click();
  const events = await page.evaluate(() => window.events);
  expect(events.map((e) => e.event)).toEqual([
    "whatsapp_click",
    "contact_click",
    "phone_click",
    "email_click",
  ]);
  for (const e of events)
    expect(Object.keys(e).sort()).toEqual(["event", "placement"]);
});
test("validação inline e foco no primeiro campo inválido", async ({ page }) => {
  let requests = 0;
  page.on("request", (r) => {
    if (r.url() === endpoint) requests++;
  });
  await open(page);
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.locator("#nome")).toBeFocused();
  await expect(page.locator(".floating-whatsapp")).toBeHidden();
  await expect(page.locator("#nome-error")).toHaveText("Preencha este campo.");
  await fill(page);
  await page.locator("#whatsapp").fill("123");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.locator("#whatsapp")).toBeFocused();
  await expect(page.locator("#whatsapp-error")).toContainText("DDD");
  await page.locator("#nome").fill("   ");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.locator("#nome")).toBeFocused();
  expect(requests).toBe(0);
});
test("Formspree: loading, payload e sucesso confirmado", async ({ page }) => {
  let release = () => {};
  const wait = new Promise((resolve) => {
    release = resolve;
  });
  let payload;
  await page.route(endpoint, async (route) => {
    expect(route.request().headers().accept).toBe("application/json");
    expect(route.request().method()).toBe("POST");
    payload = route.request().postDataJSON();
    await wait;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  await fill(page);
  await page.evaluate(() => {
    window.events = [];
    window.addEventListener("clara:conversion", (e) =>
      window.events.push(e.detail),
    );
  });
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Enviando…", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("#nome")).toBeDisabled();
  await expect(page.getByRole("status")).not.toContainText(
    "Solicitação enviada",
  );
  expect(payload).toMatchObject({
    nome: "Contato fictício",
    clinica: "Consultório fictício",
    especialidade: "Nutrição",
    whatsapp: "(16) 99999-9999",
    mensagem: "Mensagem de teste",
  });
  expect(payload).not.toHaveProperty("email");
  release();
  await expect(page.getByRole("status")).toContainText("Solicitação enviada");
  await expect(page.locator("#nome")).toHaveValue("");
  expect(
    (await page.evaluate(() => window.events)).map((e) => e.event),
  ).toEqual(["form_attempt", "generate_lead"]);
});
for (const failure of ["network", "validation", "unconfirmed"])
  test(`falha ${failure}: preserva dados e permite nova tentativa`, async ({
    page,
  }) => {
    await page.route(endpoint, (route) =>
      failure === "network"
        ? route.abort("failed")
        : route.fulfill({
            status: failure === "validation" ? 422 : 200,
            contentType: "application/json",
            body: '{"errors":[]}',
          }),
    );
    await fill(page);
    await page.evaluate(() => {
      window.leads = 0;
      window.addEventListener("clara:conversion", (e) => {
        if (e.detail.event === "generate_lead") window.leads++;
      });
    });
    await page
      .getByRole("button", { name: "Solicitar demonstração", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Não foi possível enviar",
    );
    await expect(page.locator("#nome")).toHaveValue("Contato fictício");
    expect(await page.evaluate(() => window.leads)).toBe(0);
    await page.route(endpoint, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"ok":true}',
      }),
    );
    await page
      .getByRole("button", { name: "Solicitar demonstração", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Solicitação enviada");
  });
test("FAQ, teclado, movimento reduzido e larguras sem overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const summary = page.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).not.toHaveAttribute("open");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation", { name: "Navegação móvel", exact: true })
    .getByRole("link", { name: "Como funciona", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
});
test("acessibilidade automática nas três páginas e revisão visual", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["./", "privacidade.html", "termos.html"]) {
    await page.goto(route);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  await open(page);
  await page.screenshot({
    path: `test-results/${info.project.name}.png`,
    fullPage: true,
  });
});
test("HTML acessível sem JavaScript e sem envio acidental", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Solicitar demonstração", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".noscript-note")).toBeVisible();
  await expect(page.locator(".noscript-note")).toContainText(
    /ative o\s+JavaScript/,
  );
  await context.close();
});
