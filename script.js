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
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  document.querySelectorAll("[data-proposal-label]").forEach((el) => {
    el.textContent = config.proposalLabel || "Proposta personalizada";
  });
  document.querySelectorAll("[data-plan-price]").forEach((el) => {
    const price = config.planStartingPrices?.[el.dataset.planPrice];
    if (typeof price === "number" && Number.isFinite(price) && price > 0) {
      el.textContent = `A partir de ${currency.format(price)}/mês`;
      el.hidden = false;
    }
  });
  // Simulação local: os dois grupos são distintos; nenhum dado é enviado.
  const calculator = document.querySelector("#impact-calculator");
  if (calculator) {
    const total = document.querySelector("#impact-total");
    const breakdown = document.querySelector("#impact-breakdown");
    const error = document.querySelector("#impact-error");
    function calculate() {
      const fields = [...calculator.querySelectorAll("input")];
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      document.querySelector("#rate-value").textContent =
        `${calculator.elements.rate.value}%`;
      const invalid = fields.filter(
        (field) => !field.checkValidity() || field.value === "",
      );
      if (invalid.length) {
        invalid.forEach((field) => field.setAttribute("aria-invalid", "true"));
        total.textContent = "Confira os valores";
        breakdown.textContent = "";
        error.textContent =
          "Preencha valores não negativos dentro dos limites: até 10.000 pedidos ou faltas e R$ 100.000 por consulta. Pedidos e faltas devem ser inteiros.";
        return;
      }
      error.textContent = "";
      const [requests, ticket, absences, rate] = fields.map((field) =>
        Number(field.value),
      );
      const factor = rate / 100;
      const missed = requests * 4.33 * ticket * factor;
      const noShows = absences * ticket * factor;
      total.textContent = currency.format(missed + noShows);
      breakdown.textContent = `${currency.format(missed)} em pedidos sem agendamento + ${currency.format(noShows)} em faltas. Estimativa mensal bruta, sem descontar custos.`;
    }
    calculator.addEventListener("input", calculate);
    calculator.addEventListener("submit", (event) => event.preventDefault());
    calculate();
  }
  // Demonstração fictícia e cancelável. Não acessa WhatsApp ou Google Agenda.
  const demoControls = document.querySelector(".demo-controls");
  const demoConversation = document.querySelector("#demo-conversation");
  const examples = {
    booking: [
      ["patient", "Olá! Queria agendar uma avaliação."],
      [
        "assistant",
        "Olá, Ana! Será sua primeira visita ou você já se consultou aqui?",
      ],
      ["patient", "Será minha primeira visita."],
      [
        "assistant",
        "Seja bem-vinda! Temos quinta, às 15h. Funciona para você?",
      ],
      ["patient", "Sim, pode marcar!"],
      [
        "assistant",
        "Combinado, Ana! Quinta, às 15h. Um lembrete será enviado no dia anterior.",
      ],
    ],
    return: [
      ["patient", "Olá! Gostaria de agendar meu retorno."],
      ["assistant", "Olá! Você já se consultou aqui antes?"],
      ["patient", "Sim, quero marcar um retorno."],
      [
        "assistant",
        "Neste exemplo, terça às 16h está disponível. Quer confirmar?",
      ],
      ["patient", "Sim, esse fica melhor."],
      [
        "assistant",
        "Retorno confirmado neste exemplo. Se precisar, encaminho você para a equipe.",
      ],
    ],
    waitlist: [
      ["patient", "Se surgir uma vaga mais cedo, podem me avisar?"],
      [
        "assistant",
        "Quer entrar na lista de espera e receber um aviso por aqui?",
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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pause = document.querySelector("#demo-pause");
    const complete = document.querySelector("#demo-complete");
    let selected = "booking";
    let timer;
    let cursor = 0;
    let paused = false;
    let typing = null;
    function stopTimer() {
      clearTimeout(timer);
      typing?.remove();
      typing = null;
    }
    function bubble([speaker, text], index) {
      const el = document.createElement("div");
      el.className = `bubble ${speaker}`;
      el.textContent = text;
      const time = document.createElement("small");
      time.textContent = index < 2 ? "14:32" : "14:33";
      el.append(time);
      return el;
    }
    function finish() {
      stopTimer();
      while (cursor < examples[selected].length) {
        demoConversation.append(bubble(examples[selected][cursor], cursor));
        cursor++;
      }
      pause.disabled = true;
      pause.textContent = "Demonstração concluída";
      complete.disabled = true;
      demoConversation.scrollTop = demoConversation.scrollHeight;
    }
    function next() {
      if (paused || cursor >= examples[selected].length) return;
      typing = document.createElement("div");
      typing.className = `bubble ${examples[selected][cursor][0]} typing`;
      typing.setAttribute("aria-label", "Digitando…");
      typing.textContent = "Digitando";
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.setAttribute("aria-hidden", "true");
        dot.textContent = "·";
        typing.append(dot);
      }
      demoConversation.append(typing);
      demoConversation.scrollTop = demoConversation.scrollHeight;
      timer = setTimeout(() => {
        typing?.remove();
        typing = null;
        demoConversation.append(bubble(examples[selected][cursor], cursor));
        cursor++;
        demoConversation.scrollTop = demoConversation.scrollHeight;
        if (cursor === examples[selected].length) finish();
        else timer = setTimeout(next, 450);
      }, 800);
    }
    function start(key) {
      stopTimer();
      selected = key;
      cursor = 0;
      paused = false;
      demoControls
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item.dataset.demo === key)),
        );
      const label = document.createElement("span");
      label.className = "chat-label";
      label.textContent = "Exemplo fictício de atendimento";
      demoConversation.replaceChildren(label);
      pause.disabled = false;
      complete.disabled = false;
      pause.textContent = "Pausar demonstração";
      document.querySelector(".agenda-note strong").textContent = {
        booking: "Exemplo de primeira visita.",
        return: "Exemplo de retorno.",
        waitlist: "Exemplo de encaixe.",
      }[key];
      document.querySelector(".agenda-note div > span").textContent =
        "Nenhuma agenda real é acessada.";
      const [day, time] = {
        booking: ["QUI", "15h"],
        return: ["TER", "16h"],
        waitlist: ["AMANHÃ", "14h"],
      }[key];
      document.querySelector(".calendar-icon small").textContent = day;
      document.querySelector(".calendar-icon b").textContent = time;
      if (reduced.matches) finish();
      else next();
    }
    demoControls.hidden = false;
    document.querySelector(".demo-playback").hidden = false;
    demoControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-demo]");
      if (button && examples[button.dataset.demo]) start(button.dataset.demo);
    });
    pause.addEventListener("click", () => {
      paused = !paused;
      stopTimer();
      pause.textContent = paused
        ? "Continuar demonstração"
        : "Pausar demonstração";
      if (!paused) next();
    });
    complete.addEventListener("click", finish);
    reduced.addEventListener("change", () => {
      if (reduced.matches) finish();
    });
    // Pausa também quando o visitante muda de aba; retoma apenas por ação explícita.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && cursor < examples[selected].length && !paused)
        pause.click();
    });
    start(selected);
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
  // O atalho não cobre a calculadora, os planos, o formulário ou os contatos.
  const floating = document.querySelector(".floating-whatsapp");
  if (floating && "IntersectionObserver" in window) {
    const visibleSections = new Set();
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      floating.hidden = visibleSections.size > 0;
    });
    document
      .querySelectorAll(
        ".contact-section, .impact-section, .pricing-section, .footer",
      )
      .forEach((section) => visibility.observe(section));
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
