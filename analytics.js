/* GA4 em modo básico: nenhum contato com o Google antes de aceitar. */
(() => {
  "use strict";
  const id = window.SECRETARIA_CONFIG?.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id || "")) return;
  const key = "secretaria.analytics-consent.v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const directory = new URL(".", window.location.href).pathname;
  const events = new Set([
    "whatsapp_click",
    "phone_click",
    "email_click",
    "contact_click",
    "form_attempt",
    "form_unavailable",
    "form_error",
    "generate_lead",
  ]);
  const placements = new Set([
    "header",
    "hero",
    "features",
    "plan-essential",
    "plan-agenda",
    "plan-custom",
    "final",
    "floating",
    "footer",
    "page",
    "interest_form",
  ]);
  let choice = null;
  let initialized = false;
  let opener = null;
  try {
    const stored = JSON.parse(window.localStorage.getItem(key));
    if (
      stored &&
      ["accepted", "rejected"].includes(stored.choice) &&
      stored.expiresAt > Date.now() &&
      stored.expiresAt <= Date.now() + lifetime
    )
      choice = stored.choice;
  } catch {
    /* Armazenamento bloqueado ou inválido: solicite a escolha novamente. */
  }
  window[`ga-disable-${id}`] = choice !== "accepted";
  // URLs nunca incluem query string ou fragmento (que podem conter informações pessoais).
  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  let referrer = "";
  try {
    const ref = new URL(document.referrer);
    referrer = ref.origin;
  } catch {
    /* Sem referência válida. */
  }
  function start() {
    window[`ga-disable-${id}`] = false;
    if (initialized) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      return;
    }
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("set", { page_location: pageUrl, page_referrer: referrer });
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_path: directory,
      cookie_expires: lifetime / 1000,
      page_location: pageUrl,
      page_referrer: referrer,
    });
    window.gtag("event", "page_view", {
      send_to: id,
      page_location: pageUrl,
      page_referrer: referrer,
      page_title: document.title,
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    tag.id = "ga4-tag";
    document.head.append(tag);
  }
  function removeCookies() {
    const names = ["_ga", `_ga_${id.slice(2)}`];
    for (const name of names) {
      for (const path of new Set([
        directory,
        directory.replace(/\/$/, "") || "/",
        "/",
      ])) {
        for (const domain of [
          "",
          window.location.hostname,
          `.${window.location.hostname}`,
        ]) {
          document.cookie = `${name}=; Max-Age=0; path=${path}; SameSite=Lax${domain ? `; domain=${domain}` : ""}`;
        }
      }
    }
  }
  if (choice !== "accepted") removeCookies();
  const panel = document.createElement("section");
  panel.className = "consent-panel";
  panel.setAttribute("aria-label", "Preferências de privacidade");
  panel.innerHTML = `<div class="consent-content"><strong>Você escolhe como medir nossas visitas.</strong><p>Com sua permissão, usamos o Google Analytics para entender visitas e cliques. Não enviamos os dados do formulário ao Analytics. Você pode recusar e continuar usando o site.</p><a href="privacidade.html">Saiba mais na Política de Privacidade</a></div><div class="consent-actions"><button type="button" class="button button-outline" data-consent="rejected">Recusar Analytics</button><button type="button" class="button button-outline" data-consent="accepted">Aceitar Analytics</button></div>`;
  panel.hidden = true;
  document.body.append(panel);
  const preferences = document.createElement("button");
  preferences.type = "button";
  preferences.className = "privacy-preferences";
  preferences.textContent = "Preferências de privacidade";
  (
    document.querySelector(".footer-bottom") ||
    document.querySelector(".legal-footer nav") ||
    document.body
  ).append(preferences);
  function show() {
    panel.hidden = false;
    document.body.classList.add("consent-open");
  }
  function hide() {
    panel.hidden = true;
    document.body.classList.remove("consent-open");
  }
  preferences.addEventListener("click", () => {
    opener = preferences;
    show();
    panel.querySelector("button").focus({ preventScroll: true });
  });
  panel.addEventListener("click", (e) => {
    const button = e.target.closest("[data-consent]");
    if (!button) return;
    choice = button.dataset.consent;
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify({ choice, expiresAt: Date.now() + lifetime }),
      );
    } catch {
      /* A escolha ainda vale nesta página. */
    }
    if (choice === "accepted") start();
    else {
      window[`ga-disable-${id}`] = true;
      if (initialized)
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      removeCookies();
    }
    hide();
    if (opener) {
      opener.focus({ preventScroll: true });
      opener = null;
    }
  });
  window.addEventListener("clara:conversion", (e) => {
    if (choice !== "accepted" || !events.has(e.detail?.event)) return;
    window.gtag("event", e.detail.event, {
      send_to: id,
      placement: placements.has(e.detail.placement)
        ? e.detail.placement
        : "page",
      page_location: pageUrl,
      page_referrer: referrer,
    });
  });
  if (choice === "accepted") start();
  else if (!choice) show();
})();
