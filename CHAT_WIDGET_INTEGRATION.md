# Integración del Chat Widget Personalizado

## Descripción

Se ha integrado un sistema de chat que permite alternar entre el chat de Zoho SalesIQ y un widget de chat personalizado.

## Archivos Creados

1. **`src/components/CustomChatWidget.jsx`** - Componente que carga el widget personalizado (chat-widget.js)
2. **`src/components/ChatManager.jsx`** - Componente gestor que permite alternar entre chats

## Archivos Modificados

1. **`src/App.jsx`** - Actualizado para usar ChatManager en lugar de ZohoChat directamente
2. **`.env.example`** - Agregada variable VITE_CHAT_PROVIDER

## Configuración

### 1. Variables de Entorno

Crea o actualiza tu archivo `.env` con:

```env
# Chat Provider: "zoho" o "custom"
VITE_CHAT_PROVIDER=custom
```

- **`custom`**: Usa el widget personalizado (chat-widget.js)
- **`zoho`**: Usa el chat de Zoho SalesIQ

### 2. Uso en Producción

En el archivo `App.jsx`, el ChatManager se usa así:

```jsx
<ChatManager provider="custom" />
```

Si prefieres usar la variable de entorno, simplemente usa:

```jsx
<ChatManager />
```

El componente automáticamente usará el valor de `VITE_CHAT_PROVIDER`.

## Características

### Modo Desarrollo

En modo desarrollo (`npm run dev`), aparece un botón flotante que permite alternar entre Zoho y el widget personalizado para hacer pruebas.

### Modo Producción

En producción, el botón de alternancia no se muestra y solo se usa el chat configurado.

## Estructura del Widget Personalizado

El archivo `chat-widget.js` se encuentra en la carpeta `public/` y se carga dinámicamente cuando se selecciona el proveedor "custom".

### Funcionamiento

1. El componente `CustomChatWidget` carga el script `/chat-widget.js`
2. El script se ejecuta y monta el widget en el div `#chat-widget-root`
3. Cuando el componente se desmonta, se limpia el script y el contenedor

## Limpieza y Optimización

El sistema incluye limpieza automática:
- Remueve los scripts cuando cambia de proveedor
- Limpia los contenedores DOM
- Previene memory leaks

## Testing

Para probar ambos chats en desarrollo:

1. Ejecuta `npm run dev`
2. Observa el botón flotante en la esquina inferior derecha
3. Haz clic para alternar entre Zoho y Custom
4. Verifica que ambos funcionan correctamente

## Troubleshooting

### El widget personalizado no carga

1. Verifica que `chat-widget.js` está en la carpeta `public/`
2. Revisa la consola del navegador para errores
3. Verifica que el archivo tiene permisos de lectura

### Ambos chats aparecen al mismo tiempo

- Esto no debería ocurrir. Verifica que solo hay un `<ChatManager>` en App.jsx
- Limpia la caché del navegador

### El botón de alternancia aparece en producción

- Verifica que estás ejecutando un build de producción: `npm run build`
- El botón solo debería aparecer en modo desarrollo

## Próximos Pasos Sugeridos

1. **Personalizar el widget**: Edita el código fuente del widget personalizado según tus necesidades
2. **Estilizar**: Ajusta los estilos para que coincidan con tu diseño
3. **Analytics**: Agregar tracking de eventos del chat
4. **Testing**: Crear tests unitarios para los componentes de chat
5. **Documentación**: Documentar las funcionalidades del widget personalizado

## Dependencias

El widget personalizado usa React y ReactDOM que ya están incluidos en tu proyecto. No requiere instalación de paquetes adicionales.
