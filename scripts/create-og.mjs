// Gera a imagem de compartilhamento com os mesmos logo, fonte e cores do site.
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const root = "";
const font = (
  await readFile(root + "public/fonts/manrope-latin.woff2")
).toString("base64");
const logo = await readFile(root + "public/brand/agendia-logo.svg", "utf8");
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (process.env.CI ? undefined : "/usr/bin/chromium"),
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<style>@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#f1f5ee;font-family:Manrope,sans-serif;color:#123f3b}.card{width:1200px;height:630px;padding:64px 80px;position:relative;border-bottom:18px solid #123f3b}.logo svg{width:250px;height:auto}h1{font-size:64px;line-height:1.12;letter-spacing:-3px;font-weight:500;max-width:950px;margin:42px 0 24px}p{font-size:24px;margin:0;color:#436356}.tag{position:absolute;bottom:55px;font-size:19px}.mark{position:absolute;right:85px;bottom:45px;font-size:26px}</style><div class="card"><div class="logo">${logo}</div><h1>Secretária virtual no<br>WhatsApp para clínicas.</h1><p>Uma conversa que vira compromisso.</p><div class="tag">Odontologia e nutrição · Ribeirão Preto, SP</div><div class="mark">agende uma demonstração</div></div>`,
);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: root + "public/brand/agendia-og.png" });
await browser.close();
