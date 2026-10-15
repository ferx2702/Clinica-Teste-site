"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { navigation, site, sitePath } from "@/lib/site";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label={`${site.name}, início`}>
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((link) => (
            <a key={link.href} href={sitePath(`/${link.href}`)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="button button-small header-cta"
          href={sitePath(`/${site.links.demo}`)}
        >
          Vamos conversar <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav container"
          aria-label="Navegação móvel"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              document
                .querySelector<HTMLButtonElement>(".menu-toggle")
                ?.focus();
            }
          }}
        >
          {[
            ...navigation,
            { label: "Solicitar demonstração", href: site.links.demo },
          ].map((link) => (
            <a
              key={link.href}
              href={sitePath(`/${link.href}`)}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
