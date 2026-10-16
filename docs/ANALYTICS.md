# Google Analytics 4 — Secretar.IA

ID público configurado em `config.js`: **G-0EGN4M2JEW**.
O carregamento e o encaminhamento ficam em `analytics.js`, incluído nas três
páginas. O build copia o arquivo para `out/`. Não há segredo ou chave de API.

## Consentimento e privacidade

Implementação em modo básico: antes da aceitação não cria dataLayer, não carrega
gtag.js e não faz requisições ao Google pelo código desta integração. O banner
oferece aceitar e recusar com igual destaque. Recusar mantém o formulário e todos
os contatos funcionando. A escolha é salva no localStorage por até 180 dias;
arquivos corrompidos, ausentes ou expirados voltam a solicitar escolha.

“Preferências de privacidade”, no rodapé, permite mudar a decisão. Ao revogar,
a aplicação para de encaminhar eventos, aplica `ga-disable`, atualiza o consentimento
para negado e remove os cookies `_ga` e `_ga_0EGN4M2JEW` acessíveis no escopo
local. Isso não apaga dados anteriormente recebidos pelo Google.

O consentimento para anúncios permanece negado. Sinais do Google e personalização
de anúncios estão desabilitados na configuração do tag. A duração configurada
dos cookies é de 180 dias; o cookie_path é a pasta do site. Não há replay de
cliques ou leads anteriores à aceitação. Não adicionamos IDs de usuários.

Não encaminhamos os campos do formulário ao GA4. Cada evento próprio contém
somente o nome permitido, placement com lista de valores permitidos e contexto
da página. A URL é enviada sem query/fragmento; o referrer é limitado à origem.
Isso também remove parâmetros de campanha da coleta implementada. O Google pode
processar identificadores de navegação, cookies e dados técnicos, conforme suas
políticas; não se trata de coleta anônima garantida. O formulário, separadamente,
continua enviando seus dados ao Formspree. A política do site foi atualizada.

## Eventos configurados

- `page_view`: uma vez por carregamento de página com consentimento.
- `whatsapp_click`, `phone_click`, `email_click`, `contact_click`: intenção de contato.
- `form_attempt`, `form_unavailable`, `form_error`: acompanhamento do formulário.
- `generate_lead`: só após Formspree confirmar HTTP 2xx e JSON ok:true.

O contrato local `clara:conversion` foi preservado. Eventos antes da aceitação
são descartados para GA4. Não há informações dos campos dentro do payload do
Analytics. Clique no WhatsApp não significa mensagem entregue, assim como
telefone não significa ligação atendida.

## Ajustes que dependem do painel GA4

1. No fluxo Web desta propriedade, desative **Medição otimizada** (ou, no mínimo,
   as interações de formulários e cliques de saída). Usamos eventos explícitos;
   a coleta automática pode gerar duplicações ou incluir campos adicionais.
   A medição otimizada é uma configuração do servidor Google, não foi alterada
   por esta sessão. Não instale outro tag GA4/GTM em paralelo.
2. Em Administrador → Eventos, marque `generate_lead` como **evento principal**.
   Se desejar, acompanhe `whatsapp_click` como outro evento principal, distinguindo
   intenção de contato de lead recebido. Os eventos podem aparecer só depois de
   um envio real e do processamento no Google.
3. Revise retenção, acessos e as configurações de publicidade da propriedade.
   Defina a identidade do controlador e a documentação jurídica ainda pendente.

## Publicar e verificar recebimento real

Execute o workflow manual do GitHub Pages na main. Abra o site publicado em
uma janela nova, aceite Analytics e consulte **Relatórios → Tempo real** no GA4.
Clique em um CTA de contato. Aguarde o processamento; a primeira detecção pode
levar alguns minutos e relatórios consolidados podem demorar mais.

Bloqueadores, restrições de rede, recusa ou cookies restritos podem impedir a
coleta. Não desative a escolha do visitante para contornar essas situações.
A confirmação de entrega real e de eventos principais requer o painel da conta;
essa sessão não tem acesso autenticado à propriedade.

## Verificações executadas

Build, ESLint e sintaxe concluídos. 30 testes aprovados em Chromium desktop e
mobile no subdiretório Pages, incluindo consentimento antes de qualquer chamada,
recusa persistida, aceitação com ID correto, ausência de replay, sanitização do
payload e URL, revogação, remoção local de cookies, validade da escolha, teclado,
ausência de overflow e axe. Capturas do banner revisadas nos dois perfis.

Nos testes, gtag.js e respostas de coleta foram interceptados. Verificamos a
configuração e os comandos gerados pelo site, não o processamento de uma
biblioteca Google real ou a recepção pela propriedade. Nenhum evento de teste
foi enviado ao Google e nenhum lead foi enviado ao Formspree.
