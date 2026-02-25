/**
 * Integración con Make (webhook) – simula creación de Oportunidad en CRM
 *
 * Variable de entorno requerida en Lambda:
 *   MAKE_WEBHOOK_URL  – URL del webhook de Make
 *                       Ej: https://hook.us1.make.com/abc123xyz
 *
 * Make recibe el payload y puede:
 *   - Enviar email al equipo de ventas
 *   - Crear contacto en Zoho CRM / Books
 *   - Notificar por WhatsApp / Slack
 *   - Cualquier otra automatización
 */

export async function createZohoCRMLead({ name, email, phone, company, interested_in, message }, sessionId) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('MAKE_WEBHOOK_URL no configurado – saltando notificación');
    return { ok: true, leadId: null, skipped: true };
  }

  try {
    const payload = {
      // Datos del prospecto
      name:         name || '',
      email:        email || '',
      phone:        phone || '',
      company:      company || '',
      interested_in: interested_in || '',
      message:      message || '',

      // Metadatos para Make
      source:       'Chat Web – Siscoprint',
      session_id:   sessionId || '',
      timestamp:    new Date().toISOString(),
      url:          'https://www.siscoprint.com',
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Make webhook error:', res.status, body);
      return { ok: false, error: `Make respondió ${res.status}` };
    }

    console.log('✅ Lead enviado a Make webhook');
    return { ok: true, leadId: `make-${Date.now()}` };
  } catch (err) {
    console.error('createZohoCRMLead (Make) error:', err);
    return { ok: false, error: err.message };
  }
}
