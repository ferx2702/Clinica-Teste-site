# Revisão do site AgendIA — 6 de novembro de 2026

Esta é uma versão preparada para revisão. Nenhuma alteração foi enviada ao GitHub nem publicada no domínio.

## O que mudou

- Abertura apresenta WhatsApp, link de agendamento e CRM.
- Seção do CRM logo após a abertura, com ilustração explicitamente fictícia e seis grupos de funcionalidades. Não expõe endereços de acesso ao painel ou dados de clínicas.
- Demonstração de 42 segundos, sem áudio, com dados fictícios, controles nativos, legendas descritivas e descrição textual. Nenhum trecho do vídeo recebido, CPF ou telefone dele foi incorporado.
- Calculadora refeita como cenário mensal, sem valores iniciais e sem taxa automática. Não soma pedidos não convertidos a faltas.
- Conteúdo de equipe/piloto que ainda estava com campos a preencher foi retirado desta versão. Preços, contatos, Formspree e configuração do Analytics foram preservados.

## Nova calculadora

Campos obrigatórios: vagas ociosas no mês, quantidade dessas vagas que a clínica simula recuperar e valor médio recebido por consulta. Investimento mensal é opcional.

Receita bruta adicional = quantidade recuperada × valor médio recebido.

Se informado: saldo após somente a mensalidade = receita bruta adicional − investimento mensal. Não é lucro. Custos das consultas, impostos, implantação e prazos de recebimento não são calculados. A quantidade recuperada nunca pode superar as vagas ociosas. Todos os dados ficam no navegador.

Exemplos conferidos pela interface:

- 10 vagas ociosas, 4 recuperadas e R$ 150 por consulta → R$ 600 brutos. Investimento de R$ 200 → saldo de R$ 400 antes dos outros custos.
- 10 vagas, 2 recuperadas e R$ 250,50 → R$ 501. Investimento de R$ 800 → saldo de −R$ 299.
- Recuperação zero → receita zero. Recuperação acima da capacidade, vagas fracionadas e valores negativos são recusados. Campos incompletos não exibem resultado anterior.

## Verificação feita

- `npm ci --ignore-scripts --no-audit --no-fund`: concluído.
- `npm run check`, `npm run lint` e `npm run build`: aprovados.
- Revisão visual e funcional pela prévia em navegador: desktop e quadro móvel de 390 px (375 px úteis por causa da barra de rolagem). Menu, âncoras, calculadora, ausência de overflow horizontal e foco de teclado conferidos.
- Reprodução do MP4 confirmada pelo navegador: duração 42 segundos e tempo avançando. Vídeo H.264/yuv420p com faststart, sem áudio, aproximadamente 300 KB.
- `npm test`: não aprovado neste ambiente. Os 40 casos não puderam iniciar o Chromium por restrição de socket do ambiente. A suíte foi atualizada para o novo conteúdo e deve rodar no GitHub Actions antes de publicar. Não foi executada auditoria automática de acessibilidade com sucesso; a revisão manual não a substitui.
- Não foram enviados formulários reais ou mensagens de WhatsApp. Não houve teste de entrega no Formspree ou recebimento no Analytics.

## Como conferir sem publicar

Extraia o ZIP. Abra `index.html` da pasta do projeto no navegador. O vídeo também pode ser aberto em `public/media/agendia-demonstracao.mp4`.

Para servir o projeto com Node instalado, use `npm ci` e `npm run dev`. Para gerar os arquivos estáticos, use `npm run build` e `npm start`. O build gera `out/` e copia também a pasta `public/media`.

## Publicação posterior

O repositório enviado contém o workflow `.github/workflows/pages.yml` com publicação manual. Esta revisão não altera DNS, Caddy, CRM ou bot. Antes de publicar, confirme qual implantação serve `useagendia.io`; o arquivo de workflow ainda usa o endereço GitHub Pages como `SITE_URL`. O simples envio dos arquivos ao repositório não inicia esse workflow manual.

Ao atualizar o repositório, mantenha seus arquivos de domínio e configuração de hospedagem atuais. Envie os arquivos da raiz do projeto e a pasta `public/media` nas mesmas posições. Não envie `node_modules`, logs, resultados de testes ou `out/` como código-fonte.

A integração com sistemas de terceiros continua sujeita à compatibilidade. A reativação foi descrita como recurso configurável, sem anunciar uma conexão universal ou resultados garantidos.
