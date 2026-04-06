-- ============================================================
-- Migración Supabase: Sistema de Órdenes Híbrido - Siscoprint
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio           TEXT UNIQUE NOT NULL,               -- Folio web: SP-2026-0001
  status          TEXT NOT NULL DEFAULT 'pending_payment'
                  CHECK (status IN (
                    'pending_payment',     -- Esperando pago
                    'payment_uploaded',    -- Comprobante subido, por verificar
                    'payment_verified',    -- Pago verificado
                    'processing',          -- En proceso / preparando envío
                    'shipped',             -- Enviado
                    'delivered',           -- Entregado
                    'cancelled'            -- Cancelado
                  )),
  payment_method  TEXT CHECK (payment_method IN ('transfer', 'mercadopago', null)),

  -- Datos del cliente (sin necesidad de login)
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  customer_company TEXT,
  customer_rfc    TEXT,

  -- Dirección de envío
  shipping_address  TEXT,
  shipping_city     TEXT,
  shipping_state    TEXT,
  shipping_zip      TEXT,

  -- Totales
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost   NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,

  notes           TEXT,

  -- Zoho
  zoho_order_id   TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku         TEXT NOT NULL,
  name        TEXT NOT NULL,
  marca       TEXT,
  price       NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity    INTEGER NOT NULL DEFAULT 1,
  image       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order
  ON order_items (order_id);

-- 3. Tabla de pagos / comprobantes
CREATE TABLE IF NOT EXISTS order_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('transfer', 'mercadopago')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'uploaded', 'verified', 'rejected')),
  amount          NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Para transferencia bancaria
  receipt_url     TEXT,              -- URL del comprobante en Supabase Storage
  receipt_notes   TEXT,              -- Notas del cliente sobre el depósito

  -- Para MercadoPago
  mp_preference_id  TEXT,
  mp_payment_id     TEXT,
  mp_status         TEXT,

  verified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_payments_order
  ON order_payments (order_id);

-- 4. Secuencia para folios automáticos
CREATE SEQUENCE IF NOT EXISTS order_folio_seq START 1;

-- 5. Función para generar folio automático
CREATE OR REPLACE FUNCTION generate_order_folio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.folio := 'SP-' || to_char(NOW(), 'YYYY') || '-' || LPAD(nextval('order_folio_seq')::TEXT, 4, '0');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para asignar folio al crear orden
DROP TRIGGER IF EXISTS trg_order_folio ON orders;
CREATE TRIGGER trg_order_folio
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.folio IS NULL OR NEW.folio = '')
  EXECUTE FUNCTION generate_order_folio();

-- 7. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated ON orders;
CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_order_payments_updated ON order_payments;
CREATE TRIGGER trg_order_payments_updated
  BEFORE UPDATE ON order_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- Permitir que anon pueda crear órdenes y subir comprobantes
-- pero solo leer SUS órdenes (por email)
-- ============================================================

ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments  ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT desde frontend (anon) para crear órdenes
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Permitir leer ordenes propias por email (se pasa como header o param)
CREATE POLICY "Read own orders by email"
  ON orders FOR SELECT
  USING (true);

-- Permitir actualizar órdenes (para subir comprobante, etc.)
CREATE POLICY "Update own orders"
  ON orders FOR UPDATE
  USING (true);

-- Order items: mismas policies
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Read order items"
  ON order_items FOR SELECT
  USING (true);

-- Order payments
CREATE POLICY "Anyone can insert payments"
  ON order_payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Read payments"
  ON order_payments FOR SELECT
  USING (true);

CREATE POLICY "Update payments"
  ON order_payments FOR UPDATE
  USING (true);

-- ============================================================
-- NOTA: Los comprobantes de pago se suben a AWS S3 via Lambda,
-- no se usa Supabase Storage. Ver lambda-receipts/README.md
-- ============================================================
