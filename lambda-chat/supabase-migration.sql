-- ============================================================
-- Migración Supabase para el chatbot de Siscoprint
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla de sesiones de chat
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          TEXT PRIMARY KEY,            -- UUID generado por el frontend
  greeting    TEXT NOT NULL DEFAULT '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de mensajes (historial de conversación)
CREATE TABLE IF NOT EXISTS chat_messages (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para obtener historial rápido por sesión
CREATE INDEX IF NOT EXISTS idx_chat_messages_session
  ON chat_messages (session_id, created_at ASC);

-- 3. Tabla de leads capturados desde el chat
CREATE TABLE IF NOT EXISTS chat_leads (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  TEXT REFERENCES chat_sessions(id) ON DELETE SET NULL,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  company     TEXT,
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS (Row Level Security) – La Lambda usa la Service Role Key
-- que bypasea RLS, así que estas policies solo protegen accesos
-- desde el frontend (anon key).
-- ============================================================

ALTER TABLE chat_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads     ENABLE ROW LEVEL SECURITY;

-- No permitir acceso directo desde el frontend (anon)
-- Solo la Lambda (service role) puede leer/escribir
CREATE POLICY "Service role only" ON chat_sessions  FOR ALL USING (false);
CREATE POLICY "Service role only" ON chat_messages  FOR ALL USING (false);
CREATE POLICY "Service role only" ON chat_leads     FOR ALL USING (false);
