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
            ? "O formulário está configurado para encaminhar nome, clínica, especialidade, e-mail e mensagem ao serviço de recebimento definido pelo responsável pelo site."
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
        <h2>Antes de receber dados</h2>
        <p>
          O responsável pelo projeto deve completar este aviso com a identidade
          e o contato do controlador, finalidades e base legal, fornecedores
          envolvidos, retenção, segurança, compartilhamento e canal para
          exercício dos direitos previstos na LGPD. A integração de leads deve
          ser validada antes de habilitar o envio.
        </p>
      </main>
      <Footer />
    </>
  );
}
