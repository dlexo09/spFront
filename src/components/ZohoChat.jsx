import { useEffect } from "react";

const ZohoChat = () => {
  useEffect(() => {
    // Agregar el script de Zoho al cargar el componente
    const zohoScript = document.createElement("script");
    zohoScript.text = `
      window.$zoho=window.$zoho || {};
      $zoho.salesiq=$zoho.salesiq||{ready:function(){}};
    `;
    document.body.appendChild(zohoScript);

    const zohoScriptSrc = document.createElement("script");
    zohoScriptSrc.id = "zsiqscript";
    zohoScriptSrc.src = "https://salesiq.zohopublic.com/widget?wc=siq242c574f3e7e611d95db60f9875ecf3fea104c301498479829b88ea48fb5f6c6";
    zohoScriptSrc.defer = true;
    document.body.appendChild(zohoScriptSrc);

    return () => {
      // Limpiar los scripts si el componente se desmonta
      document.body.removeChild(zohoScript);
      document.body.removeChild(zohoScriptSrc);
    };
  }, []);

  return null; // Este componente no renderiza nada visualmente
};

export default ZohoChat;