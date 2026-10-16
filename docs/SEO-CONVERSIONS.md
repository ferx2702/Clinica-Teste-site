# SEO, indexação e conversões

## Identidade de busca

Título inicial: **IA para clínicas em Ribeirão Preto | Secretar.IA**.
Descrição: **Automação com IA para clínicas odontológicas e consultórios de
nutrição em Ribeirão Preto. Organize o atendimento e simplifique tarefas administrativas.**

A página mantém um H1 e uma sequência H2/H3, com header, nav, main, sections,
articles, formulário e footer. A privacidade tem título e descrição próprios.
O JSON-LD da página inicial declara Organization e Service ligados por `@id`,
com área atendida em Ribeirão Preto. Não declara MedicalClinic, clientes,
avaliações, endereço físico ou integrações não confirmadas.

## Domínio e publicação

Configure `NEXT_PUBLIC_SITE_URL` no ambiente de build com a origem pública HTTPS
definitiva (sem caminho, parâmetros ou credenciais). Alternativamente, ajuste
`site.url` em `src/lib/site.ts`. Variáveis NEXT_PUBLIC não são secretas e são
incorporadas no build: execute um novo build após alterar o domínio.

- Sem domínio: `noindex, follow`, canonical ausente e sitemap sem URLs.
- Com domínio válido: `index, follow`, canonical absoluta e sitemap da home.
- `/privacidade`: sempre `noindex, follow`, fora do sitemap, canonical própria
  apenas quando o domínio foi configurado.
- `/robots.txt`: permite crawling para que robôs possam ler o noindex. Bloquear
  via Disallow impediria essa leitura; noindex não é mecanismo de privacidade.
- `/sitemap.xml`: inclui só a home quando há domínio configurado, sem datas de
  alteração artificiais.

Antes de produção, confirme o domínio em redirects HTTPS e www/não-www, HTTP 200,
canonical, robots e ausência de `X-Robots-Tag: noindex` injetado pela hospedagem.
Cadastre o sitemap na ferramenta de webmaster do buscador, se desejado. Não há
validação pública nem garantia de indexação, posição ou rich results nesta tarefa.

## Performance

As rotas são pré-renderizadas. A fonte variável Manrope, em WOFF2 latino,
é hospedada localmente, pré-carregada por `next/font/local`, com display swap e
fallback ajustado. Não se carrega o CSS de todos os alfabetos do pacote. A licença
OFL acompanha a fonte em `docs/licenses/`. O visual usa CSS/SVG em vez de imagens
pesadas, sem serviços de fontes externos ou scripts de analytics de terceiros.
Há limites responsivos, movimento reduzido e validação de overflow no navegador.

Medições locais não equivalem a Core Web Vitals de usuários reais. Verifique
Lighthouse/PageSpeed e dados de campo depois de hospedar no domínio definitivo.

## Contrato de eventos

Os eventos são emitidos como `CustomEvent('clara:conversion', {detail})` no
window. O payload contém **apenas** `event` e `placement` (header, footer, page
ou interest_form). Não inclui campos do formulário, texto livre, telefone,
e-mail, URL completa ou identificadores pessoais.

| Evento             | Quando ocorre                                  |
| ------------------ | ---------------------------------------------- |
| `contact_click`    | Clique no CTA que leva à seção de contato      |
| `whatsapp_click`   | Clique em link WhatsApp configurado            |
| `phone_click`      | Clique em link tel configurado                 |
| `email_click`      | Clique em link mailto configurado              |
| `form_attempt`     | Tentativa de envio após passar a validação     |
| `form_unavailable` | Tentativa válida sem endpoint conectado        |
| `form_error`       | Timeout, erro de rede ou resposta HTTP de erro |
| `generate_lead`    | Resposta HTTP 2xx do endpoint real de leads    |

O endpoint deve garantir que 2xx significa recebimento efetivo. Clique ou
validação não é lead recebido. Erros nativos de preenchimento não são conversão.
Eventos de links representam intenção de contato, não entrega de mensagem ou
ligação atendida. E-mail, telefone e WhatsApp fornecidos pelo responsável estão configurados em `site.ts`.

**Não há provedor externo de analytics configurado.** O formulário de contato envia dados ao Formspree, separado destes eventos locais. Para medir em GA4/GTM ou outra plataforma,
conecte um único listener a esse contrato depois da configuração e do
consentimento quando aplicável. Carregue o provedor conforme a política definida;
não crie cookies ou retransmita eventos antes dessa condição. Evite instrumentar
os mesmos cliques outra vez pelo GTM, causando duplicação. Não persista nem
reenvie eventos anteriores à autorização.

Use a ferramenta de debug do provedor para conferir recebimento e marcar
`generate_lead` como conversão principal. A mensuração externa permanece pendente. O endpoint de leads Formspree está configurado, mas a entrega real de e-mail deve ser verificada na conta. ID de mensuração público não é uma chave secreta;
segredos de APIs nunca pertencem ao frontend.

Para inspecionar localmente (antes da interação):

```js
window.addEventListener("clara:conversion", ({ detail }) =>
  console.log(detail),
);
```

Os testes exercitam cliques, falhas de envio, ausência de falso lead e
payload sem PII. Links temporários criados exclusivamente no teste validam a
classificação tel/WhatsApp/e-mail; isso não valida um contato comercial real.
