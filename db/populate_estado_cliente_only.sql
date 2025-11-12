-- Create and populate estado_cliente FROM usuario (without modifying usuario table)
-- Idempotent: safe to run multiple times

-- 1) Create table if missing
CREATE TABLE IF NOT EXISTS public.estado_cliente (
  id SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL UNIQUE,
  estado smallint NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Create index if missing (for join performance)
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

-- 3) Try to add FK to usuario if not present (best-effort; will skip if permission/other issue)
DO $$
DECLARE
  has_fk boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE c.contype = 'f' AND c.conname = 'fk_estado_cliente_usuario' AND n.nspname = 'public'
  ) INTO has_fk;

  IF NOT has_fk THEN
    BEGIN
      ALTER TABLE public.estado_cliente
        ADD CONSTRAINT fk_estado_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON DELETE CASCADE;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add FK fk_estado_cliente_usuario: %', SQLERRM;
    END;
  END IF;
END
$$;

-- 4) Insert missing rows mapping boolean -> numeric (true->2, false->0)
INSERT INTO public.estado_cliente (id_usuario, estado, updated_at)
SELECT u.id_usuario,
       CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END,
       now()
FROM public.usuario u
WHERE NOT EXISTS (SELECT 1 FROM public.estado_cliente ec WHERE ec.id_usuario = u.id_usuario);

-- 5) Synchronize mismatched rows (keep estado_cliente in sync with usuario)
UPDATE public.estado_cliente ec
SET estado = src.usuario_estado, updated_at = now()
FROM (
  SELECT u.id_usuario,
         CASE WHEN pg_typeof(u.estado) = 'boolean'::regtype THEN (CASE WHEN u.estado THEN 2 ELSE 0 END) ELSE u.estado END AS usuario_estado
  FROM public.usuario u
) AS src
WHERE ec.id_usuario = src.id_usuario
  AND ec.estado IS DISTINCT FROM src.usuario_estado;

-- 6) Final counts for convenience (optional select if run interactively)
-- SELECT 'done' AS status, (SELECT count(*) FROM public.usuario) AS usuario_count, (SELECT count(*) FROM public.estado_cliente) AS estado_cliente_count;
