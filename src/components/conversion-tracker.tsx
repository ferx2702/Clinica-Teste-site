"use client";
import { useEffect } from "react";
import { sitePath } from "@/lib/site";
import { trackConversion } from "@/lib/analytics";
export function ConversionTracker() {
  useEffect(() => {
    function click(e: MouseEvent) {
      const anchor = e.target instanceof Element ? e.target.closest("a") : null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const placement = anchor.closest("header")
        ? "header"
        : anchor.closest("footer")
          ? "footer"
          : anchor.closest(".lead-panel")
            ? "interest_form"
            : "page";
      if (href.startsWith("https://wa.me/"))
        trackConversion("whatsapp_click", placement);
      else if (href.startsWith("tel:"))
        trackConversion("phone_click", placement);
      else if (href.startsWith("mailto:"))
        trackConversion("email_click", placement);
      else if (href === "#contato" || href === sitePath("/#contato"))
        trackConversion("contact_click", placement);
    }
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
