/* Interações leves. Contatos e Formspree são editados em config.js. */
(() => {
  "use strict";
  const config = window.SECRETARIA_CONFIG;
  if (!config) return;
  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(config.whatsappMessage)}`;
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = config.name;
  });
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = whatsappUrl;
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.href = `mailto:${config.email}`;
    el.textContent = config.email;
  });
  document.querySelectorAll("[data-phone]").forEach((el) => {
    el.href = `tel:${config.phone}`;
    const local = config.phone.replace(/\D/g, "").replace(/^55/, "");
    el.textContent =
      local.length === 11
        ? `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`
        : config.phone;
  });
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  // Contrato local: apenas tipo e posição do evento, sem dados dos campos.
  function track(event, placement = "interest_form") {
    window.dispatchEvent(
      new CustomEvent("clara:conversion", { detail: { event, placement } }),
    );
  }
  document.addEventListener("click", (e) => {
    const link = e.target instanceof Element ? e.target.closest("a") : null;
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const placement =
      link.dataset.placement || (link.closest("footer") ? "footer" : "page");
    if (href.startsWith("https://wa.me/")) track("whatsapp_click", placement);
    else if (href.startsWith("tel:")) track("phone_click", placement);
    else if (href.startsWith("mailto:")) track("email_click", placement);
    else if (link.hasAttribute("data-contact") || href === "#contato")
      track("contact_click", placement);
  });
  // Exemplos locais e fictícios; não enviam mensagens nem acessam agendas reais.
  const demoControls = document.querySelector(".demo-controls");
  const demoConversation = document.querySelector("#demo-conversation");
  const examples = {
    booking: [
      ["patient", "Olá! Queria agendar uma avaliação."],
      [
        "assistant",
        "Olá, Ana! Você já se consultou aqui ou será sua primeira visita?",
      ],
      ["patient", "Será minha primeira visita."],
      [
        "assistant",
        "Seja bem-vinda! Temos quinta, às 15h. Funciona para você?",
      ],
      ["patient", "Sim, pode marcar!"],
      [
        "assistant",
        "Combinado, Ana! Quinta, às 15h. Você receberá um lembrete no dia anterior.",
      ],
    ],
    reschedule: [
      ["patient", "Preciso mudar minha consulta de quinta."],
      ["assistant", "Posso ajudar. Você prefere um horário na próxima semana?"],
      ["patient", "Sim, no período da tarde."],
      [
        "assistant",
        "No nosso exemplo, terça às 16h está disponível. Quer esse horário?",
      ],
      ["patient", "Sim, esse fica melhor."],
      [
        "assistant",
        "Reagendamento confirmado neste exemplo. Se precisar de algo diferente, encaminho para a equipe.",
      ],
    ],
    waitlist: [
      ["patient", "Se surgir uma vaga mais cedo, podem me avisar?"],
      [
        "assistant",
        "Podemos incluir você na lista de espera. Quer receber um aviso por aqui?",
      ],
      ["patient", "Quero, pode me avisar."],
      [
        "assistant",
        "Neste exemplo, surgiu uma vaga amanhã, às 14h. Quer confirmar?",
      ],
      ["patient", "Sim, quero esse horário!"],
      [
        "assistant",
        "Vaga confirmada neste exemplo. A disponibilidade e a ordem dos avisos seguem as regras da clínica.",
      ],
    ],
  };
  if (demoControls && demoConversation) {
    demoControls.hidden = false;
    demoControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-demo]");
      if (!button || !examples[button.dataset.demo]) return;
      demoControls
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const label = document.createElement("span");
      label.className = "chat-label";
      label.textContent = "Exemplo fictício de atendimento";
      const bubbles = examples[button.dataset.demo].map(
        ([speaker, text], index) => {
          const bubble = document.createElement("div");
          bubble.className = `bubble ${speaker}`;
          bubble.textContent = text;
          const time = document.createElement("small");
          time.textContent = index < 2 ? "14:32" : "14:33";
          bubble.append(time);
          return bubble;
        },
      );
      demoConversation.replaceChildren(label, ...bubbles);
      const note = document.querySelector(".agenda-note strong");
      const caption = document.querySelector(".agenda-note div > span");
      note.textContent = {
        booking: "Mais um espaço preenchido.",
        reschedule: "Mudança de horário organizada.",
        waitlist: "Uma oportunidade de encaixe.",
      }[button.dataset.demo];
      caption.textContent = "Simulação. Nenhuma agenda real é acessada.";
      const times = {
        booking: ["QUI", "15h"],
        reschedule: ["TER", "16h"],
        waitlist: ["AMANHÃ", "14h"],
      };
      const [day, time] = times[button.dataset.demo];
      document.querySelector(".calendar-icon small").textContent = day;
      document.querySelector(".calendar-icon b").textContent = time;
    });
  }
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mobile-nav");
  function closeMenu() {
    if (nav && toggle) {
      nav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.hidden = !open;
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !nav.hidden) {
        closeMenu();
        toggle.focus();
      }
    });
    window
      .matchMedia("(min-width:1000px)")
      .addEventListener("change", closeMenu);
  }
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Uma entrada por seção, sem esconder o hero ou conteúdo sem JavaScript.
  if (!motion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".section-heading").forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
    motion.addEventListener("change", () => {
      if (motion.matches) {
        document
          .querySelectorAll(".reveal")
          .forEach((el) => el.classList.add("is-visible"));
        observer.disconnect();
      }
    });
  }
  // Evita que o atalho flutuante cubra campos ou o botão de envio no celular.
  const floating = document.querySelector(".floating-whatsapp");
  const contact = document.querySelector(".contact-section");
  if (floating && contact && "IntersectionObserver" in window) {
    const visibility = new IntersectionObserver((entries) => {
      floating.hidden = entries[0].isIntersecting;
    });
    visibility.observe(contact);
  }
  const form = document.querySelector("#lead-form");
  if (!form) return;
  form.action = config.endpoint || "#contato";
  let dirty = false;
  let sending = false;
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type=submit]");
  button.disabled = false;
  function announce(text, state) {
    status.textContent = text;
    status.dataset.state = state;
  }
  function clearError(input) {
    input.removeAttribute("aria-invalid");
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = "";
  }
  form.addEventListener("input", (e) => {
    dirty = true;
    clearError(e.target);
    if (!sending) announce("", "idle");
  });
  form.addEventListener("change", (e) => {
    dirty = true;
    clearError(e.target);
  });
  window.addEventListener("beforeunload", (e) => {
    if (dirty) e.preventDefault();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    let firstInvalid = null;
    for (const input of form.querySelectorAll("[required]")) {
      clearError(input);
      let message = "";
      if (!input.value.trim()) message = "Preencha este campo.";
      else if (input.id === "whatsapp") {
        const digits = input.value.replace(/\D/g, "");
        if (!/^(?:55)?[1-9][0-9]9[0-9]{8}$/.test(digits))
          message = "Informe DDD e celular válido. Ex.: (16) 99999-9999.";
      } else if (!input.checkValidity())
        message = "Confira o preenchimento deste campo.";
      if (message) {
        input.setAttribute("aria-invalid", "true");
        document.getElementById(`${input.id}-error`).textContent = message;
        firstInvalid ||= input;
      }
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    track("form_attempt");
    if (!config.endpoint) {
      track("form_unavailable");
      announce(
        "Envio indisponível. Fale com a gente pelo WhatsApp. Nenhum dado foi enviado.",
        "error",
      );
      return;
    }
    const payload = Object.fromEntries(new FormData(form));
    sending = true;
    button.disabled = true;
    form.querySelector(".submit-label").textContent = "Enviando…";
    form.querySelector(".submit-spinner").hidden = false;
    form.querySelector(".submit-arrow").hidden = true;
    // Preserve uma cópia coerente dos campos enquanto a requisição está em andamento.
    form.querySelectorAll("input,select,textarea").forEach((input) => {
      input.disabled = true;
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Falha no envio");
      const data = await response.json();
      if (data.ok !== true) throw new Error("Recebimento não confirmado");
      track("generate_lead");
      form.reset();
      dirty = false;
      announce(
        "Solicitação enviada! Vamos entrar em contato pelo WhatsApp informado para combinar sua demonstração.",
        "success",
      );
    } catch {
      track("form_error");
      announce(
        "Não foi possível enviar. Seus dados foram mantidos. Tente novamente ou fale pelo WhatsApp.",
        "error",
      );
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      form.querySelectorAll("input,select,textarea").forEach((input) => {
        input.disabled = false;
      });
      form.querySelector(".submit-label").textContent =
        "Solicitar demonstração";
      form.querySelector(".submit-spinner").hidden = true;
      form.querySelector(".submit-arrow").hidden = false;
    }
  });
})();
