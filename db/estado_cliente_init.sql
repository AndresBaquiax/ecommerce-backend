-- Idempotent creation script for estado_cliente
BEGIN;

-- Create table if missing
CREATE TABLE IF NOT EXISTS public.estado_cliente (
  id SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL UNIQUE,
  estado smallint NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_estado_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE
);

-- Create an index for faster joins (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND n.nspname = 'public' AND c.relname = 'idx_estado_cliente_id_usuario'
  ) THEN
    CREATE INDEX idx_estado_cliente_id_usuario ON public.estado_cliente (id_usuario);
  END IF;
END
$$;

COMMIT;
