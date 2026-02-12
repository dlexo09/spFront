import { useEffect } from "react";

const CustomChatWidget = () => {
  useEffect(() => {
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
