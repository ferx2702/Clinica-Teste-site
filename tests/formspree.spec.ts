import { test, expect } from "./fixtures";
const endpoint = "https://formspree.io/f/xrperlry";
async function fill(page: import("@playwright/test").Page) {
  await page.goto("/#contato");
  await page.getByLabel("Seu nome").fill("Contato fictício de teste");
  await page.getByLabel("Clínica ou consultório").fill("Clínica fictícia");
  await page.getByLabel("Especialidade").selectOption("Odontologia");
  await page.getByLabel("E-mail para contato").fill("teste@example.com");
  await page
    .getByLabel("O que você gostaria de simplificar?")
    .fill("Mensagem fictícia");
}
test("JSON Formspree, carregamento e sucesso somente após confirmação", async ({
  page,
}) => {
  let release: () => void = () => {};
  const wait = new Promise<void>((resolve) => {
    release = resolve;
  });
  let payload: Record<string, string> = {};
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
    window.addEventListener("clara:conversion", (e) => {
      if ((e as CustomEvent).detail.event === "generate_lead")
        document.body.dataset.lead = "confirmed";
    });
  });
  await page
    .getByRole("button", { name: "Solicitar demonstração", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Enviando…" })).toBeDisabled();
  await expect(page.getByRole("status")).not.toContainText(
    "Solicitação enviada",
  );
  expect(payload.email).toBe("teste@example.com");
  expect(payload.clinica).toBe("Clínica fictícia");
  expect(payload.especialidade).toBe("Odontologia");
  expect(payload.mensagem).toBe("Mensagem fictícia");
  release();
  await expect(page.getByRole("status")).toContainText("Solicitação enviada");
  await expect(page.getByLabel("Seu nome")).toHaveValue("");
  await expect(page.locator("body")).toHaveAttribute("data-lead", "confirmed");
});
for (const failure of ["validation", "network", "unconfirmed"]) {
  test(`falha ${failure} preserva dados e permite tentar novamente`, async ({
    page,
  }) => {
    await page.route(endpoint, (route) =>
      failure === "network"
        ? route.abort("failed")
        : route.fulfill({
            status: failure === "validation" ? 422 : 200,
            contentType: "application/json",
            body: JSON.stringify({ errors: [{ message: "Falha de teste" }] }),
          }),
    );
    await fill(page);
    await page
      .getByRole("button", { name: "Solicitar demonstração", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Não foi possível enviar",
    );
    await expect(page.getByLabel("Seu nome")).toHaveValue(
      "Contato fictício de teste",
    );
    await expect(
      page.getByRole("button", { name: "Solicitar demonstração", exact: true }),
    ).toBeEnabled();
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
}
