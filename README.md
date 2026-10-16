# Secretar.IA — landing page para clínicas

Primeira versão institucional em português brasileiro: Next.js App Router,
TypeScript, React, Tailwind CSS 4 e ícones Lucide. O nome é provisório.
Sem backend, analytics, APIs pagas ou dados reais de pacientes.

## Executar

Requisitos: Node.js 24 LTS, npm e Git.

```bash
npm ci
npm run dev
```

O servidor de desenvolvimento usa a porta 3000. A produção é exportada em `out/` para hospedagem estática. Para validar:

```bash
npm run lint
npm run build
npm run typecheck
npm test
npm run start
```

O teste serve o artefato estático de produção em uma instância exclusiva na porta 3100, que deve estar livre.
Execute o build antes dos testes. Para instalar o Chromium do Playwright em uma
máquina local, use `npx playwright install chromium` e defina
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` com o caminho do executável, ou ajuste
`launchOptions` no `playwright.config.ts`. Neste ambiente é usado
`/usr/bin/chromium`; ele não é um Chrome DevTools MCP.

O `.npmrc` direciona o cache ao diretório temporário para não depender de uma
pasta pessoal gravável no ambiente em nuvem. `package-lock.json` fixa as versões.

## Organização

- `src/app/page.tsx`: conteúdo e seções da página inicial.
- `src/app/globals.css`: tokens, layouts, responsividade e movimento reduzido.
- `src/app/layout.tsx`: idioma e metadados SEO.
- `src/app/privacidade/page.tsx`: aviso inicial de privacidade.
- `src/components/`: navegação, marca, demonstração fictícia, formulário e rodapé.
- `src/lib/site.ts`: identidade, contatos e destinos centralizados.
- `tests/site.spec.ts`: fluxos reais em Chromium desktop e emulação móvel, com axe.
- `docs/design/`: referências oficiais locais e licenças preservadas.

## O que configurar antes de publicar

Edite `src/lib/site.ts`: `name`, `email`, `whatsapp` (DDI 55 + DDD + número,
sem pontuação), `url` (domínio HTTPS real) e, quando disponível, `leadEndpoint`.
Os botões de demonstração e navegação usam os destinos dessa configuração.
O botão para visualizar o exemplo navega para a conversa fictícia na página.
O link WhatsApp só aparece quando o número passa pela validação do formato.

O formulário pede nome, clínica, especialidade e e-mail, com mensagem opcional.
Valida campos obrigatórios e não aceita nome/clínica compostos só por espaços.
Sem `leadEndpoint`, **não envia nem armazena dados** e exibe essa informação
antes e depois da tentativa. Não simula sucesso. Dados não são persistidos no
localStorage e há aviso do navegador ao sair com campos alterados.

O endpoint público `https://formspree.io/f/xrperlry` está configurado. O envio
usa POST JSON com `nome`, `clinica`, `especialidade`, `contato`, `mensagem` e
`email` (cópia do contato, para identificação do remetente no Formspree), com
Accept application/json. Sucesso e generate_lead só ocorrem após HTTP 2xx e
JSON com `ok: true`. Há timeout de 15 segundos e os campos são preservados em
falhas. Nenhuma chave secreta é necessária no frontend.

No painel Formspree, confirme a ativação do formulário e o destinatário
fergasvi@outlook.com. Confira notificações, limite do plano e filtros antispam.
Depois da publicação, faça um envio manual e confira o registro no painel e o
e-mail (incluindo spam). Os testes automatizados interceptam todas as requisições
Formspree e não criam leads reais; seu sucesso não comprova entrega de e-mail.

Complete o aviso de privacidade com dados do controlador, contato, base legal,
fornecedores e política de retenção antes de habilitar coleta. O aviso inicial
não substitui a definição jurídica/operacional da política da empresa.

## Design e verificações

Paleta verde profundo, branco frio e lima; componentes responsivos, foco visível,
menu móvel, HTML semântico e suporte a `prefers-reduced-motion`. Não há clientes,
depoimentos, métricas comerciais ou integrações inventadas. A conversa é fictícia
e a confirmação de horários permanece com a equipe.

As instruções de `AGENTS.md` apontam para referências locais; elas não são
skills nativas instaladas. Nenhum MCP shadcn, Magic/21st ou Chrome DevTools
estava conectado nesta implementação. Playwright é executado pelo terminal.
Veja `docs/VALIDATION.md` para resultados e limites das verificações desta versão.

## Revisar e enviar ao GitHub

Nenhum commit, push ou deploy é feito automaticamente por esta implementação.
Revise os arquivos, configure a identidade e rode as verificações acima.

```bash
git status --short
git diff --check
git add AGENTS.md docs src tests .gitignore .npmrc package.json package-lock.json tsconfig.json next-env.d.ts postcss.config.mjs eslint.config.mjs playwright.config.ts README.md
git diff --cached --stat
git diff --cached
```

Confira o remoto existente com `git remote -v` na sua máquina e então:

```bash
git switch -c feat/landing-clinicas
git commit -m "Cria landing page institucional para clínicas"
git push -u origin feat/landing-clinicas
```

Abra um pull request dessa branch para `main` no GitHub. Como o remoto estava
vazio, talvez seja necessário publicar primeiro a branch inicial e definir
`main` como branch padrão, em vez de abrir PR imediatamente. Não force push.
Após revisão, escolha uma hospedagem compatível com Next.js e configure domínio,
contatos e integração de leads. **Nada foi publicado em produção nesta tarefa.**

Tipografia Manrope hospedada localmente via Fontsource, sob OFL 1.1.
Licença preservada em `docs/licenses/manrope-OFL.txt`.

## SEO e conversões

Configure `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) antes do build de
produção. Sem domínio definitivo, o site mantém `noindex`; com domínio válido,
gera canonical, sitemap e permite indexação. Veja
[SEO e conversões](docs/SEO-CONVERSIONS.md) para o contrato de eventos locais,
limitações, configuração de analytics e checklist de publicação. Não há
plataforma de mensuração conectada nem transmissão de eventos para terceiros.

Identidade atual: **Secretar.IA**, e-mail **fergasvi@outlook.com**,
telefone e WhatsApp **+55 16 99291-5744**, centralizados em `src/lib/site.ts`.
Os contatos foram fornecidos pelo responsável; não foram enviadas mensagens
nem feitas ligações como teste. O domínio público continua pendente.

## GitHub Pages

A hospedagem gratuita escolhida está preparada. Veja [como revisar e publicar no GitHub Pages](docs/GITHUB-PAGES.md). O workflow é manual; nada foi publicado automaticamente.
