# Hospedagem gratuita no GitHub Pages

Repositório escolhido: `https://github.com/ferx2702/Clinica-Teste-site.git`.
Endereço esperado após ativação e publicação bem-sucedida:
`https://ferx2702.github.io/Clinica-Teste-site/`.
O endereço do repositório armazena o código; GitHub Pages hospeda o site.
Nenhum domínio pago é necessário. GitHub Pages está disponível gratuitamente
para repositórios públicos; para privados, confirme a elegibilidade do plano.

## Preparação já concluída

- `next.config.ts`: exportação estática para `out/`, URLs com barra final e
  basePath configurável. Não usa servidor Next.js em produção.
- Links, assets, canonical, JSON-LD e sitemap respeitam o subdiretório.
- `.github/workflows/pages.yml`: build, lint, tipos e teste do artefato estático,
  seguidos da publicação oficial por GitHub Actions.
- O workflow é **manual** (`workflow_dispatch`): enviar código não dispara deploy.
- Credenciais usam apenas o token temporário fornecido pelo GitHub Actions.
  Não é necessário cadastrar token pessoal ou pagar serviço.

## Revisar e publicar

1. Envie os arquivos do projeto para o repositório, incluindo `.github/workflows/`,
   `scripts/`, `next.config.ts`, `playwright.pages.config.ts`, `public/` e lockfile.
   O README contém instruções de revisão/commit/push; não envie `.env`, `.next/`,
   `node_modules/` ou `out/`. O workflow gera os arquivos estáticos.
2. O workflow deve estar na branch padrão. Em **Settings → Pages**, escolha
   **GitHub Actions** como fonte. Se Pages não estiver disponível, confira
   visibilidade pública e permissões do proprietário/organização.
3. Em **Actions → Publicar Secretar.IA no GitHub Pages → Run workflow**, selecione
   a branch revisada e execute. Essa etapa publica o site na internet.
4. Aguarde todos os jobs terminarem e abra a URL fornecida pelo job de deploy.
   Confira os links WhatsApp, telefone e e-mail e o aviso do formulário.

O workflow ainda não foi enviado ou executado no GitHub nesta tarefa. Não há
confirmação de que Pages está habilitado nem de que a URL já está publicada.
A disponibilidade dos minutos gratuitos de Actions depende da conta e do plano;
nenhum serviço foi contratado.

## Validar o mesmo build localmente

```bash
NEXT_PUBLIC_SITE_URL=https://ferx2702.github.io NEXT_PUBLIC_BASE_PATH=/Clinica-Teste-site npm run build
npm run test:pages
NEXT_PUBLIC_BASE_PATH=/Clinica-Teste-site npm run start
```

O último comando inicia um servidor de arquivos local na porta 3000. Para
trabalhar na raiz durante desenvolvimento, use `npm run dev` sem essas variáveis.
Para a suíte completa local na raiz, execute `npm run build` sem as variáveis e
então `npm test`. Os testes iniciam seu próprio servidor estático na porta 3100.

## SEO e limites

A URL Pages fica configurada no workflow de build, liberando `index, follow`,
canonical e sitemap só nessa versão. No build local sem domínio, mantém noindex.
O sitemap publicado estará em
`https://ferx2702.github.io/Clinica-Teste-site/sitemap.xml`.
Em um Pages de projeto, o robô procura `robots.txt` na raiz do host
(`https://ferx2702.github.io/robots.txt`), que este repositório não controla.
O `robots.txt` no subdiretório não substitui o arquivo da raiz. O meta robots
continua presente em cada página; cadastre o sitemap explicitamente na ferramenta
do buscador quando quiser acompanhar a indexação.

GitHub Pages não executa APIs/backend. Por isso o formulário permanece honesto
sobre a ausência de envio; os links WhatsApp/e-mail/telefone funcionam sem backend.
Eventos de analytics continuam locais até definir e configurar o provedor.
