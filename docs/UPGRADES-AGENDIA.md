# Demonstração e planejamento — AgendIA

## Conteúdo editável

- `index.html`: foto real (substituir o bloco reservado por imagem com alt, width, height e loading="lazy"), nome, função e biografia. Condições, disponibilidade e quantidade de vagas do piloto estão explicitamente pendentes.
- `config.js`: `proposalLabel` controla a chamada dos planos. Não anunciamos prazo de 24h sem confirmação. `planStartingPrices.essential` e `.agenda` aceitam um número positivo para mostrar “A partir de R$ …/mês”; `null` mantém o preço oculto.
- Vídeo: bloco reservado de 30–60 segundos, ainda sem arquivo ou player. Adicionar legendas e transcrição ao publicar.
- Páginas legais: continuam exigindo revisão dos dados empresariais, responsabilidades e condições reais.

## Calculadora

Hipótese inicial editável: 10 pedidos **sem agendamento** por semana, R$ 150 por consulta, 4 faltas por mês e recuperação de 10%. São dados ilustrativos, não métricas da AgendIA. Nenhum valor é transmitido ou guardado.

Fórmula mensal: `(pedidos sem agendamento × 4,33 + faltas) × ticket × taxa / 100`.
Os grupos devem ser distintos para evitar duplicidade. O resultado é bruto, sem custos, margem, capacidade ou investimento. Não representa retorno garantido. Campos vazios, negativos, fora dos limites ou contagens fracionadas não produzem estimativa.

## Demonstração

Três fluxos fictícios: primeira visita, retorno e lista de espera. Mensagens aparecem com indicador de digitação. Há pausa/continuação e leitura imediata; trocar cenário cancela a reprodução anterior. Preferência por movimento reduzido mostra todas as mensagens imediatamente. A demonstração pausa ao mudar de aba. A área tem altura reservada para evitar deslocar o restante da página. Não chama serviços de agenda ou WhatsApp.

## Imagem social

`public/brand/agendia-og.png`, 1200 × 630, é copiada para o build e declarada no Open Graph. Regere com `npm run build:og` ao editar textos em `scripts/create-og.mjs`. É necessário ter o Chromium do Playwright instalado ou informar `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. O navegador local padrão deste ambiente fica em `/usr/bin/chromium`.

## Publicação

O botão flutuante se oculta quando calculadora, planos, formulário ou rodapé entram na tela, evitando sobrepor controles e contatos.

O workflow do GitHub Pages continua manual. Enviar commits não publica o site. Os placeholders devem ser revisados antes de ativar a publicação.
