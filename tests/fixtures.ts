import { test as base, expect } from "@playwright/test";
// Impede que testes automatizados criem leads na conta real.
export const test = base.extend({
  page: async ({ page }, runFixture) => {
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          errors: [{ message: "Falha controlada do teste" }],
        }),
      }),
    );
    await runFixture(page);
  },
});
export { expect };
