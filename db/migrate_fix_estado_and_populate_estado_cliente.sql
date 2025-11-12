-- Migration: convert usuario.estado boolean -> smallint and populate estado_cliente
-- Idempotent: safe to run multiple times

BEGIN;

-- 1) If usuario.estado is boolean, convert it to smallint (true -> 2, false -> 0)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'estado' AND data_type = 'boolean'
  ) THEN
    -- Add temp column
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='usuario' AND column_name='estado_tmp'
    ) THEN
      ALTER TABLE public.usuario ADD COLUMN estado_tmp smallint DEFAULT 2;
    END IF;

    -- Map boolean -> numeric states: true => 2 (Posible), false => 0 (Inactivo)
    UPDATE public.usuario SET estado_tmp = CASE WHEN estado = true THEN 2 ELSE 0 END;

    -- Drop old boolean column and rename
    ALTER TABLE public.usuario DROP COLUMN estado;
    ALTER TABLE public.usuario RENAME COLUMN estado_tmp TO estado;
    ALTER TABLE public.usuario ALTER COLUMN estado SET DEFAULT 2;
  END IF;
END
$$;

-- 2) Ensure estado_cliente table exists (used by backend entity)
CREATE TABLE IF NOT EXISTS public.estado_cliente (
  id SERIAL PRIMARY KEY,
  id_usuario integer NOT NULL UNIQUE,
  estado smallint NOT NULL DEFAULT 2,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index if missing
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

-- 3) Populate estado_cliente from usuario for users missing a row
INSERT INTO public.estado_cliente (id_usuario, estado, updated_at)
SELECT u.id_usuario, u.estado, now()
FROM public.usuario u
WHERE NOT EXISTS (
  SELECT 1 FROM public.estado_cliente ec WHERE ec.id_usuario = u.id_usuario
);

COMMIT;
