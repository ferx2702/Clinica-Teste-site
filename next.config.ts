import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (basePath && !/^\/[A-Za-z0-9_-]+$/.test(basePath))
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH deve ser vazio ou um caminho simples como /Clinica-Teste-site.",
  );
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default config;
