import { createClient } from '@supabase/supabase-js';

/**
 * Singleton del cliente Supabase para la Lambda.
 * Usa la Service Role Key para tener acceso completo a las tablas.
 */
let _client;

export function getSupabase() {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
    }
    _client = createClient(url, key);
  }
  return _client;
}
