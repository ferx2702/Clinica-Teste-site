# Secretar.IA — nova landing page em HTML/CSS/JavaScript

Esta implementação substitui a aplicação Next.js anterior, preservando as
referências de design, suas licenças, o endpoint Formspree, o e-mail comercial,
os eventos de conversão e a publicação gratuita por GitHub Pages.

## Direção e conteúdo

Verde-petróleo #123f3b, verde suave #dcece4, neutro #f7f9f5, texto #173c37 e
coral #e7b79d. Fonte variável Manrope local. O hero combina conversa HTML/CSS e
recorte de agenda; não há robôs, imagens externas, gradientes ou métricas falsas.
A composição varia entre colunas, lista funcional, etapas numeradas e FAQ.

A ordem segue o briefing: header, hero, problema, como funciona, funcionalidades,
públicos, benefícios esperados, investimento, FAQ, contato e rodapé. Os preços,
prazo de referência, documentos legais e resultados ainda sem evidência estão
marcados como placeholders. Não há logos de clientes ou depoimentos inventados.

WhatsApp e telefone atualizados para +5516992915744. CTA primário usa a mensagem
solicitada. O formulário secundário usa nome, clínica, especialidade, WhatsApp e
mensagem opcional, sem pedir e-mail. Endpoint: https://formspree.io/f/xrperlry.

A página não implementa WhatsApp Business, IA ou Google Agenda. Ela apresenta
esses fluxos, com ressalvas explícitas de implantação, permissões e validação.
A ordem proposta da fila é particulares, convênio retorno, convênio novos; isso
não representa triagem de urgência e precisa ser validado pela clínica.

## SEO, semântica e desempenho

Title: “Secretária virtual no WhatsApp para clínicas | Secretar.IA”.
Description voltada a dentistas/nutricionistas em Ribeirão Preto. H1 único e
hierarquia sem saltos. Schema Organization/Service ligado por @id, sem endereço
físico inventado ou classificação como clínica. Canonical e Open Graph apontam
para o Pages. SITE_URL altera as URLs no build. Home index,follow; páginas legais
noindex,follow, fora do sitemap. Redirecionamento da privacidade antiga mantido.
O robots.txt de um Pages em subdiretório não controla a raiz do host.

Sem dependências no navegador: apenas CSS, JavaScript, config público, SVGs e
uma fonte WOFF2 local de 24.836 bytes. Scripts usam defer. O conteúdo é visível
sem JavaScript. FAQ usa details/summary nativos. Movimento reduzido respeitado.
O botão flutuante se oculta enquanto a seção de contato está visível para não
cobrir o formulário ou seu envio.

## Eventos e envio

Contrato preservado: CustomEvent `clara:conversion` em window, apenas com event
e placement. Eventos de WhatsApp, telefone, e-mail, botões de contato, tentativa,
erro, indisponibilidade e confirmação de lead. Sem provedor de analytics, cookies
ou transmissão externa desses eventos. O formulário, separadamente, envia os
dados informados ao Formspree.

Validação inline, foco no primeiro erro e celular brasileiro com DDD. Durante
o envio, inputs e botão ficam desativados, evitando edição e duplicação. Só há
sucesso após HTTP 2xx e JSON ok:true. Falhas e timeout preservam dados. Testes
interceptam todas as chamadas Formspree, sem gerar leads na conta real.

## Validação

- `npm run lint`, `npm run check` e `npm run build`: concluídos.
- `npm test`: 20 testes aprovados, desktop e celular.
- `BASE_PATH=/Clinica-Teste-site npm test`: 20 testes aprovados no subdiretório
  usado no GitHub Pages. O workflow foi atualizado para o build sem framework.
- Verificados: navegação/menu, teclado, FAQ, um H1, níveis de headings, schema,
  canonical/robots/sitemap, novos contatos, validação inline, loading/sucesso,
  falhas de rede/422/resposta sem confirmação, nova tentativa e eventos sem PII.
- axe não detectou violações WCAG 2 A/AA e 2.1 AA nas três páginas, nos dois perfis.
- Larguras 320, 390, 768 e 1440 sem overflow horizontal. Movimento reduzido e
  conteúdo sem JavaScript verificados; sem JS, o envio fica desativado.
- Abertura direta por file:// tentou ser verificada, mas o Chromium gerenciado
  bloqueou a navegação (ERR_BLOCKED_BY_ADMINISTRATOR). Essa modalidade não foi
  validada neste ambiente; as verificações ocorreram via servidor HTTP local.
  Os arquivos são estáticos e não dependem de módulos ou compilação para abrir.
- Capturas desktop e celular revisadas; revisão encontrou sobreposição do atalho
  sobre o formulário e glifos de seta ausentes, corrigidos com ocultação e SVG.
- Medições locais em `performance-local.json`: uma navegação por perfil, sem
  limitação de CPU/rede. Não equivalem a Lighthouse/PageSpeed ou dados de campo.

## Pendências

Validar entrega real no Formspree e eventuais regras que exijam e-mail (o novo
formulário pede WhatsApp); confirmar preços, setup, prazos, identidade jurídica,
base legal e retenção. Preencher os documentos legais após revisão. Confirmar o
escopo e funcionamento real de WhatsApp/Google Agenda antes de contratar ou
ativar automações para uma clínica. Não houve teste com pacientes, criação de
compromissos, envios reais ou integração paga. Nenhum MCP dos três solicitados
está conectado: usamos Playwright/Chromium pelo terminal.

## Atualização posterior: Analytics

GA4 G-0EGN4M2JEW agora está configurado com consentimento prévio e preferências
no rodapé. As observações anteriores de ausência de provedor foram superadas.
Ver ANALYTICS.md para arquitetura, testes, limites e ajustes no painel Google.
