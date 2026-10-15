# Referências locais de design

Preparadas em 2026-10-15 a partir dos repositórios oficiais. São instruções
locais lidas por orientação do `../../AGENTS.md`, sem instalação como skills
nativas. Nenhum componente ou visual do site foi criado ou alterado.

## Uso nas próximas tarefas

Antes de implementar interfaces, leia [frontend-design](frontend-design/SKILL.md)
para orientar hierarquia, tipografia, cores, layout e conteúdo dentro do escopo.
Antes de concluir mudanças visuais, leia
[web-design-guidelines](web-design-guidelines/SKILL.md) e suas
[regras complementares](web-design-guidelines/command.md), revise os arquivos
alterados e relate problemas com localização `arquivo:linha`.

A skill da Vercel manda buscar as regras atuais em
<https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md>.
Use a cópia local quando não houver rede e declare essa limitação. Não trate
uma revisão documental como teste de responsividade, teclado ou contraste.

## Origem e licenças

| Arquivos locais | Origem oficial | Licença preservada |
| --- | --- | --- |
| `frontend-design/SKILL.md` | `anthropics/skills`, `skills/frontend-design/` | Apache 2.0 em `frontend-design/LICENSE.txt` |
| `web-design-guidelines/SKILL.md` | `vercel-labs/agent-skills`, `skills/web-design-guidelines/` | MIT declarada no README original, preservado em `web-design-guidelines/UPSTREAM-README.md` |
| `web-design-guidelines/command.md` | `vercel-labs/web-interface-guidelines` | MIT, copyright Vercel Labs, em `web-design-guidelines/LICENSE` |

O checkout de `agent-skills` não contém um arquivo LICENSE separado; sua
declaração original foi preservada sem inventar um aviso de copyright. O
arquivo MIT completo incluído provém de `web-interface-guidelines` e acompanha
as regras desse repositório. A licença Apache acompanha a própria skill da
Anthropic; não foram copiados scripts, fontes ou outros assets de suas outras
skills.

[SOURCES.json](SOURCES.json) registra URLs fixadas por commit e SHA-256 de cada
arquivo copiado. As cópias são integrais, sem tradução ou adaptação. Para
atualizar, leia os novos conteúdos e licenças oficiais, substitua as cópias e
atualize os commits e hashes; não sobrescreva alterações locais sem revisão.

## Validação desta preparação

Foram lidas as instruções oficiais e conferidas as cópias byte a byte, seus
hashes e os links relativos da documentação. Consulte [MCP.md](MCP.md) para o
diagnóstico das ferramentas.

O projeto estava sem arquivos e sem commits antes desta tarefa. Não há
manifest, build, lint, teste ou site para executar. Build, testes funcionais,
responsividade, teclado e contraste ficam pendentes até existir uma aplicação.
