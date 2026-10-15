# Instruções para trabalhar neste projeto

## Interfaces e design

Estas são instruções locais explícitas. Os arquivos em `docs/design/` são
referências versionadas; sua presença não significa instalação como skills
nativas nem conexão de ferramentas MCP.

1. Antes de criar ou alterar interfaces, leia
   `docs/design/frontend-design/SKILL.md` e respeite o objetivo e o escopo
   solicitados pelo usuário.
2. Antes de concluir alterações visuais, leia e aplique
   `docs/design/web-design-guidelines/SKILL.md` e
   `docs/design/web-design-guidelines/command.md`. A referência oficial pede
   regras atualizadas: consulte a fonte indicada quando houver acesso. Se a
   rede impedir, use a cópia local e informe que a atualização ficou pendente.
   Revise os arquivos envolvidos na tarefa; não interrompa para perguntar o
   escopo quando ele já estiver claro.
3. Mantenha consistência de cores, tipografia, espaçamentos e componentes.
   Reutilize os tokens e padrões existentes; não redesenhe áreas fora do escopo.
   Em conflito entre preferências estéticas das referências, prevalecem o
   pedido do usuário e a identidade existente; preserve a acessibilidade.
4. Verifique responsividade em telas pequenas e grandes, ausência de overflow,
   navegação por teclado, ordem e visibilidade de foco e contraste. Para WCAG AA,
   confira pelo menos 4,5:1 em texto comum e 3:1 em texto grande e elementos
   visuais necessários à identificação de controles.
5. Identifique os comandos reais na documentação, manifests e CI. Execute o
   build e as verificações disponíveis e pertinentes, incluindo lint, tipos e
   testes quando existirem. Não invente comandos ou declare aprovação sem
   executá-los. Sem aplicação ou ferramentas disponíveis, registre a limitação.
6. Ao entregar, informe os comandos e verificações executados, seus resultados
   e o que ficou pendente, com o motivo. Separe revisão de código de testes
   funcionais, visuais e de acessibilidade executados em navegador.

## Referências e ferramentas

- Consulte `docs/design/README.md` para fontes, versões e licenças. Preserve as
  licenças e atualize a proveniência ao atualizar as cópias.
- Consulte `docs/design/MCP.md` para o diagnóstico de MCP desta preparação.
  Reavalie as ferramentas expostas em cada sessão antes de declarar conexão.
- Instalar um pacote, criar `config.toml` ou iniciar um servidor não conecta
  automaticamente ferramentas ao agente do Codex pelo navegador.
- Nunca grave chaves de API no código, no repositório ou em exemplos. Use o
  armazenamento seguro de credenciais do cliente que efetivamente conecta MCP.
