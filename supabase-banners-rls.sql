-- ============================================================
-- Migracion Supabase: RLS publico para tabla banners
-- Ejecuta este SQL en: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================
--
-- Contexto importante:
-- - El sitio publico (spFront) consume la tabla banners con anon key.
-- - El panel actual tambien usa anon key para listar/crear/editar banners.
-- - Por lo tanto, no es posible diferenciar "publico" vs "admin" solo con RLS
--   mientras ambos usen el mismo rol anon.
--
-- Esta version habilita lectura publica para anon/authenticated sin romper el panel.
-- Si despues migras el panel a Supabase Auth o a un backend con service_role,
-- entonces si conviene endurecer la policy a solo banners activos/vigentes.

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "banners_public_read"
  ON banners FOR SELECT
  TO anon, authenticated
  USING (true);

-- Opcional: si quieres mantener escritura administrativa bajo RLS y aun no
-- migras el panel a auth real, necesitaras policies adicionales para anon.
-- Ejemplo abierto (solo si el panel deja de funcionar al crear/editar/eliminar):
--
-- CREATE POLICY "banners_anon_insert"
--   ON banners FOR INSERT
--   TO anon
--   WITH CHECK (true);
--
-- CREATE POLICY "banners_anon_update"
--   ON banners FOR UPDATE
--   TO anon
--   USING (true)
--   WITH CHECK (true);
--
-- CREATE POLICY "banners_anon_delete"
--   ON banners FOR DELETE
--   TO anon
--   USING (true);
--
-- Version estricta para mas adelante (NO aplicar hoy si el panel sigue con anon):
--
-- DROP POLICY IF EXISTS "banners_public_read" ON banners;
-- CREATE POLICY "banners_public_read_active_only"
--   ON banners FOR SELECT
--   TO anon
--   USING (
--     status = 1
--     AND (fhInicio IS NULL OR fhInicio <= CURRENT_DATE)
--     AND (fhFin IS NULL OR fhFin >= CURRENT_DATE)
--   );
