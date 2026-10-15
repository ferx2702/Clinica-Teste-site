# MCP: diagnóstico e caminhos de configuração

Diagnóstico desta sessão do Codex pelo navegador, em 2026-10-15.

## Ferramentas efetivamente disponíveis

Foram inspecionados o catálogo de ferramentas expostas ao agente e os recursos
e templates MCP. O conector disponível é Cloud Environment Onboarding, com
leitura e atualização da configuração do ambiente; há também ferramentas de
terminal, arquivos, imagens e leitura de skills. Nenhuma ferramenta shadcn,
Magic/21st ou Chrome DevTools está exposta. A listagem de recursos corrobora
o diagnóstico, mas recursos vazios isoladamente não provam ausência de tools.

| Servidor desejado | Conectado e utilizável nesta sessão? | Teste MCP |
| --- | --- | --- |
| shadcn | Não; nenhuma ferramenta exposta | Não executável sem conexão |
| Magic / 21st | Não; nenhuma ferramenta exposta | Não executável sem conexão e autenticação |
| Chrome DevTools | Não; nenhuma ferramenta exposta | Não executável sem conexão e navegador acessível ao servidor |

Ler os READMEs via Git/HTTPS não é consultar esses servidores por MCP.
Nenhum pacote MCP foi instalado e nenhuma conexão foi declarada bem-sucedida.

## Codex pelo navegador e clientes locais

Esta sessão não fornece uma ferramenta para registrar ou ativar servidores
MCP arbitrários. Criar `~/.codex/config.toml` no terminal da máquina remota não
é evidência de que o agente hospedado vá ler esse arquivo. As instruções para
Codex CLI não devem ser apresentadas como suporte confirmado do Codex web.

No produto pelo navegador, a conexão precisa ser oferecida pelo próprio host,
por uma integração/plugin ou cadastro de servidor remoto compatível. Verifique
as opções efetivamente oferecidas à conta e ao workspace. Se houver cadastro
de MCP remoto, use transporte e autenticação aceitos pelo host; se não houver,
não há conexão direta demonstrada nesta interface. Um App em outra conversa
ou produto também não comprova disponibilidade neste agente.

Para servidores stdio, um host com suporte explícito precisaria executar o
processo e encaminhar as ferramentas. Um gateway remoto é uma implantação
separada, que exige autenticação e compatibilidade com o cliente; iniciar
`npx` neste container não a realiza. Como alternativa, use Codex CLI ou outro
cliente que suporte os servidores oficialmente, na máquina desse cliente.

Instalar o pacote disponibiliza o programa. Configurar o cliente informa como
iniciá-lo ou acessá-lo. Conectar envolve inicialização MCP, descoberta de tools,
autenticação quando exigida e exposição ao agente. Só uma chamada real com
resposta esperada confirma uso; arquivo de configuração e instalação não bastam.

## shadcn

Fonte: <https://ui.shadcn.com/docs/mcp>. Como o acesso direto retornou 403 do
proxy, foi lido o documento oficial equivalente em
<https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/mcp.mdx>.

O servidor oficial usa stdio: comando `npx`, argumentos `shadcn@latest`, `mcp`.
O documento mostra configuração manual em `~/.codex/config.toml` para Codex;
isso se aplica ao cliente que lê esse arquivo, não comprova conexão no web.
No cliente compatível, registre o servidor, reinicie/reconecte e confirme tools.
No navegador, é necessária integração do host para esse servidor stdio ou
gateway compatível; não foi identificada tal integração nesta sessão.

Depois de conectado, faça apenas uma consulta de listagem/pesquisa por
`button` no registry público. Instalar componentes é outra operação, que
altera o projeto e exige aplicação e configuração apropriadas. Não foi
criado `components.json` nem instalado componente nesta tarefa.

## Magic MCP / 21st MCP

Fontes: <https://21st.dev/magic> e
<https://github.com/21st-dev/magic-mcp>. O endereço do site retornou 403 do
proxy; o README oficial foi acessado pelo GitHub.

Segundo o README consultado, Magic foi substituído pelo 21st MCP; o pacote
`@21st-dev/magic` permanece como proxy de compatibilidade. O caminho atual é
o servidor HTTP `https://21st.dev/api/mcp`, com autenticação no header
`x-api-key`; a documentação aponta <https://21st.dev/mcp> para obter acesso.

Se o host do Codex web disponibilizar cadastro de MCP HTTP e armazenamento
seguro desse header, registre o endpoint por essa integração e informe a chave
somente no campo seguro. Sem suporte a esse transporte/header, a conexão
direta não está estabelecida; use um cliente compatível. Não presuma que
variáveis do terminal serão lidas pelo conector hospedado.

Após conexão autenticada, confira as tools disponíveis e faça uma consulta
simples `search` por um componente. `get_usage` pode verificar habilitação de
geração; disponibilidade e cobrança dependem da conta. Não use geração como
teste inicial. Não foi solicitada nem armazenada chave nesta tarefa.

## Chrome DevTools MCP

Fonte: <https://github.com/ChromeDevTools/chrome-devtools-mcp>.

O servidor oficial usa stdio, com Node.js LTS, npm e Chrome compatível. Para
um cliente com suporte, a documentação mostra `npx -y chrome-devtools-mcp@latest`;
`--headless` permite executar sem interface gráfica. Há opções de conexão com
Chrome já iniciado, descritas na documentação oficial.

No Codex web, seria necessário suporte do host ao servidor/gateway e um Chrome
acessível a esse servidor. O navegador em que o usuário abriu o Codex não se
torna automaticamente controlável pelo MCP dentro do container. Não exponha
uma porta de depuração pública para tentar conectá-lo.

Depois de conectado, liste páginas, abra uma página de teste sem dados
sensíveis e obtenha um snapshot com conteúdo esperado. Isso verifica servidor,
navegador e chamada da ferramenta. Não foi instalado ou iniciado Chrome nesta
tarefa, pois isso não conectaria o MCP ao agente atual.

## Rede e limites da verificação

GitHub e `raw.githubusercontent.com` responderam às leituras realizadas.
Os sites `ui.shadcn.com`, `21st.dev` e a documentação em
`developers.openai.com` retornaram 403 do proxy. Isso é limitação de acesso
observada, não falha de autenticação MCP. Os READMEs oficiais no GitHub foram
usados quando disponíveis. Não foi testada a conectividade autenticada com
`https://21st.dev/api/mcp` nem alterada a política de rede.

Antes de usar as ferramentas futuramente, reavalie a conexão, os domínios de
registry/API necessários e as permissões no host. Chaves pertencem ao cofre do
cliente/conector efetivo, nunca ao repositório ou a argumentos registrados.
