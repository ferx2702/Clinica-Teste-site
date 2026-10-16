import { origin } from "@/lib/seo";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site, sitePath } from "@/lib/site";
export const metadata: Metadata = {
  title: `Privacidade | ${site.name}`,
  robots: { index: false, follow: true },
  description: `Saiba como o site da ${site.name} trata informações de contato, formulários e eventos de navegação.`,
  alternates: origin
    ? { canonical: `${origin}${sitePath("/privacidade/")}` }
    : undefined,
};
export default function Privacy() {
  return (
    <>
      <Header />
      <main id="conteudo" className="container privacy-page">
        <Link className="text-link" href="/">
          ← Voltar ao início
        </Link>
        <h1>Privacidade, com clareza.</h1>
        <p>
          Este é um aviso da versão inicial de {site.name}, nome provisório do
          projeto.
        </p>
        <h2>Formulário de interesse</h2>
        <p>
          {site.leadEndpoint
            ? "Ao enviar, nome, clínica, especialidade, e-mail e mensagem são encaminhados ao Formspree, serviço externo que recebe e processa as solicitações para a Secretar.IA. Esses dados são usados para responder ao seu pedido de contato e apresentar as soluções de automação."
            : "Nesta versão, o formulário não está conectado a um serviço de recebimento. Os campos preenchidos ficam apenas na página aberta: não são enviados ou armazenados pela aplicação."}{" "}
          Não inclua dados de pacientes, informações clínicas ou outros dados
          sensíveis.
        </p>
        <h2>Cookies e serviços externos</h2>
        <p>
          Esta aplicação prepara eventos locais de interação sem incluir dados
          dos campos, telefone ou endereço de e-mail. Não há provedor de
          analytics ou publicidade conectado nem cookies de rastreamento. O
          encaminhamento futuro desses eventos exige configuração de um provedor
          e consentimento quando aplicável. As fontes são hospedadas junto ao
          site, sem requisições a serviços de fontes externos. O serviço de
          hospedagem pode manter registros técnicos de acesso, conforme sua
          própria configuração e política.
        </p>
        <h2>Contato e WhatsApp</h2>
        <p>
          Quando configurado, o link de WhatsApp abre um serviço externo sujeito
          às políticas do respectivo fornecedor. Para entrar em contato, use o
          e-mail comercial: <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <h2>Seus dados e seus direitos</h2>
        <p>
          Para solicitar informações, correção ou exclusão dos dados enviados,
          entre em contato pelo e-mail{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. As solicitações
          podem ficar registradas no Formspree e na caixa de e-mail configurada
          pelo responsável. O prazo de retenção e a identificação jurídica do
          controlador ainda devem ser formalizados pela empresa. Não utilize o
          formulário para enviar dados de pacientes. Consulte também a{" "}
          <a
            href="https://formspree.io/legal/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidade do Formspree (abre em nova aba)
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
