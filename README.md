# AgendIA

Landing page em **HTML, CSS e JavaScript puros**, sem framework ou biblioteca
no navegador. Os arquivos podem ser abertos diretamente em `index.html`.
A fonte Manrope (Google Fonts/Fontsource) é hospedada localmente, preservando sua
licença OFL em `docs/licenses/`, sem requisição externa de fontes.

## Executar e revisar

Para abrir a página, basta `index.html`. Para servir localmente, testar o envio
e evitar limitações de origem `file://`, use Node.js 24 LTS:

```bash
npm ci
npm run dev
```

O servidor local usa a porta 3000. As dependências npm servem apenas para
verificação, formatação e testes; nenhuma é carregada pelo site.

```bash
npm run lint
npm run check
npm run build
npm test
npm start
```

O build copia apenas os arquivos públicos para `out/`. O teste inicia um
servidor de arquivos na porta 3100. Localmente usa `/usr/bin/chromium`; pode ser
alterado por `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Em CI, Playwright usa seu
Chromium instalado por `npx playwright install --with-deps chromium`.

## Onde editar

- `index.html`: textos, seções, título SEO, Open Graph e JSON-LD.
- `styles.css`: tokens de cor, tipografia, espaçamento e responsividade.
- `script.js`: menu, validação, Formspree, FAQ nativo e eventos locais.
- `analytics.js`: Google Analytics 4, consentimento e encaminhamento dos eventos.
- `config.js`: nome, WhatsApp, telefone, e-mail, mensagem do CTA e endpoint.
- `privacidade.html` e `termos.html`: documentos iniciais, marcados para revisão.
- `public/fonts/`: fonte WOFF2 local.
- `scripts/build.mjs`: build sem bundler e geração de robots/sitemap.
- `.github/workflows/pages.yml`: publicação manual no GitHub Pages.

Os dados públicos atuais são **AgendIA**, **fergasvi@outlook.com** e
**+55 16 99291-5744**, conforme o novo briefing. A mensagem do CTA é “Olá! Quero
saber mais sobre a secretária virtual”. O nome dos elementos visíveis é
atualizado por `config.js`; ao trocar a marca, revise também textos e metadados
estáticos de `index.html` e das páginas legais, para manter SEO e ausência de JS
consistentes.

## Formulário e conversões

Mantido o Formspree já fornecido: `https://formspree.io/f/xrperlry`. Não é segredo.
Envia nome, clínica, especialidade, WhatsApp e mensagem opcional em POST JSON,
com Accept application/json. **Não solicita e-mail nesta versão**, conforme o
briefing. Confirme que as regras da sua conta Formspree não exigem campo e-mail.

Valida DDD + celular brasileiro e campos obrigatórios; mostra erros junto aos
campos e foca o primeiro inválido. Durante o envio, bloqueia edição e duplicação.
Só mostra sucesso e emite `generate_lead` após HTTP 2xx e JSON `ok:true`.
Falhas ou timeout de 15 segundos preservam os dados para tentar novamente.
Sem JavaScript, o botão de envio fica desativado e os contatos diretos continuam
visíveis. Sem endpoint configurado, informa indisponibilidade, sem simular envio.

Confira ativação, destinatário, antispam e limites do plano no Formspree. Os
testes interceptam todos os envios e **não geram leads reais**. Uma verificação
manual no site publicado e no painel/e-mail continua necessária para comprovar
entrega real. Não envie informações de pacientes no formulário.

Mantido o contrato `window` → `clara:conversion`, com payload limitado a `event`
e `placement`, sem dados dos campos. Eventos: `contact_click`, `whatsapp_click`,
`phone_click`, `email_click`, `form_attempt`, `form_unavailable`, `form_error` e
`generate_lead`. O Google Analytics 4 (`G-0EGN4M2JEW`) só é carregado após
aceitação. A escolha pode ser alterada no rodapé e é lembrada por até 180 dias.
Não há Google Tag Manager container nem publicidade conectada. Veja
[configuração e validação do GA4](docs/ANALYTICS.md). O recebimento real na
propriedade e a marcação dos eventos principais ainda precisam ser confirmados
pelo responsável no painel do Google.

## SEO e publicação gratuita em 3 passos

1. Revise as alterações e envie a branch `main` ao repositório
   `ferx2702/Clinica-Teste-site`, incluindo `.github/workflows/`, `scripts/` e
   os arquivos HTML/CSS/JS. Não envie `node_modules`, `out/` ou `.env`.
2. Em **Settings → Pages**, selecione **GitHub Actions**. O repositório precisa
   ser público para o uso gratuito conforme o plano GitHub.
3. Em **Actions → Publicar AgendIA no GitHub Pages → Run workflow**, selecione
   `main`. Aguarde build, testes e deploy; o endereço esperado é
   **https://ferx2702.github.io/Clinica-Teste-site/**.

O workflow não publica no push: a execução é manual. O build usa `SITE_URL` para
canonical, Open Graph, schema e sitemap; o valor padrão é o endereço Pages acima.
`BASE_PATH` só informa ao servidor de testes o subdiretório Pages. Para testar:

```bash
npm run build
BASE_PATH=/Clinica-Teste-site npm test
```

A home tem H1 único, schema Organization/Service e index,follow. Páginas legais
são noindex,follow e ficam fora do sitemap. A URL antiga `/privacidade/` redireciona
para `privacidade.html` no artefato exportado. No Pages de projeto, robots.txt
no subdiretório não controla o host inteiro; consulte `docs/GITHUB-PAGES.md`.

## O que ainda preencher ou validar

- Definir preços, implantação, limites e condições comerciais. O site apresenta **investimento sob consulta**, sem valores fictícios.
- Logo definitivo (há marca textual), prazos de implantação e eventuais casos
  reais. Não existem depoimentos, logos de clientes ou números inventados.
- Identificação jurídica, base legal, retenção e demais termos legais, sinalizados
  como documentos iniciais. Formalizar a operação é responsabilidade da empresa.
- Confirmar a capacidade real e o escopo do serviço, a conexão WhatsApp/Google
  Agenda e as regras da fila antes de ativá-las em uma clínica. A landing page
  não implementa uma secretária real nem acessa agendas/pacientes.
- Validar recebimento real no Formspree; WhatsApp/endpoint já estão preenchidos.

As referências oficiais e licenças em `docs/design/` foram preservadas. São
instruções locais, não skills nativas. Nenhum MCP shadcn, Magic/21st ou Chrome
DevTools está conectado; a revisão usa Playwright pelo terminal. Documentos
anteriores em `docs/` registram a implementação Next.js histórica e foram
superados, no que divergem, por este README e `docs/REDESIGN.md`.

## Revisão da oferta e análise de concorrência

Em 20/10/2026, foram refinados hero, exemplos interativos fictícios, investimento
sob consulta e explicação do retorno da demonstração. A análise dos concorrentes
ficou bloqueada por acesso de rede; não há conclusões verificadas sobre seus sites.
Veja [auditoria e pendências](docs/REVIEW-2026-10-20.md).

## Marca AgendIA

Logo vetorial, versão branca e ícone em `public/brand/`. Veja [guia da marca](docs/BRAND.md).

## Demonstração, calculadora e novos conteúdos

Veja [campos pendentes, fórmula e imagem social](docs/UPGRADES-AGENDIA.md).
