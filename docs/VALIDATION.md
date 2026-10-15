# Validação da primeira versão

Executada em 2026-10-15, no checkout `/workspace/Clinica-Teste-site`.

## Resultados

- `npm install`: dependências instaladas, com lockfile. O primeiro comando
  falhou porque o cache pessoal não era gravável; o cache foi direcionado a um
  diretório permitido. Instalação concluída sem desabilitar TLS ou integridade.
- `npm run build`: build de produção concluído, rotas `/` e `/privacidade`
  pré-renderizadas. Next.js 16.4.2 e React 19.3.1, versões exatas no lockfile.
- `npm run lint`: sem erros ou avisos após correções.
- `npm run typecheck`: TypeScript sem erros.
- `npm test`: 8 testes aprovados, sem testes ignorados, em Chromium 154;
  desktop 1280×720 e emulação móvel iPhone 13 (390×664).
- Layout adicional exercitado em 320, 768 e 1440 pixels sem rolagem horizontal.
- Fluxos verificados: âncoras, menu móvel, fechamento via Escape com retorno de
  foco, link para conteúdo, sequência de Tab entre campos, obrigatoriedade,
  e-mail inválido e aviso honesto de envio indisponível sem requisição POST.
- axe: nenhuma violação detectada para WCAG 2 A/AA e 2.1 AA nas páginas inicial
  e privacidade, nos dois perfis. Movimento reduzido também verificado.
- Capturas do hero e do contato revisadas visualmente em desktop 1440×1000 e
  celular 390×844, em `docs/screenshots/`. Capturas completas da última execução
  ficam em `test-results/` (ignorado pelo Git).

As primeiras execuções detectaram overflow decorativo e identificador duplicado
no campo de e-mail, corrigidos antes da rodada final. A animação de entrada foi
ajustada para não reduzir o contraste do texto. O servidor de testes agora usa
porta exclusiva 3100, evitando reutilizar processos antigos e assets de outro
build. Nenhuma falha conhecida desses fluxos permanece aberta.

## Referências e ferramentas

Foram lidos `AGENTS.md`, frontend-design e web-design-guidelines locais, além
da versão atual das regras obtida em `raw.githubusercontent.com`. As cópias e
licenças já existentes foram preservadas. A implementação foi revisada segundo
as regras pertinentes de semântica, foco, formulários, movimento e layout.

Nenhum MCP shadcn, Magic/21st ou Chrome DevTools estava conectado ou foi usado.
A automação de navegador usa a biblioteca Playwright pelo terminal com Chromium
local. Isso não equivale a conectar um servidor MCP. Não foram usados serviços
pagos, tokens ou dados reais de pacientes.

## Pendências e limites

- Definir nome, domínio público, e-mail, WhatsApp e responsável pelo tratamento
  de dados em `src/lib/site.ts` e no aviso de privacidade.
- Implementar e validar serviço real de recebimento/armazenamento de leads antes
  de configurar `leadEndpoint`; atualmente não há envio. Estados de loading,
  sucesso HTTP 2xx e erro estão preparados, mas não foram validados contra um
  backend real, pois ele não existe neste escopo.
- Validar WhatsApp com o número comercial real; nenhum número foi inventado.
- Revisão completa com leitor de tela, dispositivos físicos, Safari e Firefox
  não realizada. Emulação Chromium e axe não garantem conformidade integral.
- Configuração do domínio, hospedagem e publicação não realizada. Nada foi
  enviado ao GitHub nem implantado em produção.

## Atualização: SEO, conversões e identidade Secretar.IA

Esta atualização substitui as pendências anteriores de nome e contatos: foram
configurados Secretar.IA, fergasvi@outlook.com e +5516992915744, conforme
fornecidos pelo responsável. O número é usado nos links tel e WhatsApp; não foi
feita ligação nem enviada mensagem para validar atendimento.

- Build de produção, ESLint e TypeScript concluídos sem erros.
- 14 testes aprovados em desktop e mobile no build sem domínio (noindex).
- Mais 14 testes aprovados no build com `NEXT_PUBLIC_SITE_URL` usando a origem
  reservada `https://clinica.example`, exclusivamente para teste local de
  canonical, sitemap e indexação. O build final foi restaurado sem essa variável;
  o domínio de teste não ficou salvo como domínio da empresa.
- Verificados: title/description, H1 único, hierarquia sem saltos, JSON-LD,
  dados comerciais fornecidos, robots.txt, sitemap, canonical nos dois estados,
  privacidade noindex, eventos sem PII e ausência de generate_lead sem integração.
- O Next normaliza a canonical da home sem barra final; isso é equivalente à
  origem com caminho `/`. A expectativa do teste foi ajustada a essa saída.
- Mantidos os testes funcionais, de teclado, responsividade e axe sem violações
  detectadas. Capturas desktop e mobile atualizadas e revisadas visualmente.
- Fonte latina local de 24.836 bytes com um preload e uma requisição de fonte por
  navegação, confirmados no navegador. Na amostra local, CLS observado foi zero
  nos dois perfis. Medições e condições em `performance-local.json`; não são
  resultados de PageSpeed, Lighthouse ou usuários reais.

Continuam pendentes o domínio definitivo, provedor de analytics/consentimento,
integração real de leads e validação pública pelos buscadores. Os eventos são
locais, não um painel externo de conversões. Detalhes em `SEO-CONVERSIONS.md`.

## Preparação para GitHub Pages

Escolhida a URL gratuita esperada `https://ferx2702.github.io/Clinica-Teste-site/`.
O domínio/basePath são aplicados pelo workflow, sem comprar domínio ou hospedagem.

- Build estático Pages com a origem e o basePath reais concluído.
- `npm run test:pages`: 2 testes aprovados (desktop/mobile) diretamente no
  artefato `out/`, com links, fontes, estilos, formulário sem envio, privacidade,
  canonical, JSON-LD, sitemap e axe. Capturas revisadas visualmente.
- Build local sem basePath refeito, seguido dos 14 testes existentes aprovados;
  ESLint e TypeScript também passaram. `npm start` agora serve a exportação
  estática local; não depende de `next start`.
- Workflow apenas manual preparado em `.github/workflows/pages.yml`, com build
  e testes antes da etapa de deploy. Não foi executado no GitHub.

Código ainda não enviado, Pages não habilitado por esta sessão e URL pública
não validada. Instruções em `GITHUB-PAGES.md`. Não há contratação de serviços.
