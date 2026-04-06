import { useState } from "react";
import ZohoChat from "./ZohoChat";
import CustomChatWidget from "./CustomChatWidget";
import SalesIQBridge from "./SalesIQBridge";

/**
 * ChatManager - Componente para gestionar qué chat mostrar
 * 
 * En modo "custom": Carga el chat AI de Sisco + SalesIQ oculto para handoff.
 * En modo "zoho": Solo el widget de Zoho SalesIQ directo.
 */

const ChatManager = ({ provider = "custom" }) => {
  const chatProvider = import.meta.env.VITE_CHAT_PROVIDER || provider;
  const [activeChat, setActiveChat] = useState(chatProvider);

  const toggleChat = () => {
    setActiveChat(prev => prev === "zoho" ? "custom" : "zoho");
  };

  return (
    <>
      {activeChat === "zoho" ? (
        <ZohoChat />
      ) : (
        <>
          <CustomChatWidget />
          {/* SalesIQ cargado oculto, listo para handoff desde el chat AI */}
          <SalesIQBridge hidden={true} />
        </>
      )}
      
      {/* Botón de desarrollo - remover en producción */}
      {import.meta.env.DEV && (
        <button
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            zIndex: 9999,
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Cambiar a {activeChat === "zoho" ? "Custom" : "Zoho"} Chat
        </button>
      )}
    </>
  );
};

export default ChatManager;
