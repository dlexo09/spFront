import { getSupabase } from './supabaseClient.mjs';
import { getOpenAI } from './openaiClient.mjs';
import { searchProducts } from './products.mjs';
import { createZohoCRMLead } from './zoho.mjs';
import { searchDocs } from './docs.mjs';

/* ─── System Prompt ────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `Eres "Sisco", asesor virtual de ventas de Siscoprint (www.siscoprint.com), empresa mexicana con más de 15 años en soluciones de impresión para empresas, despachos, hospitales, escuelas e industria.

== NUESTRO NEGOCIO ==
Vendemos, rentamos y damos servicio a equipos de impresión profesional e industrial.

MARCAS QUE MANEJAMOS:
- Canon (impresión UVgel industrial, ej: Colorado Serie M)
- Epson (sublimación, eco-solvente, resina, fotografía, DTG, técnicos)
- Konica Minolta (prensa digital, impresión láser, AccurioPress, bizhub)
- Graphtec (plotters de corte, camas planas de corte)
- GBC (laminadoras, encuadernadoras)
- LSINC (impresoras industriales, PeriOne, PeriQ)
- Stratojet (impresoras UV cama plana, Shark, Falcon)
- Siscoprint (consumibles propios y accesorios)

FAMILIAS DE PRODUCTO:
- Sublimación: impresoras de sublimación (Epson SureColor F-series, planchas, calandras)
- Eco-solvente: impresión de gran formato para exteriores
- UV: impresión directa sobre materiales rígidos y flexibles
- UVgel: tecnología Canon para gran formato industrial
- Fotografía: impresoras profesionales de fotografía (Epson SureColor P-series)
- DTG: impresión directa sobre textiles (Epson SureColor F-series)
- Direct-to-Object: impresión directa sobre objetos 3D
- Resina: impresión de resina industrial (Epson SureColor R-series)
- Corte: plotters y camas planas de corte (Graphtec)
- Laminación: laminadoras GBC
- Prensa Digital: prensas Konica Minolta (AccurioPress)
- Impresión Láser: multifuncionales Konica Minolta
- Técnicos: planos, CAD, arquitectura (Epson SureColor T-series)

CATEGORÍAS:
Impresoras, Ploters, Ploter de corte, Prensa, Laminadoras, Planchas, Calandras, Cama plana de corte, Finalizadora, Alimentador automático de hojas, Impresoras Direct-to-Object

SUBCATEGORÍAS:
Industrial, Profesional, Semi-Profesional

CLIENTE TÍPICO: Empresas medianas/grandes, arquitectos, ingenieros, agencias de diseño, hospitales, escuelas, talleres de sublimación, imprentas.
PROCESO DE VENTA: Chat → Cotización formal → Demostración → Cierre. Los precios de lista son orientativos; los precios finales los da el asesor según volumen y condiciones.

== FICHAS TÉCNICAS ==
Usa search_technical_docs cuando el cliente pregunte por:
- Especificaciones técnicas (velocidad, resolución, gramaje, conectividad, dimensiones, consumibles compatibles)
- Comparar modelos o características de un equipo específico
- Preguntas como "¿qué incluye?", "¿cuántas hojas soporta?", "¿qué tinta usa?"
Puedes combinar search_products + search_technical_docs en la misma respuesta.

== CÓMO BUSCAR PRODUCTOS ==
Usa search_products con parámetros SEPARADOS. SIEMPRE intenta buscar cuando el cliente menciona un producto, modelo o marca.
- brand: la marca exacta ("Canon", "Epson", "Konica Minolta", "Graphtec", "GBC", "LSINC", "Stratojet", "Siscoprint")
- keyword: nombre del modelo, tipo de producto o palabra clave ("colorado", "surecolor", "sublimación", "plotter", "toner", "bizhub", "shark")
- categoria: categoría del producto ("Impresoras", "Ploters", "Ploter de corte", "Prensa", "Laminadoras", "Planchas")
- familia: familia de tecnología ("Sublimación", "UV", "UVgel", "Eco-solvente", "Fotografía", "DTG", "Corte", "Prensa Digital")

Ejemplos:
  "impresoras Epson" → search_products({ brand: "Epson" })
  "plotters de corte" → search_products({ keyword: "corte", brand: "Graphtec" })
  "toner konica" → search_products({ brand: "Konica Minolta", keyword: "toner" })
  "colorado" → search_products({ keyword: "colorado" })
  "impresora UV" → search_products({ familia: "UV" })
  "sublimación" → search_products({ familia: "Sublimación" })
  "prensa digital" → search_products({ familia: "Prensa Digital" })

Si la primera búsqueda no devuelve resultados, intenta una segunda búsqueda más amplia con keyword.

== FLUJO DE CONVERSACIÓN ==
1. ESCUCHAR: Pregunta qué necesita imprimir, en qué volumen y para qué giro/empresa.
2. BUSCAR: Usa search_products antes de recomendar CUALQUIER producto. Si no hay resultados, intenta con keyword más genérico.
3. MOSTRAR: Cuando search_products devuelva resultados, NO los listes en texto (SKU, precio, numerados, etc.). El widget ya muestra tarjetas visuales automáticamente. Solo escribe una frase corta de introducción como: "Encontré varias opciones que te pueden servir 👆" o "Aquí tienes algunas alternativas:". Si no hay resultados, dilo honestamente.
4. CALIFICAR: Evalúa el interés (escala 1-5). Solo usa create_crm_lead si score ≥ 3.
5. CAPTURAR: Pide nombre + email + empresa cuando el cliente quiera cotización o hablar con asesor.

== CALIFICACIÓN DE LEADS (piensa internamente antes de llamar create_crm_lead) ==
Score 1 – Solo curiosidad, sin intención de compra
Score 2 – Explorando opciones, sin urgencia
Score 3 – Necesidad clara, pide precio o cotización ← CREAR LEAD
Score 4 – Urgencia definida, menciona empresa o presupuesto ← CREAR LEAD
Score 5 – Listo para comprar, pide demostración o reunión ← CREAR LEAD PRIORITARIO

== REGLAS ==
- Responde SIEMPRE en español mexicano, cálido y profesional.
- Máximo 3 párrafos por respuesta. Sé concreto.
- NUNCA inventes productos ni precios. Solo muestra lo que devuelva search_products.
- Si no encuentras el producto: "No tenemos ese modelo específico, pero déjame buscar alternativas similares."
- Si el cliente quiere hablar con humano: pide nombre y correo, crea el lead con score 4+.
- No presiones. Asesora genuinamente.`;

/* ─── Tools para OpenAI Function Calling ──────────────────────────────────── */
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_products',
      description: 'Busca productos REALES en el catálogo de Siscoprint. SIEMPRE úsala antes de recomendar. Usa parámetros separados para mejores resultados: brand para la marca, keyword para tipo de producto.',
      parameters: {
        type: 'object',
        properties: {
          brand: {
            type: 'string',
            description: 'Marca exacta. Valores: "Canon", "Epson", "Konica Minolta", "Graphtec", "GBC", "LSINC", "Stratojet", "Siscoprint". Omitir si no se menciona marca.',
          },
          keyword: {
            type: 'string',
            description: 'Nombre del modelo o palabra clave. Ej: "colorado", "surecolor", "shark", "bizhub", "sublimación", "plotter", "toner", "cabezal".',
          },
          categoria: {
            type: 'string',
            description: 'Categoría del producto: "Impresoras", "Ploters", "Ploter de corte", "Prensa", "Laminadoras", "Planchas", "Calandras".',
          },
          familia: {
            type: 'string',
            description: 'Familia tecnológica: "Sublimación", "UV", "UVgel", "Eco-solvente", "Fotografía", "DTG", "Direct-to-Object", "Resina", "Corte", "Laminación", "Prensa Digital", "Impresión laser", "Técnicos".',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_technical_docs',
      description: 'Busca especificaciones técnicas y características detalladas en las fichas técnicas (PDFs) de los productos Siscoprint. Úsala cuando el cliente pregunte por especificaciones, velocidad, resolución, formatos soportados, consumibles compatibles u otros detalles técnicos.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Pregunta o términos de búsqueda. Ej: "velocidad de impresión Epson SC-F6470", "gramaje máximo GBC encuadernadora", "tintas compatibles SC-P700".',
          },
          idProducto: {
            type: 'number',
            description: 'ID numérico del producto en Siscoprint, si se conoce. Limita la búsqueda a la ficha de ese producto específico.',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_crm_lead',
      description: 'Crea un Lead en Zoho CRM cuando el cliente quiere cotización o hablar con un asesor. Úsala cuando tengas nombre + email del cliente.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre completo del cliente' },
          email: { type: 'string', description: 'Correo electrónico' },
          phone: { type: 'string', description: 'Teléfono (opcional)' },
          company: { type: 'string', description: 'Empresa u organización (opcional)' },
          interested_in: { type: 'string', description: 'Productos o servicios de interés' },
          message: { type: 'string', description: 'Resumen de lo que necesita el cliente' },
        },
        required: ['name', 'email'],
      },
    },
  },
];

const MAX_HISTORY = 16;
const MAX_TOOL_LOOPS = 5; // evitar loops infinitos

/* ─── Handler principal ────────────────────────────────────────────────────── */
export async function handleChat({ sessionId, message }) {
  if (!sessionId || !message) {
    return { reply: 'Ocurrió un error. Intenta de nuevo.', quickReplies: [] };
  }

  const supabase = getSupabase();
  const openai = getOpenAI();

  // 1. Guardar mensaje del usuario
  await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'user', content: message });

  // 2. Historial reciente
  const { data: history } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(MAX_HISTORY);

  // 3. Armar mensajes
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(history || []).map(m => ({ role: m.role, content: m.content })),
  ];

  let reply = 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
  let products = [];
  let crmResult = null;

  try {
    // 4. Agentic loop — OpenAI puede llamar tools múltiples veces
    let loops = 0;
    while (loops < MAX_TOOL_LOOPS) {
      loops++;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_tokens: 600,
        temperature: 0.5,
      });

      const choice = completion.choices[0];
      const assistantMsg = choice.message;
      messages.push(assistantMsg);

      // Sin tool calls → respuesta final
      if (choice.finish_reason !== 'tool_calls' || !assistantMsg.tool_calls?.length) {
        reply = assistantMsg.content?.trim() || reply;
        break;
      }

      // Ejecutar cada tool call
      for (const toolCall of assistantMsg.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments || '{}');
        console.log(`[TOOL_CALL] ${toolCall.function.name}`, JSON.stringify(args));
        let toolResult;

        if (toolCall.function.name === 'search_products') {
          const result = await searchProducts({ keyword: args.keyword, brand: args.brand, categoria: args.categoria, familia: args.familia });
          products = result.products || [];
          console.log(`[TOOL_RESULT] search_products → ${products.length} products found`);
          toolResult = products.length > 0
            ? `Encontré ${products.length} productos: ${products.map(p => `${p.name} (SKU: ${p.sku}, Precio: $${p.price})`).join(', ')}`
            : 'No encontré productos con ese criterio en el catálogo.';
        }

        if (toolCall.function.name === 'search_technical_docs') {
          const docResult = await searchDocs(args.query, args.idProducto ?? null);
          toolResult = docResult.summary || 'No encontré información técnica relevante.';
        }

        if (toolCall.function.name === 'create_crm_lead') {
          crmResult = await createZohoCRMLead(args, sessionId);
          toolResult = crmResult.ok
            ? `Lead creado exitosamente en CRM. ID: ${crmResult.leadId || 'generado'}`
            : `Error al crear lead: ${crmResult.error}`;
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }
    }
  } catch (err) {
    console.error('Chat error:', err.message, err.stack);
  }

  console.log(`[CHAT_DONE] session=${sessionId} products=${products.length} reply_len=${reply.length}`);

  // 5. Guardar respuesta del asistente
  await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'assistant', content: reply });

  // 6. Quick replies contextuales
  const quickReplies = buildQuickReplies(reply, products, crmResult);

  return { reply, products, quickReplies };
}

/* ─── Quick replies dinámicos ──────────────────────────────────────────────── */
function buildQuickReplies(reply, products, crmResult) {
  if (crmResult?.ok) return ['Ver más productos', 'Gracias, espero su contacto'];

  const r = reply.toLowerCase();
  const replies = [];

  if (products.length > 0) replies.push('Ver todos los resultados', 'Quiero cotizar este producto');
  if (r.includes('cotiz') || r.includes('precio')) replies.push('Solicitar cotización');
  if (r.includes('asesor') || r.includes('contacto')) replies.push('Sí, quiero que me contacten');
  if (replies.length === 0) replies.push('Ver catálogo', 'Solicitar cotización', 'Hablar con un asesor');

  return replies.slice(0, 3);
}
