import { useEffect, useState } from "react";

const CustomChatWidget = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // ── Configurar el widget para que apunte al API Gateway de AWS ──
    window.chatConfig = {
      apiUrl: import.meta.env.VITE_CHAT_API_URL || "/api",
      tenantId: "siscoprint",
    };

    // ── Interceptar fetch para detectar handoff en respuesta del /chat ──
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url || "";

      // Solo interceptar POST /chat
      if (url.includes("/chat") && !url.includes("/chat/session")) {
        try {
          const clone = response.clone();
          const data = await clone.json();

          if (data.handoff && window.__salesiq) {
            console.log("[Handoff] Detected, transferring to SalesIQ");
            // Dar un momento para que el widget muestre el mensaje de despedida
            setTimeout(() => {
              window.__salesiq.handoff({
                name: data.handoff.name || "",
                email: data.handoff.email || "",
                phone: data.handoff.phone || "",
                company: data.handoff.company || "",
                message: data.handoff.summary || "",
                product: data.handoff.product || "",
              });
            }, 2000);
          }
        } catch {
          // Ignorar errores de parseo
        }
      }

      return response;
    };

    // Cargar el script del widget personalizado
    const script = document.createElement("script");
    script.src = "/chat-widget.js";
    script.async = true;
    script.onload = () => {
      console.log("Chat widget personalizado cargado");
    };
    script.onerror = () => {
      console.error("Error al cargar el chat widget personalizado");
    };
    
    document.body.appendChild(script);

    return () => {
      // Restaurar fetch original
      window.fetch = originalFetch;

      // Limpiar el script cuando el componente se desmonte
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      
      // Remover el contenedor del widget si existe
      const widgetContainer = document.getElementById("chat-widget-root");
      if (widgetContainer && widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }
    };
  }, []);

  return (
    <div onClick={() => setShowTooltip(false)}>
      <div id="chat-widget-root"></div>
      {showTooltip && (
        <div
          style={{
            position: "fixed",
            bottom: "78px",
            right: "24px",
            zIndex: 99998,
            background: "#1e1e3f",
            color: "white",
            padding: "7px 13px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          💬 ¿Necesitas ayuda?
        </div>
      )}
    </div>
  );
};

export default CustomChatWidget;
