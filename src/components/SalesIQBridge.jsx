import { useEffect, useRef, useCallback } from "react";

/**
 * SalesIQBridge
 * 
 * Carga el widget de Zoho SalesIQ oculto.
 * Expone window.__salesiq con métodos para:
 *   - Verificar si hay agentes disponibles
 *   - Abrir el chat con contexto del visitante
 *   - Pasar datos del lead (nombre, email, producto de interés)
 * 
 * Props:
 *   - hidden: bool (default true) — mantiene el widget de Zoho oculto
 */

const SALESIQ_WIDGET_CODE = "siq242c574f3e7e611d95db60f9875ecf3fea104c301498479829b88ea48fb5f6c6";
const SALESIQ_SCRIPT_URL = `https://salesiq.zohopublic.com/widget?wc=${SALESIQ_WIDGET_CODE}`;

const SalesIQBridge = ({ hidden = true }) => {
  const loaded = useRef(false);
  const readyRef = useRef(false);

  // Inicializar SalesIQ
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // ── Inyectar CSS para ocultar SalesIQ ANTES de que cargue ──
    if (hidden) {
      const style = document.createElement("style");
      style.id = "salesiq-hide";
      style.textContent = `
        .zsiq_floatmain,
        .zls-sptwndw,
        .zsiq_theme1,
        .zsiq_cnt,
        .zsiq_flt_rel,
        [id^="zsiq"],
        .siqaio,
        .siq_bR {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      // Solo agregar si no existe ya
      if (!document.getElementById("salesiq-hide")) {
        document.head.appendChild(style);
      }
    }

    // Preparar namespace
    window.$zoho = window.$zoho || {};
    window.$zoho.salesiq = window.$zoho.salesiq || {
      ready: function () {
        readyRef.current = true;
        console.log("[SalesIQ] Widget ready");

        // Reforzar ocultamiento vía API
        if (hidden) {
          try {
            window.$zoho.salesiq.floatwindow.visible("hide");
          } catch (e) {
            console.log("[SalesIQ] floatwindow.visible not available yet");
          }
        }
      },
    };

    // Cargar script
    const script = document.createElement("script");
    script.id = "zsiqscript";
    script.src = SALESIQ_SCRIPT_URL;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const el = document.getElementById("zsiqscript");
      if (el) el.remove();
    };
  }, [hidden]);

  // Exponer API global para handoff
  useEffect(() => {
    window.__salesiq = {
      /**
       * ¿Está listo el widget de SalesIQ?
       */
      isReady() {
        return readyRef.current;
      },

      /**
       * Abrir SalesIQ con contexto del visitante.
       * @param {Object} opts
       * @param {string} opts.name - Nombre del visitante
       * @param {string} opts.email - Email
       * @param {string} opts.phone - Teléfono (opcional)
       * @param {string} opts.company - Empresa (opcional)
       * @param {string} opts.message - Resumen de la conversación con el bot
       * @param {string} opts.product - Producto de interés
       */
      handoff({ name, email, phone, company, message, product } = {}) {
        console.log("[SalesIQ] Handoff triggered", { name, email, product });

        try {
          const siq = window.$zoho?.salesiq;
          if (!siq) {
            console.warn("[SalesIQ] Widget not loaded, opening fallback");
            window.open("https://www.siscoprint.com/contacto", "_blank");
            return false;
          }

          // ── Pasar datos del visitante ──
          if (name) siq.visitor.name(name);
          if (email) siq.visitor.email(email);
          if (phone) siq.visitor.contactnumber(phone);

          // Info adicional visible para el agente
          siq.visitor.info({
            "Empresa": company || "No especificada",
            "Producto de interés": product || "No especificado",
            "Canal": "Chat AI → Handoff",
            "Resumen": (message || "").slice(0, 500),
          });

          // Quitar CSS de ocultamiento si existe
          const hideStyle = document.getElementById("salesiq-hide");
          if (hideStyle) hideStyle.remove();

          // Mostrar y abrir el widget
          siq.floatwindow.visible("show");

          // Enviar mensaje automático al agente con contexto
          const autoMessage = [
            `Hola, soy ${name || "un visitante"} de ${company || "Siscoprint.com"}.`,
            product ? `Estoy interesado/a en: ${product}.` : "",
            message ? `Resumen: ${message}` : "",
            "El asistente virtual me transfirió con un asesor.",
          ]
            .filter(Boolean)
            .join(" ");

          // Trigger chat con mensaje
          setTimeout(() => {
            try {
              siq.floatwindow.open(autoMessage);
            } catch {
              siq.floatwindow.visible("show");
            }
          }, 500);

          return true;
        } catch (err) {
          console.error("[SalesIQ] Handoff error:", err);
          return false;
        }
      },
    };

    return () => {
      delete window.__salesiq;
    };
  }, []);

  return null; // No renderiza nada
};

export default SalesIQBridge;
