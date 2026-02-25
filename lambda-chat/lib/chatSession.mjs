import { randomUUID } from 'crypto';
import { getSupabase } from './supabaseClient.mjs';

/**
 * POST /chat/session
 * Body:  { sessionId?: string }   ← sessionId es opcional; si no viene se genera uno nuevo
 * Responde: { sessionId, greeting }
 *
 * Crea o reutiliza una sesión en la tabla `chat_sessions`.
 */
export async function handleChatSession({ sessionId } = {}) {
  // Si no viene sessionId, generar uno nuevo
  if (!sessionId) {
    sessionId = randomUUID();
  }

  const supabase = getSupabase();

  // Buscar sesión existente
  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('id, greeting')
    .eq('id', sessionId)
    .maybeSingle();

  if (existing) {
    return { sessionId: existing.id, greeting: existing.greeting };
  }

  // Crear nueva sesión
  const greeting = '¡Hola! 👋 Soy el asistente virtual de Siscoprint. ¿En qué puedo ayudarte hoy?';

  const { error } = await supabase.from('chat_sessions').insert({
    id: sessionId,
    greeting,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error creating session:', error);
  }

  return { sessionId, greeting };
}
