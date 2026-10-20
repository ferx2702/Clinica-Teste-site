# GitHub Pages — versão HTML/CSS/JavaScript

A versão atual é estática e usa HTML, CSS e JavaScript puros. O procedimento de
publicação é gratuito para repositórios públicos elegíveis no GitHub.

1. Envie os arquivos revisados ao repositório `ferx2702/Clinica-Teste-site`.
2. Escolha GitHub Actions em Settings → Pages.
3. Execute Actions → Publicar AgendIA no GitHub Pages → Run workflow, branch main.

O workflow executa npm ci, lint, check, build e testes no subdiretório Pages,
publicando apenas `out/`. É manual e não dispara no push. A URL esperada é
`https://ferx2702.github.io/Clinica-Teste-site/`. Os links e assets são relativos,
funcionando no domínio raiz e no subdiretório, sem basePath de framework.

```bash
npm ci
npm run build
BASE_PATH=/Clinica-Teste-site npm test
BASE_PATH=/Clinica-Teste-site npm start
```

O servidor local usa a porta 3000; o runner reserva a 3100. `SITE_URL` altera URLs
de SEO no build (incluindo canonical, Open Graph, JSON-LD e sitemap). Os arquivos
originais já contêm o endereço Pages e podem ser abertos diretamente.

A home é indexável, e os documentos legais provisórios usam noindex. O sitemap
contém só a home. O robots.txt em `/Clinica-Teste-site/robots.txt` não substitui
`https://ferx2702.github.io/robots.txt`, procurado pelo buscador na raiz do host.
Este repositório não controla a raiz do usuário; pode-se cadastrar o sitemap
explicitamente na ferramenta de webmaster do buscador.

Formspree recebe o formulário diretamente, sem backend no Pages. Nenhuma
mensagem ou ligação é disparada por nossos testes. A conclusão do workflow e a
entrega de leads precisam ser verificadas depois da publicação real.
