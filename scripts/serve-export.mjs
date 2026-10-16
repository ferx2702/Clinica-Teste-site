// Servidor local de validação. Em produção, o GitHub Pages serve estes arquivos.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve(process.argv.includes("--source") ? "." : "out");
const prefix = process.env.BASE_PATH || "";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (prefix && path !== prefix && !path.startsWith(`${prefix}/`)) {
      res.writeHead(404).end();
      return;
    }
    let file = resolve(root, `.${path.slice(prefix.length) || "/"}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) {
      if (!path.endsWith("/")) {
        res.writeHead(301, { location: `${path}/` }).end();
        return;
      }
      file = resolve(file, "index.html");
    }
    const data = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
      })
      .end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(Number(process.env.PORT || 3000), "127.0.0.1");
