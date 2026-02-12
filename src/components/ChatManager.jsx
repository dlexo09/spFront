import { useState } from "react";
import ZohoChat from "./ZohoChat";
import CustomChatWidget from "./CustomChatWidget";

/**
 * ChatManager - Componente para gestionar qué chat mostrar
 * 
 * Opciones:
 * 1. Usar variable de entorno VITE_CHAT_PROVIDER
 * 2. Usar props para elegir el proveedor
 * 3. Usar estado para alternar entre chats
 */

const ChatManager = ({ provider = "custom" }) => {
  // Opción 1: Usar variable de entorno
  const chatProvider = import.meta.env.VITE_CHAT_PROVIDER || provider;

  // Opción 2: Usar estado local para alternar (útil para testing)
  const [activeChat, setActiveChat] = useState(chatProvider);

  // Función para alternar entre chats (útil para desarrollo/testing)
  const toggleChat = () => {
    setActiveChat(prev => prev === "zoho" ? "custom" : "zoho");
  };

  return (
    <>
      {activeChat === "zoho" ? <ZohoChat /> : <CustomChatWidget />}
      
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
