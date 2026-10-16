"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowUpRight, LoaderCircle, MessageCircle } from "lucide-react";
import { trackConversion } from "@/lib/analytics";
import { site, whatsappUrl, sitePath } from "@/lib/site";
type State = "idle" | "loading" | "success" | "error" | "unconfigured";
export function LeadForm() {
  const [state, setState] = useState<State>("idle");
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    function warn(e: BeforeUnloadEvent) {
      if (dirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    for (const key of ["nome", "clinica", "contato"]) {
      if (!String(fields[key] ?? "").trim()) {
        const input = form.elements.namedItem(key) as HTMLInputElement;
        input.setCustomValidity("Preencha este campo sem usar apenas espaços.");
        input.reportValidity();
        return;
      }
    }
    trackConversion("form_attempt");
    if (!site.leadEndpoint) {
      trackConversion("form_unavailable");
      setState("unconfigured");
      return;
    }
    setState("loading");
    try {
      const response = await fetch(site.leadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...fields, email: fields.contato }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Falha no envio");
      const result = await response.json();
      if (result.ok !== true) throw new Error("Recebimento não confirmado");
      trackConversion("generate_lead");
      setState("success");
      setDirty(false);
      form.reset();
    } catch {
      trackConversion("form_error");
      setState("error");
    }
  }
  const whatsapp = whatsappUrl();
  return (
    <div className="lead-panel">
      <h3>Vamos conhecer sua clínica?</h3>
      <p>Conte um pouco sobre a sua rotina.</p>
      <div className="form-notice" id="form-notice">
        {site.leadEndpoint
          ? "Seus dados serão enviados pelo Formspree para responder ao seu interesse. Não inclua informações de pacientes."
          : "Formulário em preparação: o envio ainda não está conectado. Seus dados não serão enviados nem armazenados."}
      </div>
      <form
        onSubmit={submit}
        aria-describedby="form-notice"
        onChange={(e) => {
          setDirty(true);
          const target = e.target;
          if (target instanceof HTMLInputElement) target.setCustomValidity("");
          if (state !== "loading") setState("idle");
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nome">
              Seu nome <span>*</span>
            </label>
            <input
              id="nome"
              name="nome"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Como podemos te chamar…"
            />
          </div>
          <div className="field">
            <label htmlFor="clinica">
              Clínica ou consultório <span>*</span>
            </label>
            <input
              id="clinica"
              name="clinica"
              autoComplete="organization"
              required
              maxLength={150}
              placeholder="Nome da sua clínica…"
            />
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="especialidade">
              Especialidade <span>*</span>
            </label>
            <select
              id="especialidade"
              name="especialidade"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option>Odontologia</option>
              <option>Nutrição</option>
              <option>Outra especialidade</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="contato-email">
              E-mail para contato <span>*</span>
            </label>
            <input
              id="contato-email"
              type="email"
              name="contato"
              autoComplete="email"
              required
              maxLength={254}
              spellCheck={false}
              placeholder="voce@clinica.com.br…"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="mensagem">
            O que você gostaria de simplificar?{" "}
            <span className="optional">Opcional</span>
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            maxLength={2000}
            rows={3}
            placeholder="Conte sobre os desafios administrativos da sua clínica…"
          />
        </div>
        <p className="form-privacy">
          Ao enviar, você solicita contato sobre nossas soluções. Leia o{" "}
          <a href={sitePath(`${site.links.privacy}/`)}>aviso de privacidade</a>.
          Não envie dados de pacientes.
        </p>
        <button
          className="button form-submit"
          type="submit"
          disabled={state === "loading"}
        >
          {state === "loading" ? (
            <>
              <LoaderCircle className="spin" size={18} aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              Solicitar demonstração{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
        <div
          className={`form-status ${state === "error" ? "error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {state === "success" &&
            "Solicitação enviada. Obrigado pelo interesse!"}
          {state === "error" &&
            "Não foi possível enviar. Seus dados foram mantidos no formulário. Tente novamente."}
          {state === "unconfigured" &&
            "Envio indisponível: falta conectar um serviço de recebimento de leads. Nenhum dado foi enviado."}
        </div>
      </form>
      {whatsapp ? (
        <a
          className="whatsapp-link"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={17} aria-hidden="true" />
          Prefere conversar pelo WhatsApp?{" "}
          <span className="sr-only">Abre em nova aba</span>
        </a>
      ) : (
        <p className="contact-pending">
          <MessageCircle size={16} aria-hidden="true" /> WhatsApp disponível
          após configuração do contato.
        </p>
      )}
    </div>
  );
}
