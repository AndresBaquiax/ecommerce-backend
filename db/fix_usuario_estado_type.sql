-- Fix script: convert usuario.estado boolean -> smallint (idempotent)
-- Run this in the same connection where your 'usuario' table lives.

DO $$
BEGIN
  -- Only run if column exists and is boolean
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'estado' AND data_type = 'boolean'
  ) THEN
    -- Add helper column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='usuario' AND column_name='estado_tmp'
    ) THEN
      ALTER TABLE public.usuario ADD COLUMN estado_tmp smallint DEFAULT 2;
    END IF;

    -- Map values: true -> 2, false -> 0
    UPDATE public.usuario
    SET estado_tmp = CASE WHEN usuario.estado = true THEN 2 ELSE 0 END;

    -- Drop old boolean column and rename
    ALTER TABLE public.usuario DROP COLUMN estado;
    ALTER TABLE public.usuario RENAME COLUMN estado_tmp TO estado;
    ALTER TABLE public.usuario ALTER COLUMN estado SET DEFAULT 2;

    RAISE NOTICE 'usuario.estado converted from boolean to smallint successfully';
  ELSE
    RAISE NOTICE 'usuario.estado is not boolean (no conversion needed)';
  END IF;
END
$$;

-- After conversion, synchronize estado_cliente values with usuario
INSERT INTO public.estado_cliente (id_usuario, estado, updated_at)
SELECT u.id_usuario, u.estado, now()
FROM public.usuario u
WHERE NOT EXISTS (SELECT 1 FROM public.estado_cliente ec WHERE ec.id_usuario = u.id_usuario);

-- Update mismatches: set estado_cliente to usuario.estado when different
UPDATE public.estado_cliente ec
SET estado = u.estado, updated_at = now()
FROM public.usuario u
WHERE ec.id_usuario = u.id_usuario
  AND ec.estado IS DISTINCT FROM u.estado;

-- Final check message
SELECT 'fix_complete' AS status;
