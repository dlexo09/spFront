-- ============================================================
-- Migración Supabase: Autenticación + Auto-cancelación
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → New Query
-- DESPUÉS de haber ejecutado supabase-orders-migration.sql
-- ============================================================

-- 1. Agregar columna user_id a orders (vincula orden con usuario autenticado)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- 2. Actualizar RLS para que usuarios autenticados vean solo sus órdenes
--    (Mantener las políticas abiertas actuales para anon/guest checkout)

-- Política: usuario autenticado puede leer sus propias órdenes por user_id
CREATE POLICY "Authenticated users read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR customer_email = (auth.jwt() ->> 'email'));

-- Política: usuario autenticado puede actualizar sus propias órdenes
CREATE POLICY "Authenticated users update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR customer_email = (auth.jwt() ->> 'email'));

-- 3. Auto-cancelar órdenes pendientes de pago después de 24 horas
--    Ejecutar como función que se puede llamar via pg_cron o Supabase Edge Function
CREATE OR REPLACE FUNCTION auto_cancel_expired_orders()
RETURNS INTEGER AS $$
DECLARE
  cancelled_count INTEGER;
BEGIN
  UPDATE orders
  SET status = 'cancelled',
      notes = COALESCE(notes, '') || ' [Auto-cancelado: sin pago en 24h]'
  WHERE status = 'pending_payment'
    AND created_at < NOW() - INTERVAL '24 hours';

  GET DIAGNOSTICS cancelled_count = ROW_COUNT;
  RETURN cancelled_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Para habilitar pg_cron (requiere activar la extensión en Supabase Dashboard):
-- Ir a: Database → Extensions → Buscar "pg_cron" → Activar
--
-- Luego ejecutar:
-- SELECT cron.schedule(
--   'auto-cancel-expired-orders',        -- nombre del job
--   '0 * * * *',                          -- cada hora
--   $$ SELECT auto_cancel_expired_orders() $$
-- );

-- ============================================================
-- NOTA: Supabase Auth está habilitado por defecto.
-- Solo necesitas configurar en:
-- Authentication → Providers → Email (ya viene habilitado)
-- Authentication → URL Configuration → Site URL
-- ============================================================
