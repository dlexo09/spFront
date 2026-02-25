import { getSupabase } from './supabaseClient.mjs';
import { createZohoCRMLead } from './zoho.mjs';

/**
 * POST /lead
 * Body:  { sessionId, name?, email?, phone?, company?, message? }
 * Responde: { ok: boolean }
 */
export async function handleLead(body) {
  const { sessionId, name, email, phone, company, message } = body;

  if (!sessionId) {
    return { ok: false };
  }

  const supabase = getSupabase();

  // 1. Guardar en Supabase
  const { error } = await supabase.from('chat_leads').insert({
    session_id: sessionId,
    name: name || null,
    email: email || null,
    phone: phone || null,
    company: company || null,
    message: message || null,
  });

  if (error) {
    console.error('Error saving lead:', error);
  }

  // 2. Disparar webhook de Make (no bloquea si falla)
  if (email) {
    createZohoCRMLead({ name, email, phone, company, message }, sessionId)
      .catch(err => console.error('Make webhook error (lead):', err));
  }

  return { ok: true };
}
