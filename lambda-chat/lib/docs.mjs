/**
 * docs.mjs
 * Busca información técnica en el OpenAI Vector Store (fichas técnicas en PDF).
 * Usa OPENAI_VECTOR_STORE_ID del entorno.
 */

import { getOpenAI } from './openaiClient.mjs';

const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;
const MAX_RESULTS = 5;

/**
 * Busca en el vector store de fichas técnicas.
 * @param {string} query - Pregunta o términos de búsqueda
 * @param {number|null} idProducto - Si se conoce el idProducto, filtra resultados
 * @returns {{ results: Array, summary: string }}
 */
export async function searchDocs(query, idProducto = null) {
  if (!VECTOR_STORE_ID) {
    return { results: [], summary: 'Las fichas técnicas no están configuradas en este entorno.' };
  }

  const openai = getOpenAI();

  try {
    const searchParams = {
      query,
      max_num_results: MAX_RESULTS,
    };

    // Filtrar por idProducto si se especificó (nuevo formato de carpetas)
    if (idProducto) {
      searchParams.filters = {
        type: 'eq',
        key: 'idProducto',
        value: parseInt(idProducto),
      };
    }

    const response = await openai.vectorStores.search(VECTOR_STORE_ID, searchParams);

    if (!response.data?.length) {
      return { results: [], summary: 'No encontré información técnica específica para esa consulta.' };
    }

    // Extraer y combinar los fragmentos de texto relevantes
    const chunks = response.data.map(item => {
      const filename = item.filename ?? 'PDF desconocido';
      const text     = item.content?.map(c => c.text?.value ?? '').join(' ').trim() ?? '';
      return { filename, text, score: item.score ?? 0 };
    });

    // Resumen concatenado para el modelo
    const summary = chunks
      .map((c, i) => `[Fuente ${i + 1}: ${c.filename}]\n${c.text}`)
      .join('\n\n---\n\n');

    return { results: chunks, summary };
  } catch (err) {
    console.error('searchDocs error:', err.message);
    return { results: [], summary: 'Hubo un error al consultar las fichas técnicas.' };
  }
}
