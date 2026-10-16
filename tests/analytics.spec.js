import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const key = "secretaria.analytics-consent.v1";
const test = base.extend({
  page: async ({ page }, runFixture) => {
    await page.route("https://www.googletagmanager.com/**", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: "window.__analyticsTagMockLoaded = true;",
      }),
    );
    await page.route("https://*.google-analytics.com/**", (route) =>
      route.fulfill({ status: 204, body: "" }),
    );
    await runFixture(page);
  },
});
async function commands(page) {
  return page.evaluate(() =>
    (window.dataLayer || []).map((args) => Array.from(args)),
  );
}
async function emit(page, event = "contact_click", extra = {}) {
  await page.evaluate(
    ({ event, extra }) =>
      window.dispatchEvent(
        new CustomEvent("clara:conversion", {
          detail: { event, placement: "hero", ...extra },
        }),
      ),
    { event, extra },
  );
}
test("sem consentimento ou após recusa não carrega Google; preferência persiste", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (r) => {
    if (/google(tagmanager|-analytics)/.test(r.url())) requests.push(r.url());
  });
  await page.goto("./");
  await expect(
    page.getByRole("region", { name: "Preferências de privacidade" }),
  ).toBeVisible();
  await emit(page);
  expect(await commands(page)).toEqual([]);
  expect(requests).toEqual([]);
  await page
    .getByRole("button", { name: "Recusar Analytics", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Preferências de privacidade" }),
  ).toBeHidden();
  expect(await page.locator("#ga4-tag").count()).toBe(0);
  expect(requests).toEqual([]);
  await page
    .getByRole("button", { name: "Preferências de privacidade", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Recusar Analytics", exact: true }),
  ).toBeFocused();
});
test("aceitar carrega ID correto uma vez e encaminha eventos sem PII ou histórico", async ({
  page,
}) => {
  await page.goto("./?email=privado%40example.com#nome-privado");
  await emit(page, "contact_click");
  await page
    .getByRole("button", { name: "Aceitar Analytics", exact: true })
    .click();
  await expect(page.locator("#ga4-tag")).toHaveAttribute(
    "src",
    "https://www.googletagmanager.com/gtag/js?id=G-0EGN4M2JEW",
  );
  await emit(page, "whatsapp_click", {
    nome: "Nome privado",
    email: "privado@example.com",
    placement: "private@example.com",
  });
  await emit(page, "evento_nao_permitido", { nome: "Nome privado" });
  const calls = await commands(page);
  const config = calls.find((c) => c[0] === "config");
  expect(config[1]).toBe("G-0EGN4M2JEW");
  expect(config[2]).toMatchObject({
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 15552000,
  });
  const events = calls.filter((c) => c[0] === "event");
  expect(events.map((c) => c[1])).toEqual(["page_view", "whatsapp_click"]);
  expect(events[1][2].placement).toBe("page");
  expect(JSON.stringify(calls)).not.toMatch(
    /privado|private@example|Nome privado/,
  );
  const consent = calls.filter((c) => c[0] === "consent");
  expect(consent[0][2]).toMatchObject({
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  await page
    .getByRole("button", { name: "Preferências de privacidade", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Aceitar Analytics", exact: true })
    .click();
  expect(await page.locator("#ga4-tag").count()).toBe(1);
  expect(
    (await commands(page)).filter(
      (c) => c[0] === "event" && c[1] === "page_view",
    ),
  ).toHaveLength(1);
});
test("retirar consentimento interrompe eventos e remove cookies locais do GA4", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Aceitar Analytics", exact: true })
    .click();
  await page.evaluate(() => {
    document.cookie = "_ga=teste; path=/";
    document.cookie = "_ga_0EGN4M2JEW=teste; path=/";
  });
  await emit(page, "contact_click");
  const before = (await commands(page)).filter((c) => c[0] === "event").length;
  await page
    .getByRole("button", { name: "Preferências de privacidade", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Recusar Analytics", exact: true })
    .click();
  await emit(page, "generate_lead");
  expect((await commands(page)).filter((c) => c[0] === "event")).toHaveLength(
    before,
  );
  expect(await page.evaluate(() => window["ga-disable-G-0EGN4M2JEW"])).toBe(
    true,
  );
  expect(
    (await page.context().cookies()).filter((c) => c.name.startsWith("_ga")),
  ).toEqual([]);
  await page.reload();
  expect(await page.locator("#ga4-tag").count()).toBe(0);
});
test("consentimento aceito persiste entre páginas; expirado solicita nova escolha", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Aceitar Analytics", exact: true })
    .click();
  await page.goto("privacidade.html");
  await expect(page.locator("#ga4-tag")).toHaveCount(1);
  await expect(
    page.getByRole("region", { name: "Preferências de privacidade" }),
  ).toBeHidden();
  await page.evaluate(
    (key) =>
      window.localStorage.setItem(
        key,
        JSON.stringify({ choice: "accepted", expiresAt: Date.now() - 1 }),
      ),
    key,
  );
  await page.goto("termos.html");
  await expect(
    page.getByRole("region", { name: "Preferências de privacidade" }),
  ).toBeVisible();
  expect(await page.locator("#ga4-tag").count()).toBe(0);
});
test("consentimento acessível, sem overflow e com opção de recusa em teclado", async ({
  page,
}, info) => {
  await page.goto("./");
  const banner = page.getByRole("region", {
    name: "Preferências de privacidade",
  });
  await expect(banner).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize(
    info.project.name === "mobile"
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
  );
  await page.screenshot({
    path: `test-results/analytics-${info.project.name}.png`,
  });
  await page
    .getByRole("button", { name: "Recusar Analytics", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(banner).toBeHidden();
});
