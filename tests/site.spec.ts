import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("navegação, layout e demonstração fictícia", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await expect(page).toHaveTitle(/Secretar\.IA/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Sua clínica cuida.",
  );
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
    await expect(
      page.getByRole("button", { name: "Abrir menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Soluções", exact: true })
      .click();
  await expect(page).toHaveURL(/#solucoes$/);
  await expect(page.locator("#demonstracao")).toContainText("Exemplo fictício");
  await page
    .getByRole("link", { name: "Conhecer as soluções", exact: true })
    .click();
  await expect(page).toHaveURL(/#contato$/);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBeTruthy();
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-full.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("campos obrigatórios e envio não integrado honesto", async ({ page }) => {
  await page.goto("/#contato");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  expect(
    await page
      .locator("#nome")
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBeTruthy();
  await page.getByLabel("Seu nome").fill("Ana Teste");
  await page.getByLabel("Clínica ou consultório").fill("Consultório fictício");
  await page.getByLabel("Especialidade").selectOption("Nutrição");
  await page.getByLabel("E-mail para contato").fill("invalido");
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  expect(
    await page
      .locator("#contato input[type=email]")
      .evaluate((el: HTMLInputElement) => el.validity.typeMismatch),
  ).toBeTruthy();
  await page.getByLabel("E-mail para contato").fill("teste@example.com");
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") writes.push(r.url());
  });
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Nenhum dado foi enviado",
  );
  expect(writes).toEqual([]);
  await expect(page.locator('a[href*="wa.me"]')).toHaveAttribute("href", /^https:\/\/wa\.me\/5516992915744\?text=/);
});
test("acessibilidade automática e navegação por teclado", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacidade, com clareza.",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("larguras compactas e intermediárias, movimento reduzido e foco do menu", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await page
        .locator(".hero-copy")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation", { name: "Navegação móvel", exact: true })
    .getByRole("link", { name: "Soluções", exact: true })
    .focus();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Abrir menu" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.locator("#nome").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Clínica ou consultório")).toBeFocused();
});
