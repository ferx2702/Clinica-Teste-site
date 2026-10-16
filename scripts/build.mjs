// Sem bundler: copie apenas arquivos públicos. As referências de design ficam fora do site.
import { mkdir, cp, rm, readFile, writeFile } from "node:fs/promises";
const base =
  process.env.SITE_URL || "https://ferx2702.github.io/Clinica-Teste-site/";
const url = new URL(base.endsWith("/") ? base : `${base}/`);
if (
  url.protocol !== "https:" ||
  url.username ||
  url.password ||
  url.search ||
  url.hash
)
  throw new Error(
    "SITE_URL deve ser HTTPS, sem credenciais, parâmetros ou fragmento.",
  );
const defaults = "https://ferx2702.github.io/Clinica-Teste-site/";
await rm("out", { recursive: true, force: true });
await mkdir("out", { recursive: true });
for (const file of [
  "index.html",
  "styles.css",
  "script.js",
  "analytics.js",
  "config.js",
  "favicon.svg",
  "privacidade.html",
  "termos.html",
]) {
  let data = await readFile(file, "utf8");
  if (file.endsWith(".html")) data = data.replaceAll(defaults, url.href);
  await writeFile(`out/${file}`, data);
}
await cp("public/fonts", "out/public/fonts", { recursive: true });
await mkdir("out/public/fonts", { recursive: true });
await cp("docs/licenses/manrope-OFL.txt", "out/public/fonts/LICENSE.txt");
// Mantém o endereço de privacidade antigo funcionando após a migração.
await mkdir("out/privacidade", { recursive: true });
await writeFile(
  "out/privacidade/index.html",
  '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=../privacidade.html"><title>Privacidade | Secretar.IA</title></head><body><a href="../privacidade.html">Política de Privacidade</a></body></html>',
);
await writeFile(
  "out/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${url.href}sitemap.xml\n`,
);
await writeFile(
  "out/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url.href.replaceAll("&", "&amp;")}</loc></url></urlset>\n`,
);
await writeFile("out/.nojekyll", "");
console.log("Build estático concluído em out/. Canonical:", url.href);
