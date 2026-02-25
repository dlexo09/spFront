import { useEffect } from "react";

const CustomChatWidget = () => {
  useEffect(() => {
    // ── Configurar el widget para que apunte al API Gateway de AWS ──
    // Cambia la URL cuando tengas tu API Gateway desplegado
    window.chatConfig = {
      apiUrl: import.meta.env.VITE_CHAT_API_URL || "/api",
      tenantId: "siscoprint",
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
    <div id="chat-widget-root"></div>
  );
};

export default CustomChatWidget;
