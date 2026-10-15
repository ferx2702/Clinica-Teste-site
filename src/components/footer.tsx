import Link from "next/link";
import { Brand } from "./brand";
import { site, navigation, sitePath } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label={`${site.name}, início`}>
              <Brand />
            </Link>
            <p>
              Tecnologia que abre espaço
              <br />
              para o cuidado humano.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            {navigation.map((l) => (
              <a key={l.href} href={sitePath(`/${l.href}`)}>
                {l.label}
              </a>
            ))}
            <Link href={site.links.privacy}>Privacidade</Link>
          </nav>
          <div className="footer-contact">
            <strong>Começando perto de você.</strong>
            <span>{site.region}</span>
            {site.phone && (
              <a href={`tel:${site.phone}`}>Ligar para a equipe</a>
            )}
            {site.email ? (
              <a href={`mailto:${site.email}`}>{site.email}</a>
            ) : (
              <a href={sitePath(`/${site.links.demo}`)}>
                Conheça nossa proposta
              </a>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. Nome provisório.
          </span>
          <span>Feito para aproximar tecnologia e cuidado.</span>
        </div>
      </div>
    </footer>
  );
}
