-- ============================================================
-- Migración Supabase: Consumibles + Compatibilidad con Productos
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla principal de consumibles
CREATE TABLE IF NOT EXISTS consumibles (
  id              SERIAL PRIMARY KEY,
  sku             TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  tipo            TEXT NOT NULL CHECK (tipo IN ('Tinta', 'Papel', 'Kit', 'Repuesto', 'Otro')),
  descripcion     TEXT,
  imagen          TEXT,                        -- nombre de archivo, ej: T49M220.png
  precio          NUMERIC(12,2),
  precioPromocion NUMERIC(12,2),
  disponible      BOOLEAN NOT NULL DEFAULT true,
  status          INTEGER NOT NULL DEFAULT 1,  -- 1=activo, 0=inactivo
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de compatibilidad consumible ↔ producto (relación N:M)
--    Un consumible puede ser compatible con varios productos y
--    un producto puede tener varios consumibles.
CREATE TABLE IF NOT EXISTS consumibles_compatibilidad (
  consumible_sku  TEXT NOT NULL REFERENCES consumibles(sku) ON DELETE CASCADE,
  producto_sku    TEXT NOT NULL,               -- SKU del producto en tabla productos
  PRIMARY KEY (consumible_sku, producto_sku)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_consumibles_tipo    ON consumibles (tipo);
CREATE INDEX IF NOT EXISTS idx_consumibles_status  ON consumibles (status);
CREATE INDEX IF NOT EXISTS idx_compat_producto_sku ON consumibles_compatibilidad (producto_sku);
CREATE INDEX IF NOT EXISTS idx_compat_consumible   ON consumibles_compatibilidad (consumible_sku);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_consumibles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_consumibles_updated_at
  BEFORE UPDATE ON consumibles
  FOR EACH ROW EXECUTE FUNCTION update_consumibles_updated_at();

-- ============================================================
-- 3. Row Level Security (RLS)
-- ============================================================

ALTER TABLE consumibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumibles_compatibilidad ENABLE ROW LEVEL SECURITY;

-- Lectura pública (catálogo visible para todos)
CREATE POLICY "consumibles_public_read"
  ON consumibles FOR SELECT
  TO anon, authenticated
  USING (status = 1);

CREATE POLICY "compatibilidad_public_read"
  ON consumibles_compatibilidad FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo service_role puede insertar / actualizar / eliminar
CREATE POLICY "consumibles_service_write"
  ON consumibles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "compatibilidad_service_write"
  ON consumibles_compatibilidad FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. Datos iniciales (las 2 tintas que ya tenías en consumibles.json)
-- ============================================================

INSERT INTO consumibles (sku, nombre, tipo, descripcion, imagen, precio, precioPromocion)
VALUES
  ('T49M220', 'Tinta DS Cyan 140ml',    'Tinta', 'Tinta de sublimación DS Cyan 140ml — compatible con F570 / F571 / F170', 'T49M220.png', 335.00, NULL),
  ('T49M320', 'Tinta DS Magenta 140ml', 'Tinta', 'Tinta de sublimación DS Magenta 140ml — compatible con F570 / F170',    'T49M320.png', 335.00, NULL)
ON CONFLICT (sku) DO NOTHING;

-- Compatibilidades iniciales
-- T49M220 → F570 (SCF570LA) y F170 (C11CJ80201)
-- T49M320 → F570 (SCF570LA) y F170 (C11CJ80201)
INSERT INTO consumibles_compatibilidad (consumible_sku, producto_sku)
VALUES
  ('T49M220', 'C11CJ80201'),
  ('T49M220', 'SCF570LA'),
  ('T49M320', 'C11CJ80201'),
  ('T49M320', 'SCF570LA')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. Vista útil: consumibles con sus productos compatibles
--    (opcional, facilita queries complejas)
-- ============================================================

CREATE OR REPLACE VIEW v_consumibles_con_productos AS
SELECT
  c.id,
  c.sku,
  c.nombre,
  c.tipo,
  c.descripcion,
  c.imagen,
  c.precio,
  c.preciopromocion,
  c.disponible,
  ARRAY_AGG(cc.producto_sku) AS productos_compatibles
FROM consumibles c
LEFT JOIN consumibles_compatibilidad cc ON cc.consumible_sku = c.sku
WHERE c.status = 1
GROUP BY c.id, c.sku, c.nombre, c.tipo, c.descripcion, c.imagen, c.precio, c.preciopromocion, c.disponible;

-- ============================================================
-- CÓMO AGREGAR MÁS CONSUMIBLES:
--
-- INSERT INTO consumibles (sku, nombre, tipo, descripcion, imagen, precio)
-- VALUES ('T54C120', 'Tinta UltraChrome HDX Cyan 150ml', 'Tinta', 'Compatible con F11070', 'T54C120.png', 890.00);
--
-- INSERT INTO consumibles_compatibilidad (consumible_sku, producto_sku)
-- VALUES ('T54C120', 'SCF11070LA');
-- ============================================================
